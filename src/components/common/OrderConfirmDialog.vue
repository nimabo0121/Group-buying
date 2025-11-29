<!-- src/components/OrderConfirmDialog.vue -->
<template>
  <v-dialog
    persistent
    :fullscreen="$vuetify.display.xs"
    max-width="700"
    @keydown.esc="close"
  >
    <v-card v-if="orderData" class="order-confirm-card">
      <!-- 標題 -->
      <v-card-title class="d-flex align-center justify-space-between pa-4">
        <span class="text-h6">訂單確認</span>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="close"
        />
      </v-card-title>

      <v-divider />

      <!-- 一頁式抽屜卡片列表 -->
      <v-card-text class="pa-0" style="max-height: 70vh; overflow-y: auto;">
        <v-expansion-panels v-model="openPanels" multiple>
          <!-- 步驟 1: 訂單資料 -->
          <v-expansion-panel value="orderData">
            <v-expansion-panel-title>
              <div class="d-flex align-center">
                <v-icon class="mr-3" color="primary">
                  mdi-file-document-outline
                </v-icon>
                <div>
                  <div class="font-weight-bold">訂單資料</div>
                  <div class="text-caption text-medium-emphasis">
                    確認商品與規格
                  </div>
                </div>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <OrderDataStep :order-data="orderData" :compact="true" />
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- 步驟 2: 付款方式 -->
          <v-expansion-panel value="payment">
            <v-expansion-panel-title>
              <div class="d-flex align-center">
                <v-icon class="mr-3" color="primary">
                  mdi-credit-card-outline
                </v-icon>
                <div>
                  <div class="font-weight-bold">付款方式</div>
                  <div
                    v-if="paymentMethod"
                    class="text-caption text-medium-emphasis"
                  >
                    {{ getPaymentMethodLabel(paymentMethod) }}
                  </div>
                  <div v-else class="text-caption error--text">
                    請選擇付款方式
                  </div>
                </div>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <PaymentMethodStep
                v-model="paymentMethod"
                :payment-methods="paymentMethodsList"
                :consumer-data="consumerData"
                :order-total="orderData.total"
                :compact="true"
                @update:use-stored-value="useStoredValue = $event"
                @update:stored-value-amount="currentStoredValueAmount = $event"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- 步驟 3: 取貨方式 -->
          <v-expansion-panel value="pickup">
            <v-expansion-panel-title>
              <div class="d-flex align-center">
                <v-icon class="mr-3" color="primary">
                  mdi-map-marker-outline
                </v-icon>
                <div>
                  <div class="font-weight-bold">取貨方式</div>
                  <div
                    v-if="pickupType"
                    class="text-caption text-medium-emphasis"
                  >
                    {{ getPickupMethodLabel(pickupType) }}
                  </div>
                  <div v-else class="text-caption error--text">
                    請選擇取貨方式
                  </div>
                </div>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <PickupMethodStep
                v-model:pickup-type="pickupType"
                v-model:pickup-point="pickupPoint"
                :pickup-points="pickupPoints"
                :pickup-methods="pickupMethodOptions"
                :store-settings="storeSettings"
                :compact="true"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- 步驟 4: 訂單確認 -->
          <!-- <v-expansion-panel value="confirmation">
            <v-expansion-panel-title>
              <div class="d-flex align-center">
                <v-icon class="mr-3" color="primary">
                  mdi-check-circle-outline
                </v-icon>
                <div>
                  <div class="font-weight-bold">確認送出</div>
                  <div class="text-caption text-medium-emphasis">
                    檢查所有資訊後送出訂單
                  </div>
                </div>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <OrderConfirmationStep
                :order-data="orderData"
                :payment-method="paymentMethod"
                :pickup-type="pickupType"
                :pickup-point="pickupPoint"
                :payment-methods="paymentMethodsList"
                :pickup-points="pickupPoints"
                :submitting="submitting"
                :compact="true"
                @submit="confirmOrder"
              />
            </v-expansion-panel-text>
          </v-expansion-panel> -->
        </v-expansion-panels>
      </v-card-text>

      <v-divider />

      <!-- 總金額顯示 -->
      <v-card-text class="pa-4">
        <div class="d-flex justify-space-between align-center">
          <div>
            <div class="text-body-2 text-medium-emphasis">訂單總金額</div>
            <div v-if="useStoredValue && currentStoredValueAmount > 0" class="text-caption text-medium-emphasis mt-1">
              原價 NT${{ formatPrice(orderData.total) }}
            </div>
          </div>
          <div class="text-right">
            <div v-if="useStoredValue && currentStoredValueAmount > 0" class="text-caption success--text mb-1">
              儲值金折抵 -NT${{ formatPrice(currentStoredValueAmount) }}
            </div>
            <div class="text-h5 primary--text font-weight-bold">
              NT${{ formatPrice(finalAmount) }}
            </div>
          </div>
        </div>
      </v-card-text>

      <v-divider />
    
      <!-- 底部按鈕 -->
      <v-card-actions class="pa-4">
        <v-btn variant="outlined" @click="close">
          取消
        </v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          variant="flat"
          :disabled="!canSubmit"
          @click="showConfirmDialog = true"
        >
          確認送出訂單
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- 最終確認 Dialog -->
    <v-dialog
      v-model="showConfirmDialog"
      max-width="500"
    >
      <v-card>
        <v-card-title class="text-h6 d-flex align-center">
          <v-icon class="mr-2" color="warning">
            mdi-alert-circle-outline
          </v-icon>
          確認送出訂單
        </v-card-title>
        <v-card-text class="pt-4">
          <div class="mb-4">
            <div class="text-body-1 mb-3">請確認以下訂單資訊:</div>
            <div class="order-confirm-summary">
              <div class="summary-row">
                <span class="label">商品:</span>
                <span class="value">{{ orderData.product?.title }}</span>
              </div>
              <div class="summary-row">
                <span class="label">數量:</span>
                <span class="value">{{ orderData.quantity }} 份</span>
              </div>
              <div v-if="orderData.addons?.length" class="summary-row">
                <span class="label">加購:</span>
                <span class="value">{{ orderData.addons.map(a => a.name).join(', ') }}</span>
              </div>
              <div class="summary-row">
                <span class="label">付款方式:</span>
                <span class="value">{{ getPaymentMethodLabel(paymentMethod) }}</span>
              </div>
              <div class="summary-row">
                <span class="label">取貨方式:</span>
                <span class="value">{{ getPickupMethodLabel(pickupType) }}</span>
              </div>
              <v-divider class="my-3" />
              <div v-if="useStoredValue && currentStoredValueAmount > 0" class="summary-row">
                <span class="label">原價:</span>
                <span class="value">NT${{ formatPrice(orderData.total) }}</span>
              </div>
              <div v-if="useStoredValue && currentStoredValueAmount > 0" class="summary-row">
                <span class="label text-success">儲值金折抵:</span>
                <span class="value text-success">-NT${{ formatPrice(currentStoredValueAmount) }}</span>
              </div>
              <div class="summary-row total">
                <span class="label">實付金額:</span>
                <span class="value primary--text">NT${{ formatPrice(finalAmount) }}</span>
              </div>
            </div>
          </div>
          <v-alert type="info" variant="tonal" density="compact">
            送出後將無法修改,請確認資訊正確
          </v-alert>
        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-btn
            variant="outlined"
            @click="showConfirmDialog = false"
          >
            返回修改
          </v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            variant="flat"
            :loading="submitting"
            @click="confirmOrder"
          >
            確定送出
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import OrderDataStep from "./OrderConfirm/OrderDataStep.vue";
import PaymentMethodStep from "./OrderConfirm/PaymentMethodStep.vue";
import PickupMethodStep from "./OrderConfirm/PickupMethodStep.vue";
import { storeInfo, ConsumerData } from "@/utils/api/apiClient.js";

const shopId = sessionStorage.getItem("currentShopID");// 取得shopID
const userUuid = sessionStorage.getItem("userUUID");//取得 userUUID
const props = defineProps({
  value: Boolean, // v-model
  orderData: { type: Object, default: null },
});

const emit = defineEmits(["update:value", "submit", "closeOrderDialog"]);

// 控制哪些面板展開（預設全部展開）
const openPanels = ref(["orderData", "payment", "pickup"]);
const paymentMethod = ref(null);
const pickupType = ref(null);
const pickupPoint = ref(null);
const submitting = ref(false);
const storeSettings = ref(null);
const consumerData = ref(null);
const showConfirmDialog = ref(false);
const useStoredValue = ref(false);
const currentStoredValueAmount = ref(0);

const fetchConsumerData = async () => {
  const data = {
    userUuid: userUuid,
  };
  try {
    const res = await ConsumerData(data);
    if (res.data) {
      consumerData.value = res.data;
      console.log("消費者資料已載入:", consumerData.value);
    }
  } catch (error) {
    console.error("取得消費者資料失敗:", error);
  }
};

// 從 API 取得的付款方式列表
const paymentMethodsList = computed(() => {
  if (!storeSettings.value?.settings?.paymentMethods?.options) return [];
  return storeSettings.value.settings.paymentMethods.options
    .filter((method) => method.enabled)
    .map((method) => ({
      value: method.value,
      label: method.label,
      description: method.description,
      icon: method.icon,
    }));
});

// 從 API 取得的取貨定點列表
const pickupPoints = computed(() => {
  if (!storeSettings.value?.settings?.pickupMethods?.pickupPoints?.points)
    return [];
  return storeSettings.value.settings.pickupMethods.pickupPoints.points
    .filter((point) => point.enabled)
    .map((point) => ({
      text: point.name,
      value: point.id,
      address: point.address,
      description: point.description,
      availableDays: point.availableDays,
      availableTime: point.availableTime,
    }));
});

// 取貨方式選項
const pickupMethodOptions = computed(() => {
  if (!storeSettings.value?.settings?.pickupMethods) return [];
  const methods = [];

  // 到店取貨
  if (storeSettings.value.settings.pickupMethods.inStore?.enabled) {
    methods.push({
      value: "in_store",
      label: storeSettings.value.settings.pickupMethods.inStore.label,
      description:
        storeSettings.value.settings.pickupMethods.inStore.description,
      address: storeSettings.value.settings.pickupMethods.inStore.address,
      note: storeSettings.value.settings.pickupMethods.inStore.note,
    });
  }

  // 定點取貨
  if (storeSettings.value.settings.pickupMethods.pickupPoints?.enabled) {
    methods.push({
      value: "pickup_point",
      label: storeSettings.value.settings.pickupMethods.pickupPoints.label,
      description:
        storeSettings.value.settings.pickupMethods.pickupPoints.description,
    });
  }

  // 宅配到府
  if (storeSettings.value.settings.pickupMethods.homeDelivery?.enabled) {
    methods.push({
      value: "home_delivery",
      label: storeSettings.value.settings.pickupMethods.homeDelivery.label,
      description:
        storeSettings.value.settings.pickupMethods.homeDelivery.description,
      shippingFee:
        storeSettings.value.settings.pickupMethods.homeDelivery.shippingFee,
      freeShippingThreshold:
        storeSettings.value.settings.pickupMethods.homeDelivery
          .freeShippingThreshold,
    });
  }

  return methods;
});

// 載入店家設定資料
const storeInfoAPI = async () => {
  const data = {
    shopId: shopId,
  };
  try {
    const res = await storeInfo(data);
    if (res.data) {
      storeSettings.value = res.data;
      console.log("店家設定已載入:", storeSettings.value);
      if(res.data.settings.storedValue.enabled){
        fetchConsumerData();
      }
    }
  } catch (error) {
    console.error("取得店家設定失敗:", error);
  }
};

onMounted(() => {
  storeInfoAPI();
});

// 取得付款方式標籤
const getPaymentMethodLabel = (value) => {
  const method = paymentMethodsList.value.find((m) => m.value === value);
  return method ? method.label : value;
};

// 取得取貨方式標籤
const getPickupMethodLabel = (value) => {
  const method = pickupMethodOptions.value.find((m) => m.value === value);
  return method ? method.label : value;
};

// 計算最終金額（扣除儲值金後）
const finalAmount = computed(() => {
  if (!props.orderData?.total) return 0;
  if (useStoredValue.value && currentStoredValueAmount.value > 0) {
    return Math.max(0, props.orderData.total - currentStoredValueAmount.value);
  }
  return props.orderData.total;
});

// 格式化金額
const formatPrice = (n) => n?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";

// 檢查是否可以送出訂單
const canSubmit = computed(() => {
  return paymentMethod.value && pickupType.value;
});

// 關閉 dialog 重置
const close = () => {
  emit("closeOrderDialog");
  openPanels.value = ["orderData", "payment", "pickup"];
  paymentMethod.value = null;
  pickupType.value = null;
  pickupPoint.value = null;
  showConfirmDialog.value = false;
  useStoredValue.value = false;
  currentStoredValueAmount.value = 0;
};

// 最終送出
const confirmOrder = () => {
  submitting.value = true;

  // 準備送給後端的訂單資料
  const orderPayload = {
    shopId: shopId,
    userUUID: userUuid,
    product: {
      productId: props.orderData.product?.id || props.orderData.product?.uuid,
      productName: props.orderData.product?.title,
    },
    addons:
      props.orderData.addons?.map((addon) => ({
        id: addon.id,
        name: addon.name,
        price: addon.price,
      })) || [],
    specs: {
      ...props.orderData.specs,
      storedValueUsed: useStoredValue.value ? currentStoredValueAmount.value : 0,
      totalAmount: props.orderData.total,
    },
    finalAmount: finalAmount.value,
    paymentMethod: paymentMethod.value,
    pickupMethod: {
      type: pickupType.value,
      pointId: pickupType.value === "pickup_point" ? pickupPoint.value : null,
    },
  };

  setTimeout(() => {
    console.log("送出訂單資料:", orderPayload);
    emit("submit", orderPayload);
    submitting.value = false;
    showConfirmDialog.value = false;
    close();
  }, 800);
};
</script>

<style lang="scss" scoped>
.order-confirm-card {
  position: relative;
  overflow: hidden;
}

:deep(.v-expansion-panel-title) {
  padding: 16px 20px;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 16px 20px;
}

.order-confirm-summary {
  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    gap: 16px;

    &.total {
      font-size: 1.1rem;
      font-weight: bold;
      padding-top: 12px;
    }

    .label {
      color: rgba(0, 0, 0, 0.6);
      min-width: 100px;
    }

    .value {
      text-align: right;
      font-weight: 500;
    }
  }
}

// 手機版調整
@media (max-width: 600px) {
  .order-confirm-card {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
}
</style>
