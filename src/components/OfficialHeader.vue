<template>
  <div class="official-header">
    <div class="header-content">
      <div class="logo-section">
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
import { ref } from 'vue';

const emit = defineEmits(['menu-click']);

const isMenuOpen = ref(false);

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
  align-items: center;
  justify-content: center;
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

  .platform-name {
    font-size: 28px;
  }

  .menu-drawer {
    padding: 60px 40px;
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
  .platform-name {
    font-size: 32px;
  }
}
</style>
