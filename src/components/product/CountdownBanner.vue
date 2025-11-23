<template>
  <div
    v-if="flashSale?.enabled && (flashSale.startTime || flashSale.endTime)"
    class="countdown-banner"
    :class="[`status-${countdownStatus}`]"
  >
    <div class="countdown-icon">
      <span v-if="countdownStatus === 'pending'"></span>
      <span v-else-if="countdownStatus === 'active'">⏰</span>
      <span v-else> </span>
    </div>
    <div class="countdown-content">
      <div class="countdown-title">
        <span v-if="countdownStatus === 'pending'">活動即將開始</span>
        <span v-else-if="countdownStatus === 'active'">限時特賣倒數</span>
        <span v-else>活動已結束</span>
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
const countdownStatus = ref('active'); // 'pending', 'active', 'ended'
let countdownTimer = null;

const updateCountdown = () => {
  if (!props.flashSale?.enabled) return;
  
  const now = Date.now();
  
  // 檢查開始時間(如果有設定)
  if (props.flashSale.startTime) {
    const start = new Date(props.flashSale.startTime).getTime();
    if (now < start) {
      countdownStatus.value = 'pending';
      const diff = start - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      countdownText.value = `${days.toString().padStart(2, '0')}天 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}後開始`;
      return;
    }
  }
  
  // 檢查結束時間
  if (!props.flashSale.endTime) return;
  
  const end = new Date(props.flashSale.endTime).getTime();
  const diff = end - now;
  
  if (diff <= 0) {
    countdownStatus.value = 'ended';
    countdownText.value = '已售完';
    if (countdownTimer) {
      clearInterval(countdownTimer);
    }
    return;
  }
  
  countdownStatus.value = 'active';
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
