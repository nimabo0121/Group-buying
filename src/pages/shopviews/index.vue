<template>
  <div class="shop-views">
    <!-- 店家資訊區塊 - 共用 -->
    <ShopHeader
      v-if="shopID"
      :shop-id="shopID"
      @menu-click="handleMenuClick"
      @shop-data-loaded="handleShopDataLoaded"
    />

    <!-- 根據網址參數動態切換元件 -->
    <component
      :is="currentComponent"
      v-if="shopID"
      :shop-id="shopID"
      :product-uuid="productUuid"
      :shop-full-data="shopFullData"
    />
    <div
      v-else
      class="error-message"
    >
      <p>缺少必要參數 shopID</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import ShopHeader from '@/components/ShopHeader.vue';
import ShopHome from './shophome.vue';
import ShopOrder from './shoporder.vue';

const router = useRouter();

const shopID = ref(null);
const productUuid = ref(null);
const shopFullData = ref(null);

// 根據網址參數決定顯示哪個元件
const currentComponent = computed(() => {
  return productUuid.value ? ShopOrder : ShopHome;
});

const parseUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  shopID.value = urlParams.get('shopID');
  productUuid.value = urlParams.get('name');
};

// 處理 ShopHeader 載入完成的資料
const handleShopDataLoaded = ({ fullData }) => {
  console.log('ShopHeader 資料載入完成:', fullData);
  shopFullData.value = fullData;
};

// 處理選單點擊
const handleMenuClick = (action) => {
  console.log("選單點擊:", action);
  if (action === 'profile') {
    console.log("前往個人資料");
    // router.push({ name: 'profile' })
  } else if (action === 'orders') {
    console.log("前往訂單紀錄");
    router.push({ name: 'official' })
  }
};

onMounted(() => {
  parseUrlParams();
  
  // 監聽 URL 變化
  window.addEventListener('popstate', parseUrlParams);
});

// 監聽 URL 參數變化
watch([shopID, productUuid], () => {
  console.log('當前頁面:', productUuid.value ? '商品頁' : '首頁', {
    shopID: shopID.value,
    productUuid: productUuid.value
  });
});
</script>

<style lang="scss" scoped>
.shop-views {
  width: 100%;
  min-height: 100vh;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  
  p {
    font-size: 18px;
    color: #ff5252;
    text-align: center;
  }
}
</style>