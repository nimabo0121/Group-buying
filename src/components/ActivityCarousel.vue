<template>
  <div class="shopbottom">
    <div class="blockTitle">
      {{ activity?.blockName }}
    </div>
    <div class="carousel-container">
      <div
        class="carousel-wrapper"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <div
          v-for="item in activity?.blockContents"
          :key="item.codeKey"
          class="carousel-item"
        >
          <img
            :src="item.contentImage"
            :alt="item.codeKey"
            class="carousel-image"
          >
        </div>
      </div>
      <div
        v-if="activity?.blockContents?.length > 1"
        class="carousel-dots"
      >
        <span
          v-for="(item, index) in activity?.blockContents"
          :key="index"
          class="dot"
          :class="{ active: currentSlide === index }"
          @click="goToSlide(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  activity: {
    type: Object,
    default: null
  },
  autoPlayInterval: {
    type: Number,
    default: 3000
  }
});

// 輪播圖控制
const currentSlide = ref(0);
let carouselInterval = null;

// 輪播圖功能
const startCarousel = () => {
  if (props.activity?.blockContents?.length > 1) {
    carouselInterval = setInterval(() => {
      nextSlide();
    }, props.autoPlayInterval);
  }
};

const nextSlide = () => {
  if (props.activity?.blockContents) {
    currentSlide.value = (currentSlide.value + 1) % props.activity.blockContents.length;
  }
};

const goToSlide = (index) => {
  currentSlide.value = index;
  // 重新開始自動輪播
  if (carouselInterval) {
    clearInterval(carouselInterval);
    startCarousel();
  }
};

// 監聽 activity 變化,啟動輪播
watch(() => props.activity, (newVal) => {
  if (newVal?.blockContents?.length > 1) {
    startCarousel();
  }
}, { immediate: true });

onMounted(() => {
  if (props.activity?.blockContents?.length > 1) {
    startCarousel();
  }
});

onUnmounted(() => {
  if (carouselInterval) {
    clearInterval(carouselInterval);
  }
});
</script>

<style lang="scss" scoped>
@import '@/styles/scss/components/ActivityCarousel.scss';
</style>
