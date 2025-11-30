<template>
  <div class="official-header">
    <div class="header-content">
      <!-- 店家資訊區 -->
      <div v-if="shopData" class="logo-section shop-info-section">
        <img
          class="shop-logo"
          :src="shopData?.blockImage"
          alt="店家Logo"
        >
        <div class="shop-info">
          <h1 class="shop-title">
            {{ shopData?.blockTitle }}
          </h1>
          <p class="shop-text">
            {{ shopData?.blockText }}
          </p>
        </div>
      </div>
      
      <!-- 如果沒有店家資料，顯示平台名稱 -->
      <div v-else class="logo-section">
        <h1 class="platform-name">
          團購平台
        </h1>
      </div>

      <!-- 漢堡選單按鈕 -->
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
          
          <div class="menu-content">
            <!-- 使用者資訊區塊 -->
            <div v-if="props.userData" class="user-info-section">
              <div class="user-avatar">
                <img
                  :src="props.userData.pictureUrl || props.userData.profile?.pictureUrl || 'https://via.placeholder.com/120'"
                  alt="使用者頭貼"
                >
              </div>
              <div class="user-details">
                <div class="user-detail-item">
                  <span class="label">會員:</span>
                  <span class="value">{{ props.userData.displayName || props.userData.profile?.name || '訪客' }}</span>
                </div>
                <div class="user-detail-item">
                  <span class="label">代幣:</span>
                  <span class="value">{{ currentShopTokens }}</span>
                </div>
              </div>
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
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { ShopHomedata } from '@/utils/api/apiClient';

const props = defineProps({
  shopId: {
    type: String,
    required: true
  },
  userData: {
    type: Object,
    default: null
  },
  consumerData: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['menu-click', 'shop-data-loaded']);

const shopData = ref(null);
const isMenuOpen = ref(false);

// 計算當前店家的代幣餘額
const currentShopTokens = computed(() => {
  if (!props.consumerData?.storedValues || !props.shopId) return 0;
  
  const shopToken = props.consumerData.storedValues.find(
    item => item.shopUuid === props.shopId
  );
  
  return shopToken ? shopToken.balance : 0;
});

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
// 使用 OfficialHeader 的樣式為基礎
.official-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.logo-section {
  flex: 1;
  
  &.shop-info-section {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

.shop-logo {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  object-fit: cover;
  border: 3px solid #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.shop-info {
  flex: 1;
  min-width: 0;
}

.shop-title {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  margin: 0 0 4px 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.shop-text {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.platform-name {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  margin: 0;
}

.menu-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #ffffff;
  font-size: 28px;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
}

// 選單樣式
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-drawer {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  display: flex;
  flex-direction: column;
  padding: 40px 20px;
}

.menu-header {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

  h3 {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
}

.close-btn {
  background: none;
  border: none;
  font-size: 32px;
  color: #666;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    color: #333;
    transform: rotate(90deg);
  }
}

.menu-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 40px;
}

// 使用者資訊區塊
.user-info-section {
  width: 100%;
  max-width: 400px;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .user-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid #667eea;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    margin-bottom: 20px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .user-details {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .user-detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .label {
        font-size: 14px;
        font-weight: 600;
        color: #667eea;
      }

      .value {
        font-size: 16px;
        font-weight: bold;
        color: #333333;
      }
    }
  }
}

.menu-list {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.menu-item {
  width: 80%;
  max-width: 400px;
  padding: 20px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  border-radius: 16px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);

    &::before {
      width: 300px;
      height: 300px;
    }
  }

  &:active {
    transform: translateY(-2px) scale(1.02);
  }
}

// 動畫
.slide-enter-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  .menu-drawer {
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
}

.slide-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  
  .menu-drawer {
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.slide-enter-from {
  opacity: 0;
  
  .menu-drawer {
    transform: scale(0.8);
    opacity: 0;
  }
}

.slide-leave-to {
  opacity: 0;
  
  .menu-drawer {
    transform: scale(1);
    opacity: 0;
  }
}

// 平板以上
@media (min-width: 768px) {
  .official-header {
    padding: 20px 24px;
  }

  .shop-logo {
    width: 80px;
    height: 80px;
  }

  .shop-title {
    font-size: 22px;
  }

  .shop-text {
    font-size: 14px;
  }

  .platform-name {
    font-size: 28px;
  }

  .menu-drawer {
    padding: 60px 40px;
  }

  .user-info-section {
    .user-avatar {
      width: 140px;
      height: 140px;
      border-width: 5px;
    }

    .user-details {
      .user-detail-item {
        padding: 14px 20px;

        .label {
          font-size: 15px;
        }

        .value {
          font-size: 18px;
        }
      }
    }
  }

  .menu-list {
    gap: 24px;
  }

  .menu-item {
    width: 70%;
    max-width: 500px;
    padding: 24px 40px;
    font-size: 22px;
  }
}

// 桌面
@media (min-width: 1024px) {
  .shop-logo {
    width: 100px;
    height: 100px;
  }

  .shop-title {
    font-size: 26px;
  }

  .shop-text {
    font-size: 15px;
  }

  .platform-name {
    font-size: 32px;
  }
}
</style>
