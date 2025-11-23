<template>
  <div class="official-container">
    <!-- 平台層級 Header -->
    <OfficialHeader @menu-click="handleMenuClick" />

    <!-- 動態切換內容 -->
    <component
      :is="currentComponent"
      v-if="currentComponent"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import OfficialHeader from '@/components/OfficialHeader.vue';
import OrderTracking from './order.vue';

const router = useRouter();

const currentView = ref('orders'); // 預設顯示訂單追蹤

// 根據當前視圖決定要顯示的組件
const currentComponent = computed(() => {
  switch (currentView.value) {
    case 'orders':
      return OrderTracking;
    case 'profile':
      // 未來實作個人資料頁面
      return null;
    default:
      return OrderTracking;
  }
});

const handleMenuClick = (action) => {
  console.log('選單點擊:', action);
  
  if (action === 'orders') {
    currentView.value = 'orders';
  } else if (action === 'profile') {
    currentView.value = 'profile';
    // 未來導向個人資料頁
    console.log('前往個人資料 (尚未實作)');
  }
};
</script>

<style lang="scss" scoped>
.official-container {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
}
</style>
