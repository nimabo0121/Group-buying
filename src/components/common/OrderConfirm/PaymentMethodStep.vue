<!-- 步驟 2: 選擇付款方式 -->
<template>
  <div>
    <v-card-title
      v-if="!compact"
      class="text-h6 primary--text d-flex align-center"
    >
      <v-icon class="mr-2"> mdi-credit-card-outline </v-icon>
      選擇付款方式
    </v-card-title>
    <v-card-text :class="compact ? 'pa-0' : 'pa-4'">
      <!-- 儲值金選擇 -->
      <div v-if="currentShopStoredValue" class="mb-4">
        <v-checkbox
          v-model="useStoredValueLocal"
          color="primary"
          hide-details
        >
          <template #label>
            <div class="d-flex align-center w-100">
              <div class="flex-grow-1">
                <div class="text-subtitle-2 font-weight-bold">
                  使用 {{ currentShopStoredValue.storedValueName }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  可用餘額: NT${{ formatPrice(currentShopStoredValue.balance) }}
                </div>
              </div>
            </div>
          </template>
        </v-checkbox>
        
        <!-- 儲值金使用說明 -->
        <v-card
          v-if="useStoredValueLocal"
          variant="tonal"
          color="primary"
          class="mt-3"
        >
          <v-card-text class="py-3">
            <div class="text-body-2">
              <div class="d-flex justify-space-between mb-2">
                <span>可用餘額:</span>
                <span class="font-weight-bold">NT${{ formatPrice(currentShopStoredValue.balance) }}</span>
              </div>
              <div class="d-flex justify-space-between">
                <span>本次折抵:</span>
                <span class="font-weight-bold success--text">-NT${{ formatPrice(deductionAmount) }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <!-- 付款方式選擇 -->
      <div class="text-subtitle-2 mb-3">付款方式</div>
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
    <v-card-actions
      v-if="!compact"
      class="px-4 pb-4"
    >
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
import { inject, computed, ref, watch } from "vue";

const shopId = sessionStorage.getItem("currentShopID");// 取得shopID
const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  paymentMethods: {
    type: Array,
    default: () => [],
  },
  consumerData: {
    type: Object,
    default: null,
  },
  compact: {
    type: Boolean,
    default: false,
  },
  orderTotal: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["update:modelValue", "next", "prev", "cancel", "update:useStoredValue", "update:storedValueAmount"]);

const closeOrderDialog = inject("closeOrderDialog");

// 儲值金使用狀態
const useStoredValueLocal = ref(false);

// 取得當前店家的儲值金資料
const currentShopStoredValue = computed(() => {
  if (!props.consumerData?.storedValues || !shopId) return null;
  return props.consumerData.storedValues.find(
    (sv) => sv.shopUuid === shopId
  );
});

// 計算本次折抵金額
const deductionAmount = computed(() => {
  if (!useStoredValueLocal.value || !currentShopStoredValue.value) return 0;
  return Math.min(currentShopStoredValue.value.balance, props.orderTotal);
});

// 監聽儲值金使用變化,通知父元件
watch([useStoredValueLocal, deductionAmount], () => {
  emit("update:useStoredValue", useStoredValueLocal.value);
  emit("update:storedValueAmount", deductionAmount.value);
});

// 格式化金額顯示
const formatPrice = (n) => n?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";

const handleCancel = () => {
  if (closeOrderDialog) {
    closeOrderDialog();
  } else {
    emit("cancel");
  }
};
</script>
