<!-- src/components/OrderConfirmDialog.vue -->
<template>
  <v-dialog
    persistent
    :fullscreen="$vuetify.display.xs"
    max-width="600"
    @keydown.esc="close"
  >
    <v-card v-if="orderData" class="order-confirm-card">
      <!-- 頁面切換容器 -->
      <v-window v-model="step" class="order-window">
        <!-- 步驟 1: 確認訂單資料 -->
        <v-window-item :value="1">
          <OrderDataStep
            :order-data="orderData"
            @next="nextStep"
            @cancel="close"
          />
        </v-window-item>

        <!-- 步驟 2: 選擇付款方式 -->
        <v-window-item :value="2">
          <PaymentMethodStep
            v-model="paymentMethod"
            :payment-methods="paymentMethodsList"
            @next="nextStep"
            @prev="prevStep"
          />
        </v-window-item>

        <!-- 步驟 3: 選擇取貨方式 -->
        <v-window-item :value="3">
          <PickupMethodStep
            v-model:pickup-type="pickupType"
            v-model:pickup-point="pickupPoint"
            :pickup-points="pickupPoints"
            :pickup-methods="pickupMethodOptions"
            :store-settings="storeSettings"
            @next="nextStep"
            @prev="prevStep"
          />
        </v-window-item>

        <!-- 步驟 4: 訂單確認 -->
        <v-window-item :value="4">
          <OrderConfirmationStep
            :order-data="orderData"
            :payment-method="paymentMethod"
            :pickup-type="pickupType"
            :pickup-point="pickupPoint"
            :payment-methods="paymentMethodsList"
            :pickup-points="pickupPoints"
            :submitting="submitting"
            @prev="prevStep"
            @submit="confirmOrder"
            @cancel="close"
          />
        </v-window-item>
      </v-window>

      <!-- 進度指示器 -->
      <ProgressIndicator :current-step="step" :total-steps="4" />
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import OrderDataStep from "./OrderConfirm/OrderDataStep.vue";
import PaymentMethodStep from "./OrderConfirm/PaymentMethodStep.vue";
import PickupMethodStep from "./OrderConfirm/PickupMethodStep.vue";
import OrderConfirmationStep from "./OrderConfirm/OrderConfirmationStep.vue";
import ProgressIndicator from "./OrderConfirm/ProgressIndicator.vue";
import { storeInfo } from "@/utils/api/apiClient.js";
// 取得shopID
const shopId = sessionStorage.getItem("currentShopID");
const props = defineProps({
  value: Boolean, // v-model
  orderData: { type: Object, default: null },
});

const emit = defineEmits(["update:value", "submit", "closeOrderDialog"]);

// const dialog = computed({
//   get: () => props.value,
//   set: (val) => emit("update:value", val),
// });

const step = ref(1);
const paymentMethod = ref(null);
const pickupType = ref(null);
const pickupPoint = ref(null);
const submitting = ref(false);
const storeSettings = ref(null);

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
    }
  } catch (error) {
    console.error("取得店家設定失敗:", error);
  }
};

onMounted(() => {
  storeInfoAPI();
});

// 步驟導航
const nextStep = () => {
  if (step.value < 4) step.value++;
};

const prevStep = () => {
  if (step.value > 1) step.value--;
};

// 關閉 dialog 重置
const close = () => {
  emit("closeOrderDialog");
  step.value = 1;
  paymentMethod.value = null;
  pickupType.value = null;
  pickupPoint.value = null;
};

// 最終送出
const confirmOrder = () => {
  submitting.value = true;

  // 準備送給後端的訂單資料
  const orderPayload = {
    shopId: shopId,
    productId: props.orderData.product?.id || props.orderData.product?.uuid,
    productName: props.orderData.product?.title,
    quantity: props.orderData.quantity,
    specs: props.orderData.specs,
    addons:
      props.orderData.addons?.map((addon) => ({
        id: addon.id,
        name: addon.name,
        price: addon.price,
      })) || [],
    totalAmount: props.orderData.total,
    paymentMethod: paymentMethod.value,
    pickupMethod: {
      type: pickupType.value,
      pointId: pickupType.value === "pickup_point" ? pickupPoint.value : null,
    },
    orderTime: new Date().toISOString(),
  };

  setTimeout(() => {
    const fullOrder = {
      ...props.orderData,
      paymentMethod: paymentMethod.value,
      pickupType: pickupType.value,
      pickupPoint: pickupPoint.value,
      apiPayload: orderPayload,
    };
    emit("submit", fullOrder);
    submitting.value = false;
    close();
  }, 800);
};
</script>

<style lang="scss" scoped>
.order-confirm-card {
  position: relative;
  overflow: hidden;

  .order-window {
    min-height: 400px;
  }
}

// 手機版調整
@media (max-width: 600px) {
  .order-confirm-card {
    .order-window {
      min-height: 100vh;
    }
  }
}
</style>
