<template>
  <div class="spec-selector">
    <div class="spec-label">
      {{ spec.name }}
      <span
        v-if="spec.required"
        class="required"
      >*</span>
    </div>
    <div class="spec-options">
      <label
        v-for="item in spec.items"
        :key="item.value"
        class="spec-option"
        :class="{ active: modelValue === item.value }"
      >
        <input
          type="radio"
          :name="spec.id"
          :value="item.value"
          :checked="modelValue === item.value"
          @change="$emit('update:modelValue', item.value)"
        >
        <span class="option-content">
          <span class="option-label">{{ item.label }}</span>
          <span
            v-if="item.extraPrice > 0"
            class="extra-price"
          >+${{ item.extraPrice }}</span>
        </span>
      </label>
    </div>
  </div>
</template>

<script setup>
defineProps({
  spec: {
    type: Object,
    required: true
  },
  modelValue: {
    type: String,
    default: null
  }
});

defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
@import '@/styles/scss/components/product/SpecSelector.scss';
</style>
