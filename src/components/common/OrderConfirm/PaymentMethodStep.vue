<!-- 步驟 2: 選擇付款方式 -->
<template>
  <div>
    <v-card-title class="text-h6 primary--text d-flex align-center">
      <v-icon class="mr-2"> mdi-credit-card-outline </v-icon>
      選擇付款方式
    </v-card-title>
    <v-card-text class="pa-4">
      <v-radio-group
        :model-value="modelValue"
        hide-details
        @update:model-value="$emit('update:modelValue', $event)"
      >
        <v-radio
          v-for="method in paymentMethods"
          :key="method.value"
          :value="method.value"
          color="primary"
          class="mb-3"
        >
          <template #label>
            <div class="d-flex align-center">
              <v-icon
                v-if="method.icon"
                :icon="method.icon"
                size="small"
                class="mr-2"
              />
              <div>
                <div class="font-weight-medium">
                  {{ method.label }}
                </div>
                <div
                  v-if="method.description"
                  class="text-caption text-medium-emphasis"
                >
                  {{ method.description }}
                </div>
              </div>
            </div>
          </template>
        </v-radio>
      </v-radio-group>

      <v-alert
        v-if="!modelValue && paymentMethods.length > 0"
        type="info"
        variant="tonal"
        class="mt-4"
      >
        請選擇一種付款方式
      </v-alert>

      <v-alert
        v-if="paymentMethods.length === 0"
        type="warning"
        variant="tonal"
        class="mt-4"
      >
        目前沒有可用的付款方式
      </v-alert>
    </v-card-text>
    <v-card-actions class="px-4 pb-4">
      <v-btn variant="outlined" @click="$emit('prev')">
        <v-icon start> mdi-chevron-left </v-icon>
        上一步
      </v-btn>
      <v-spacer />
      <v-btn
        color="primary"
        variant="flat"
        :disabled="!modelValue"
        @click="$emit('next')"
      >
        下一步
        <v-icon end> mdi-chevron-right </v-icon>
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script setup>
import { inject } from "vue";

defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  paymentMethods: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "next", "prev", "cancel"]);

const closeOrderDialog = inject("closeOrderDialog");

const handleCancel = () => {
  if (closeOrderDialog) {
    closeOrderDialog();
  } else {
    emit("cancel");
  }
};
</script>
