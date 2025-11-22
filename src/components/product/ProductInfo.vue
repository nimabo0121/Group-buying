<template>
  <div class="product-info">
    <h1 class="product-title">
      {{ product.title }}
    </h1>
    
    <p
      v-if="product.description"
      class="product-description"
    >
      {{ product.description }}
    </p>

    <div
      v-if="product.badges?.length"
      class="badges-container"
    >
      <span
        v-for="(badge, index) in product.badges"
        :key="index"
        class="badge"
      >
        {{ badge }}
      </span>
    </div>

    <div class="price-section">
      <div
        v-if="hasDiscount"
        class="original-price"
      >
        原價 NT${{ formatPrice(product.originalPrice) }}
      </div>

      <div class="price-row">
        <span
          v-if="hasDiscount"
          class="discount-tag"
        >
          {{ discountRate }} 折
        </span>

        <span class="final-price">
          NT${{ formatPrice(finalPrice) }}
        </span>

        <span
          class="stock-info"
          :class="{ 'out-of-stock': product.stock <= 0 }"
        >
          {{ product.stock > 0 ? `剩 ${product.stock} 組` : '已售完' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const hasDiscount = computed(() => {
  return props.product?.discountRate != null && props.product.discountRate < 10;
});

const discountRate = computed(() => {
  return props.product?.discountRate?.toFixed(1) || '';
});

const finalPrice = computed(() => {
  if (!props.product) return 0;
  const rate = props.product.discountRate ?? 10;
  return Math.round((props.product.originalPrice * rate) / 10 / 10) * 10;
});

const formatPrice = (n) => {
  return n?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
};
</script>

<style lang="scss" scoped>
@import '@/styles/scss/components/product/ProductInfo.scss';
</style>
