<template>
  <div class="product-carousel">
    <div
      class="carousel-wrapper"
      :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
    >
      <div
        v-for="(img, index) in images"
        :key="index"
        class="carousel-item"
      >
        <img
          :src="img"
          :alt="`商品圖片 ${index + 1}`"
          class="carousel-image"
        >
      </div>
    </div>
    
    <div
      v-if="images.length > 1"
      class="carousel-dots"
    >
      <span
        v-for="(img, index) in images"
        :key="index"
        class="dot"
        :class="{ active: currentSlide === index }"
        @click="goToSlide(index)"
      />
    </div>

    <button
      v-if="images.length > 1 && currentSlide > 0"
      class="carousel-arrow prev"
      @click="prevSlide"
    >
      ‹
    </button>
    <button
      v-if="images.length > 1 && currentSlide < images.length - 1"
      class="carousel-arrow next"
      @click="nextSlide"
    >
      ›
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
});

const currentSlide = ref(0);

const goToSlide = (index) => {
  currentSlide.value = index;
};

const nextSlide = () => {
  if (currentSlide.value < props.images.length - 1) {
    currentSlide.value++;
  }
};

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/scss/components/product/ProductCarousel.scss';
</style>
