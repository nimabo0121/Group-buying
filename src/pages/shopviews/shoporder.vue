<template>
  <div class="shop-order-page">
    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner" />
      <p>載入中...</p>
    </div>

    <!-- 商品內容 -->
    <div v-else-if="product" class="product-container">
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
      <div v-for="spec in product.specs" :key="spec.id" class="content-section">
        <SpecSelector v-model="selectedSpecs[spec.id]" :spec="spec" />
      </div>

      <!-- 加購項目 -->
      <div v-if="product.addons?.length" class="content-section">
        <AddonSelector v-model="selectedAddons" :addons="product.addons" />
      </div>

      <!-- 數量選擇 -->
      <div class="content-section">
        <QuantitySelector v-model="quantity" :max="maxQty" />
      </div>

      <!-- 總計與下單按鈕 -->
      <div class="order-summary">
        <div class="summary-content">
          <div v-if="hasSelectedSpecs" class="total-section">
            <span class="total-label">總計</span>
            <span class="total-amount">NT${{ formatPrice(totalAmount) }}</span>
          </div>
          <div v-else class="total-section placeholder">
            <span class="total-label">請選擇規格</span>
          </div>

          <button
            class="submit-btn"
            :disabled="!canSubmit || product.stock <= 0 || !isFlashSaleActive"
            @click="submitOrder"
          >
            <span v-if="submitting" class="btn-loading">處理中...</span>
            <span v-else>
              {{ product.submitButtonText || defaultSubmitButtonText }}
            </span>
          </button>

          <div v-if="orderButtonDisabledReason" class="sold-out-msg">
            {{ orderButtonDisabledReason }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <OrderConfirmDialog
    v-model="showConfirmDialog"
    :order-data="currentOrder"
    :payment-methods="paymentMethodsList"
    :user-profile="userProfile"
    @submit="handleFinalSubmit"
    @closeOrderDialog="closeOrderDialog"
  />
</template>

<script setup>
import OrderConfirmDialog from "@/components/common/OrderConfirmDialog.vue";
import { ref, computed, onMounted, watch, provide } from "vue";
import { Productdata } from "@/utils/api/apiClient";
import ProductCarousel from "@/components/product/ProductCarousel.vue";
import ProductInfo from "@/components/product/ProductInfo.vue";
import QuantitySelector from "@/components/product/QuantitySelector.vue";
import SpecSelector from "@/components/product/SpecSelector.vue";
import AddonSelector from "@/components/product/AddonSelector.vue";
import CountdownBanner from "@/components/product/CountdownBanner.vue";

const props = defineProps({
  shopId: {
    type: [String, null],
    required: true,
  },
  productUuid: {
    type: [String, null],
    required: true,
  },
  shopFullData: {
    type: Object,
    default: null,
  },
  userProfile: {
    type: Object,
    default: null,
  },
});
const showConfirmDialog = ref(false);
const currentOrder = ref({});

// 從 product JSON 轉付款方式
const paymentMethodsList = computed(() => {
  return (
    product.value?.paymentMethods?.map((method) => ({
      value: method,
      label: method === "stored_value" ? "店家儲值金扣款" : "現金繳費",
    })) || []
  );
});

// 修改 submitOrder
const submitOrder = () => {
  if (!canSubmit.value) return;

  currentOrder.value = {
    product: product.value,
    quantity: quantity.value,
    specs: selectedSpecs.value,
    addons: selectedAddons.value,
    total: totalAmount.value,
  };

  showConfirmDialog.value = true; // 打開 dialog
};

// dialog 最終送出事件
const handleFinalSubmit = (fullOrder) => {
  console.log("最終訂單送出！", fullOrder);
  // 這裡接後端 API 送訂單
  alert(product.value.successMessage || "訂單已成功送出！");
};
const loading = ref(true);
const submitting = ref(false);
const product = ref(null);
const quantity = ref(1);
const selectedSpecs = ref({});
const selectedAddons = ref([]);

// 預設文字
const defaultSubmitButtonText = "立刻下單";
// const defaultSuccessMessage = '訂購成功！我們已為您保留～';

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

const isFlashSaleActive = computed(() => {
  if (!product.value?.flashSale?.enabled) return true; // 沒有限時活動則可下單

  const now = Date.now();

  // 檢查是否在開始時間之後
  if (product.value.flashSale.startTime) {
    const start = new Date(product.value.flashSale.startTime).getTime();
    if (now < start) return false;
  }

  // 檢查是否在結束時間之前
  if (product.value.flashSale.endTime) {
    const end = new Date(product.value.flashSale.endTime).getTime();
    if (now > end) return false;
  }

  return true;
});

const orderButtonDisabledReason = computed(() => {
  if (!product.value) return "";
  if (product.value.stock <= 0) return "已售完";
  if (!isFlashSaleActive.value) {
    const now = Date.now();
    if (product.value.flashSale?.startTime) {
      const start = new Date(product.value.flashSale.startTime).getTime();
      if (now < start) return "活動尚未開始";
    }
    if (product.value.flashSale?.endTime) {
      const end = new Date(product.value.flashSale.endTime).getTime();
      if (now > end) return "活動已結束";
    }
  }
  if (!canSubmit.value) return "請選擇必填規格";
  return "";
});

// 載入商品資料
const loadProductData = async () => {
  loading.value = true;
  try {
    const res = await Productdata(props.shopId, props.productUuid);
    product.value = res.data.product;

    // 重置選擇狀態
    quantity.value = 1;
    selectedSpecs.value = {};
    selectedAddons.value = [];
  } catch (err) {
    console.error("載入失敗", err);
  } finally {
    loading.value = false;
  }
};

// 生命週期
onMounted(() => {
  loadProductData();
});

// 監聽 props 變化,重新載入商品
watch(
  () => [props.shopId, props.productUuid],
  () => {
    loadProductData();
  }
);

// 方法
const formatPrice = (n) => {
  return n?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
};

const closeOrderDialog = () => {
  showConfirmDialog.value = false;
};

// 提供給子孫元件使用
provide("closeOrderDialog", closeOrderDialog);

// 給孫層元件用的
defineExpose({
  closeOrderDialog,
});
</script>

<style lang="scss" scoped>
@import "@/styles/scss/pages/shoporder.scss";
</style>
