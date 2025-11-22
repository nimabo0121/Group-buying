<template>
  <div class="shop-order-page">
    <!-- 店家標題列 -->
    <div class="shop-header">
      <button
        class="back-btn"
        @click="goBack"
      >
        ‹
      </button>
      <h2 class="shop-name">
        {{ shopName }}
      </h2>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="loading-container"
    >
      <div class="loading-spinner" />
      <p>載入中...</p>
    </div>

    <!-- 商品內容 -->
    <div
      v-else-if="product"
      class="product-container"
    >
      <!-- 商品圖片輪播 -->
      <ProductCarousel :images="product.images" />

      <!-- 倒數計時 -->
      <div class="content-section">
        <CountdownBanner :flash-sale="product.flashSale" />
      </div>

      <!-- 商品資訊 -->
      <div class="content-section">
        <ProductInfo :product="product" />
      </div>

      <!-- 規格選擇 -->
      <div
        v-for="spec in product.specs"
        :key="spec.id"
        class="content-section"
      >
        <SpecSelector
          v-model="selectedSpecs[spec.id]"
          :spec="spec"
        />
      </div>

      <!-- 加購項目 -->
      <div
        v-if="product.addons?.length"
        class="content-section"
      >
        <AddonSelector
          v-model="selectedAddons"
          :addons="product.addons"
        />
      </div>

      <!-- 數量選擇 -->
      <div class="content-section">
        <QuantitySelector
          v-model="quantity"
          :max="maxQty"
        />
      </div>

      <!-- 總計與下單按鈕 -->
      <div class="order-summary">
        <div class="summary-content">
          <div
            v-if="hasSelectedSpecs"
            class="total-section"
          >
            <span class="total-label">總計</span>
            <span class="total-amount">NT${{ formatPrice(totalAmount) }}</span>
          </div>
          <div
            v-else
            class="total-section placeholder"
          >
            <span class="total-label">請選擇規格</span>
          </div>

          <button
            class="submit-btn"
            :disabled="!canSubmit || product.stock <= 0"
            @click="submitOrder"
          >
            <span
              v-if="submitting"
              class="btn-loading"
            >處理中...</span>
            <span v-else>
              {{ product.submitButtonText || '立刻下單' }}
            </span>
          </button>

          <div
            v-if="product.stock <= 0"
            class="sold-out-msg"
          >
            很抱歉,此商品已售完
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Productdata } from '@/utils/api/apiClient';
import ProductCarousel from '@/components/product/ProductCarousel.vue';
import ProductInfo from '@/components/product/ProductInfo.vue';
import QuantitySelector from '@/components/product/QuantitySelector.vue';
import SpecSelector from '@/components/product/SpecSelector.vue';
import AddonSelector from '@/components/product/AddonSelector.vue';
import CountdownBanner from '@/components/product/CountdownBanner.vue';

const router = useRouter();
const shopID = ref(new URLSearchParams(window.location.search).get('shopID'));
const uuid = ref(new URLSearchParams(window.location.search).get('name'));

const loading = ref(true);
const submitting = ref(false);
const shopName = ref('');
const product = ref(null);
const quantity = ref(1);
const selectedSpecs = ref({});
const selectedAddons = ref([]);

// 計算屬性
const finalPrice = computed(() => {
  if (!product.value) return 0;
  const rate = product.value.discountRate ?? 10;
  return Math.round((product.value.originalPrice * rate) / 10 / 10) * 10;
});

const totalAmount = computed(() => {
  let total = finalPrice.value * quantity.value;

  Object.values(selectedSpecs.value).forEach((val) => {
    const item = product.value?.specs
      ?.flatMap((s) => s.items)
      .find((i) => i.value === val);
    if (item?.extraPrice) total += item.extraPrice * quantity.value;
  });

  selectedAddons.value.forEach((a) => (total += a.price * quantity.value));
  return total;
});

const maxQty = computed(() => {
  const stockLimit = product.value?.stock > 0 ? product.value.stock : 0;
  const orderLimit = product.value?.maxQuantityPerOrder || 99;
  return Math.min(stockLimit, orderLimit);
});

const canSubmit = computed(() => {
  if (!product.value || product.value.stock <= 0) return false;
  return product.value.specs
    ?.filter((s) => s.required)
    .every((s) => selectedSpecs.value[s.id]);
});

const hasSelectedSpecs = computed(() => {
  return Object.keys(selectedSpecs.value).length > 0;
});

// 生命週期
onMounted(async () => {
  try {
    const res = await Productdata(shopID.value, uuid.value);
    shopName.value = res.data.shopName;
    product.value = res.data.product;
  } catch (err) {
    console.error('載入失敗', err);
  } finally {
    loading.value = false;
  }
});

// 方法
const formatPrice = (n) => {
  return n?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
};

const goBack = () => {
  router.back();
};

const submitOrder = () => {
  if (!canSubmit.value) return;
  submitting.value = true;
  
  setTimeout(() => {
    alert(product.value.successMessage || '訂單已成功送出!');
    console.log('訂單資料:', {
      shopID: shopID.value,
      uuid: uuid.value,
      quantity: quantity.value,
      specs: selectedSpecs.value,
      addons: selectedAddons.value.map((a) => a.id || a.name),
      total: totalAmount.value,
    });
    submitting.value = false;
  }, 800);
};
</script>

<style lang="scss" scoped>
@import '@/styles/scss/pages/shoporder.scss';
</style>
