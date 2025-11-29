<!-- 步驟 1: 確認訂單資料 -->
<template>
  <div>
    <v-card-title class="text-h6 primary--text d-flex align-center">
      <v-icon class="mr-2">
        mdi-clipboard-text-outline
      </v-icon>
      確認訂單資料
    </v-card-title>
    <v-card-text class="pa-4">
      <div class="order-summary">
        <div class="item">
          <span class="label">商品</span>
          <span class="value">{{ orderData.product?.title }}</span>
        </div>
        <div class="item">
          <span class="label">數量</span>
          <span class="value">{{ orderData.quantity }} 份</span>
        </div>
        <div
          v-for="(val, key) in orderData.specs"
          :key="key"
          class="item"
        >
          <span class="label">{{ getSpecName(key) }}</span>
          <span class="value">{{ getSpecLabel(key, val) }}</span>
        </div>
        <div
          v-if="orderData.addons?.length"
          class="item"
        >
          <span class="label">加購</span>
          <span class="value">{{ orderData.addons?.map((a) => a.name).join(", ") }}</span>
        </div>
        <div class="item total">
          <span class="label">總金額</span>
          <span class="value primary--text font-weight-bold">NT${{ formatPrice(orderData.total) }}</span>
        </div>
      </div>
    </v-card-text>
    <v-card-actions class="px-4 pb-4">
      <v-btn
        variant="outlined"
        @click="handleCancel"
      >
        取消
      </v-btn>
      <v-spacer />
      <v-btn
        color="primary"
        variant="flat"
        @click="$emit('next')"
      >
        下一步
        <v-icon end>
          mdi-chevron-right
        </v-icon>
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script setup>
import { inject } from "vue";
const props = defineProps({
  orderData: {
    type: Object,
    required: true
  }
})

// 取得規格名稱/標籤
const getSpecName = (id) => props.orderData?.product?.specs?.find((s) => s.id === id)?.name || id

const getSpecLabel = (id, val) => {
  const spec = props.orderData?.product?.specs?.find((s) => s.id === id)
  return spec?.items.find((i) => i.value === val)?.label || val
}

const formatPrice = (n) => n?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0"

// 使用暴露的closeOrderDialog方法
const closeOrderDialog = inject("closeOrderDialog");

const handleCancel = () => {
  if (closeOrderDialog) {
    closeOrderDialog();
  } else {
    // 如果沒有 inject 到,則使用 emit
    emit('cancel');
  }
};

const emit = defineEmits(['next', 'cancel']);

</script>

<style lang="scss" scoped>
.order-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding: 8px 0;

    &.total {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #ccc;
      font-size: 1.2rem;
    }

    .label {
      font-weight: 500;
    }

    .value {
      text-align: right;
    }
  }
}
</style>
