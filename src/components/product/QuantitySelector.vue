<template>
  <div class="quantity-selector">
    <div class="selector-label">
      數量
    </div>
    <div class="quantity-controls">
      <button
        class="quantity-btn minus"
        :disabled="modelValue <= 1"
        @click="decrease"
      >
        <span class="btn-icon">−</span>
      </button>
      
      <div class="quantity-display">
        {{ modelValue }}
      </div>
      
      <button
        class="quantity-btn plus"
        :disabled="modelValue >= max"
        @click="increase"
      >
        <span class="btn-icon">+</span>
      </button>
    </div>
    <div
      v-if="max"
      class="quantity-limit"
    >
      限購 {{ max }} 件
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: 99
  },
  min: {
    type: Number,
    default: 1
  }
});

const emit = defineEmits(['update:modelValue']);

const increase = () => {
  if (props.modelValue < props.max) {
    emit('update:modelValue', props.modelValue + 1);
  }
};

const decrease = () => {
  if (props.modelValue > props.min) {
    emit('update:modelValue', props.modelValue - 1);
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/scss/components/product/QuantitySelector.scss';
</style>
