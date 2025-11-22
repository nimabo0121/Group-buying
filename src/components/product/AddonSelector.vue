<template>
  <div class="addon-selector">
    <div class="addon-label">
      加購品項
    </div>
    <div class="addon-options">
      <label
        v-for="addon in addons"
        :key="addon.id"
        class="addon-option"
        :class="{ active: isSelected(addon) }"
      >
        <input
          type="checkbox"
          :checked="isSelected(addon)"
          @change="toggleAddon(addon)"
        >
        <span class="addon-content">
          <span class="addon-icon">{{ isSelected(addon) ? '☑' : '☐' }}</span>
          <span class="addon-name">{{ addon.name }}</span>
          <span class="addon-price">+${{ addon.price }}</span>
        </span>
      </label>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  addons: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue']);

const isSelected = (addon) => {
  return props.modelValue.some(a => a.id === addon.id);
};

const toggleAddon = (addon) => {
  const selected = [...props.modelValue];
  const index = selected.findIndex(a => a.id === addon.id);
  
  if (index > -1) {
    selected.splice(index, 1);
  } else {
    selected.push(addon);
  }
  
  emit('update:modelValue', selected);
};
</script>

<style lang="scss" scoped>
@import '@/styles/scss/components/product/AddonSelector.scss';
</style>
