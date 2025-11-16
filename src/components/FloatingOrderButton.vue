<template>
  <div
    v-if="isVisible"
    class="floating-order-button"
  >
    <button
      class="order-btn"
      @click="handleOrderClick"
    >
      <span class="order-icon">🛒</span>
      <span class="order-text">前往下單</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

defineProps({
  shopID: {
    type: [String, Number],
    default: null
  }
});

const emit = defineEmits(['orderClick']);

const isVisible = ref(true);

// 處理下單按鈕點擊
const handleOrderClick = () => {
  emit('orderClick');
};

// 監聽滾動,控制按鈕顯示
let lastScrollTop = 0;
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // 向下滾動時隱藏,向上滾動時顯示
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    isVisible.value = false;
  } else {
    isVisible.value = true;
  }
  
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss" scoped>
@import '@/styles/scss/components/FloatingOrderButton.scss';
</style>
