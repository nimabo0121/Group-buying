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
                <div 
                  class="user-detail-item token-item"
                  @click="openTokenDialog"
                >
                  <span class="label">{{ tokenLabel }}</span>
                  <span class="value">{{ tokenValue }}</span>
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

    <!-- 代幣查詢對話框 -->
    <v-dialog
      v-model="isTokenDialogOpen"
      max-width="600"
      persistent
    >
      <v-card class="token-dialog">
        <v-card-title class="dialog-header">
          <span class="dialog-title">持有代幣</span>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="closeTokenDialog"
          />
        </v-card-title>
        
        <v-card-text class="dialog-content">
          <div
            v-if="sortedTokens.length === 0"
            class="empty-state"
          >
            <v-icon
              size="64"
              color="grey-lighten-1"
            >
              mdi-coin-outline
            </v-icon>
            <p class="empty-text">
              目前沒有持有任何代幣
            </p>
          </div>
          
          <div
            v-for="token in sortedTokens"
            :key="token.shopUuid"
            class="token-card"
            :class="{ 'current-shop': token.shopUuid === props.shopId }"
          >
            <div class="token-header">
              <h3 class="token-shop-name">
                {{ token.shopName }}
              </h3>
              <v-chip
                v-if="token.shopUuid === props.shopId"
                color="primary"
                size="small"
                variant="flat"
              >
                當前店家
              </v-chip>
            </div>
            
            <div class="token-info">
              <div class="token-row">
                <span class="token-label">代幣名稱</span>
                <span class="token-value-text">{{ token.storedValueName }}</span>
              </div>
              <div class="token-row">
                <span class="token-label">餘額</span>
                <span class="token-balance">{{ token.balance }}</span>
              </div>
              <div class="token-row">
                <span class="token-label">最後更新</span>
                <span class="token-date">{{ formatDate(token.lastUpdated) }}</span>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ShopHomedata } from '@/utils/api/apiClient';

const router = useRouter();

const props = defineProps({
  shopId: {
    type: String,
    default: null
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

const isMenuOpen = ref(false);
const shopData = ref(null);
const isTokenDialogOpen = ref(false);

// 計算當前店家的代幣資訊
const currentShopToken = computed(() => {
  if (!props.consumerData?.storedValues || !props.shopId) return null;
  
  return props.consumerData.storedValues.find(
    item => item.shopUuid === props.shopId
  );
});

// 代幣標籤：有 shopId 顯示代幣名稱，沒有則顯示「代幣查詢」
const tokenLabel = computed(() => {
  if (props.shopId && currentShopToken.value) {
    return currentShopToken.value.storedValueName || '代幣';
  }
  return '代幣查詢';
});

// 代幣值：有 shopId 顯示餘額，沒有則顯示點擊提示
const tokenValue = computed(() => {
  if (props.shopId && currentShopToken.value) {
    return currentShopToken.value.balance;
  }
  return '點擊查詢 >';
});

// 排序後的代幣列表：當前店家排第一
const sortedTokens = computed(() => {
  if (!props.consumerData?.storedValues) return [];
  
  const tokens = [...props.consumerData.storedValues];
  
  // 如果有 shopId，將當前店家的代幣排到第一位
  if (props.shopId) {
    tokens.sort((a, b) => {
      if (a.shopUuid === props.shopId) return -1;
      if (b.shopUuid === props.shopId) return 1;
      return 0;
    });
  }
  
  return tokens;
});

const loadShopData = async () => {
  if (!props.shopId) return;
  
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
      
      // 儲存 shopID 到 sessionStorage
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
  console.log('選單點擊:', action);
  
  if (action === 'profile') {
    router.push({ name: 'official', query: { view: 'profile' } });
  } else if (action === 'orders') {
    router.push({ name: 'official', query: { view: 'orders' } });
  }
  
  closeMenu();
  emit('menu-click', action);
};

// 打開代幣對話框
const openTokenDialog = () => {
  isTokenDialogOpen.value = true;
};

// 關閉代幣對話框
const closeTokenDialog = () => {
  isTokenDialogOpen.value = false;
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
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
    loadShopData();
  }
});
</script>

<style lang="scss" scoped>
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
}

.logo-section {
  flex: 1;
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

    .token-item {
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 12px;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);

        &::after {
          opacity: 1;
        }
      }

      &:active {
        transform: translateY(0);
      }

      .value {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }
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

// 代幣對話框樣式
.token-dialog {
  border-radius: 16px;
  overflow: hidden;

  .dialog-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #ffffff;
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .dialog-title {
      font-size: 20px;
      font-weight: 600;
    }

    :deep(.v-btn) {
      color: #ffffff;
    }
  }

  .dialog-content {
    padding: 24px;
    max-height: 60vh;
    overflow-y: auto;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;

    .empty-text {
      margin-top: 16px;
      font-size: 16px;
      color: #999;
    }
  }

  .token-card {
    background: #ffffff;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    transition: all 0.3s ease;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      border-color: #667eea;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
      transform: translateY(-2px);
    }

    &.current-shop {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
    }

    .token-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .token-shop-name {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin: 0;
      }
    }

    .token-info {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .token-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .token-label {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .token-value-text {
          font-size: 15px;
          color: #333;
          font-weight: 500;
        }

        .token-balance {
          font-size: 20px;
          font-weight: bold;
          color: #667eea;
        }

        .token-date {
          font-size: 13px;
          color: #999;
        }
      }
    }
  }
}
</style>
