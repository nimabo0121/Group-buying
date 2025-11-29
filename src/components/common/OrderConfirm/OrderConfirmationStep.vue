<!-- 步驟 4: 訂單確認 -->
<template>
  <div>
    <v-card-title class="text-h6 primary--text d-flex align-center">
      <v-icon class="mr-2">
        mdi-check-circle-outline
      </v-icon>
      訂單確認
    </v-card-title>
    <v-card-text class="pa-4">
      <v-alert
        type="success"
        variant="tonal"
        class="mb-4"
      >
        請確認以下資訊無誤後送出訂單
      </v-alert>
      <div class="final-summary">
        <div class="summary-item">
          <v-icon
            class="mr-2"
            size="small"
          >
            mdi-clipboard-text
          </v-icon>
          <span class="label">商品:</span>
          <span class="value">{{ orderData.product?.title }}</span>
        </div>
        <div class="summary-item">
          <v-icon
            class="mr-2"
            size="small"
          >
            mdi-numeric
          </v-icon>
          <span class="label">數量:</span>
          <span class="value">{{ orderData.quantity }} 份</span>
        </div>
        <div
          v-if="orderData.addons?.length"
          class="summary-item"
        >
          <v-icon
            class="mr-2"
            size="small"
          >
            mdi-plus-circle-outline
          </v-icon>
          <span class="label">加購項目:</span>
          <div class="value">
            <div
              v-for="(addon, index) in orderData.addons"
              :key="index"
              class="addon-item"
            >
              {{ addon.name }} <span class="text-medium-emphasis">(+NT${{ formatPrice(addon.price) }})</span>
            </div>
          </div>
        </div>
        <div class="summary-item">
          <v-icon
            class="mr-2"
            size="small"
          >
            mdi-credit-card
          </v-icon>
          <span class="label">付款方式:</span>
          <span class="value">{{ paymentLabel }}</span>
        </div>
        <div class="summary-item">
          <v-icon
            class="mr-2"
            size="small"
          >
            mdi-map-marker
          </v-icon>
          <span class="label">取貨方式:</span>
          <span class="value">{{ pickupLabel }}</span>
        </div>
        <v-divider class="my-3" />
        <div class="summary-item total">
          <v-icon
            class="mr-2"
            size="small"
          >
            mdi-cash
          </v-icon>
          <span class="label">總金額:</span>
          <span class="value primary--text font-weight-bold">NT${{ formatPrice(orderData.total) }}</span>
        </div>
      </div>
    </v-card-text>
    <v-card-actions class="px-4 pb-4">
      <v-btn
        variant="outlined"
        :disabled="submitting"
        @click="$emit('prev')"
      >
        <v-icon start>
          mdi-chevron-left
        </v-icon>
        上一步
      </v-btn>
      <v-spacer />
      <v-btn
        color="primary"
        variant="flat"
        :loading="submitting"
        @click="SetOrderList"
      >
        <v-icon start>
          mdi-check
        </v-icon>
        送出訂單
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  orderData: {
    type: Object,
    required: true
  },
  paymentMethod: {
    type: [String, null],
    default: null
  },
  pickupType: {
    type: [String, null],
    default: null
  },
  pickupPoint: {
    type: [String, null],
    default: null
  },
  paymentMethods: {
    type: Array,
    default: () => []
  },
  pickupPoints: {
    type: Array,
    default: () => []
  },
  submitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['prev', 'submit', 'cancel'])

const closeOrderDialog = inject('closeOrderDialog', null)


const paymentLabel = computed(() => {
  return props.paymentMethods.find(m => m.value === props.paymentMethod)?.label || props.paymentMethod
})

const pickupLabel = computed(() => {
  if (props.pickupType === 'in_store') return '到店取貨'
  if (props.pickupType === 'pickup_point') {
    const point = props.pickupPoints.find(p => p.value === props.pickupPoint)
    return `定點取貨 - ${point?.text || props.pickupPoint}`
  }
  return props.pickupType
})

const formatPrice = (n) => n?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0"

const SetOrderList = ()=>{
  console.log("送出訂單");
  // closeOrderDialog();
  emit('cancel');
}
</script>

<style lang="scss" scoped>
.final-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .summary-item {
    display: flex;
    align-items: center;
    padding: 8px 0;
    gap: 4px;

    &.total {
      font-size: 1.1rem;
      padding-top: 8px;
    }

    .label {
      font-weight: 500;
      min-width: 80px;
    }

    .value {
      flex: 1;
    }
  }

  .addon-item {
    padding: 2px 0;
    
    &:not(:last-child) {
      margin-bottom: 4px;
    }
  }
}
</style>
