<!-- 進度指示器 -->
<template>
  <div class="progress-indicator">
    <div class="step-dots">
      <div
        v-for="i in totalSteps"
        :key="i"
        class="dot"
        :class="{ active: currentStep >= i, current: currentStep === i }"
      />
    </div>
    <div class="step-text">
      步驟 {{ currentStep }} / {{ totalSteps }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentStep: {
    type: Number,
    required: true
  },
  totalSteps: {
    type: Number,
    default: 4
  }
})
</script>

<style lang="scss" scoped>
.progress-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  .step-dots {
    display: flex;
    gap: 6px;

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #e0e0e0;
      transition: all 0.3s ease;

      &.active {
        background-color: #1976d2;
      }

      &.current {
        width: 10px;
        height: 10px;
        box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.3);
      }
    }
  }

  .step-text {
    font-size: 0.75rem;
    color: #666;
    font-weight: 500;
  }
}

// 手機版調整
@media (max-width: 600px) {
  .progress-indicator {
    position: static;
    width: 100%;
    padding: 12px;
    background-color: #f5f5f5;
    flex-direction: row;
    justify-content: space-between;

    .step-dots {
      order: 2;
    }

    .step-text {
      order: 1;
    }
  }
}
</style>
