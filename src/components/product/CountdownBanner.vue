<template>
  <div
    v-if="flashSale?.enabled && flashSale.endTime"
    class="countdown-banner"
  >
    <div class="countdown-icon">
      ⏰
    </div>
    <div class="countdown-content">
      <div class="countdown-title">
        限時特賣倒數
      </div>
      <div class="countdown-time">
        {{ countdownText }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  flashSale: {
    type: Object,
    default: null
  }
});

const countdownText = ref('計算中...');
let countdownTimer = null;

const updateCountdown = () => {
  if (!props.flashSale?.enabled || !props.flashSale.endTime) return;
  
  const end = new Date(props.flashSale.endTime).getTime();
  const diff = end - Date.now();
  
  if (diff <= 0) {
    countdownText.value = '已結束';
    if (countdownTimer) {
      clearInterval(countdownTimer);
    }
    return;
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  countdownText.value = `${days.toString().padStart(2, '0')}天 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

onMounted(() => {
  if (props.flashSale?.enabled && props.flashSale.endTime) {
    updateCountdown();
    countdownTimer = setInterval(updateCountdown, 1000);
  }
});

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<style lang="scss" scoped>
@import '@/styles/scss/components/product/CountdownBanner.scss';
</style>
