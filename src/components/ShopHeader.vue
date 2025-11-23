<template>
  <div class="shopTop">
    <div class="shopTopContent">
      <img
        class="shopblockimg"
        :src="shopData?.blockImage"
        alt="店家Logo"
      >
      <div class="shopInfo">
        <h1 class="shopTitle">
          {{ shopData?.blockTitle }}
        </h1>
        <p class="shopText">
          {{ shopData?.blockText }}
        </p>
      </div>

      <!-- 漢堡選單按鈕 (右側) -->
      <button
        class="menu-btn"
        @click="toggleMenu"
      >
        ☰
      </button>
    </div>

    <!-- 側邊選單 -->
    <transition name="slide">
      <div
        v-if="isMenuOpen"
        class="menu-overlay"
        @click="closeMenu"
      >
        <div
          class="menu-drawer"
          @click.stop
        >
          <div class="menu-header">
            <h3>選單</h3>
            <button
              class="close-btn"
              @click="closeMenu"
            >
              ✕
            </button>
          </div>
          <nav class="menu-list">
            <button
              class="menu-item"
              @click="handleMenuClick('profile')"
            >
              帳戶資料
            </button>
            <button
              class="menu-item"
              @click="handleMenuClick('orders')"
            >
              訂單追蹤
            </button>
          </nav>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { ShopHomedata } from '@/utils/api/apiClient';

const props = defineProps({
  shopId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['menu-click', 'shop-data-loaded']);

const shopData = ref(null);
const isMenuOpen = ref(false);

const loadShopData = async () => {
  try {
    const data = { shopID: props.shopId };
    const res = await ShopHomedata(data);
    
    // 找到店家資訊區塊 (blockID: 1)
    const shopInfoBlock = res.data.Data?.find(block => block.blockID === 1);
    
    if (shopInfoBlock) {
      shopData.value = {
        blockImage: shopInfoBlock.blockImage,
        blockTitle: shopInfoBlock.blockTitle,
        blockText: shopInfoBlock.blockText
      };
      
      // 存儲 shopID 到 sessionStorage
      sessionStorage.setItem('currentShopID', props.shopId);
      
      // 通知父組件店家資料已載入
      emit('shop-data-loaded', {
        shopData: shopData.value,
        fullData: res.data
      });
    }
  } catch (err) {
    console.error('載入店家資訊失敗:', err);
  }
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleMenuClick = (action) => {
  emit('menu-click', action);
  closeMenu();
};

// 監聽 shopId 變化
watch(() => props.shopId, (newShopId) => {
  if (newShopId) {
    loadShopData();
  }
}, { immediate: true });

onMounted(() => {
  // 檢查是否有快取的 shopID
  const cachedShopID = sessionStorage.getItem('currentShopID');
  if (cachedShopID && cachedShopID === props.shopId) {
    // shopID 相同,立即載入
    loadShopData();
  }
});
</script>

<style lang="scss" scoped>
@import '@/styles/scss/components/ShopHeader.scss';
</style>
