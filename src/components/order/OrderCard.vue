<template>
  <div class="order-card">
    <!-- 訂單摘要 -->
    <div
      class="order-summary"
      @click="toggleExpand"
    >
      <div class="order-header">
        <div class="shop-info">
          <img
            v-if="order.shopLogo"
            :src="order.shopLogo"
            :alt="order.shopName"
            class="shop-logo"
          >
          <div class="shop-details">
            <h3 class="shop-name">
              {{ order.shopName }}
            </h3>
            <p class="order-id">
              訂單編號: {{ order.orderID }}
            </p>
          </div>
        </div>
        <div
          class="status-badge"
          :class="`status-${order.status}`"
        >
          {{ order.statusText }}
        </div>
      </div>

      <div class="order-preview">
        <div class="preview-image">
          <img
            v-if="order.items[0]?.productImage"
            :src="order.items[0].productImage"
            :alt="order.items[0].productName"
          >
          <div
            v-if="order.items.length > 1"
            class="more-items"
          >
            +{{ order.items.length - 1 }}
          </div>
        </div>
        <div class="preview-info">
          <p class="product-name">
            {{ order.items[0]?.productName }}
          </p>
          <p
            v-if="order.items.length > 1"
            class="item-count"
          >
            等 {{ order.items.length }} 項商品
          </p>
          <p class="order-date">
            {{ formatDate(order.orderDate) }}
          </p>
        </div>
        <div class="preview-right">
          <p class="total-amount">
            NT${{ formatPrice(order.totalAmount) }}
          </p>
          <button class="expand-btn">
            <span :class="{ 'rotate': isExpanded }">▼</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 訂單詳情 (展開) -->
    <transition name="expand">
      <div
        v-if="isExpanded"
        class="order-details"
      >
        <!-- 進度時間軸 -->
        <div class="timeline">
          <h4 class="section-title">
            訂單進度
          </h4>
          <div class="timeline-items">
            <div
              v-for="(step, index) in order.timeline"
              :key="index"
              class="timeline-item"
              :class="{ 'completed': step.completed, 'current': !step.completed && isPreviousCompleted(index) }"
            >
              <div class="timeline-dot" />
              <div class="timeline-content">
                <p class="timeline-status">
                  {{ step.statusText }}
                </p>
                <p
                  v-if="step.time"
                  class="timeline-time"
                >
                  {{ formatDateTime(step.time) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 商品明細 -->
        <div class="items-section">
          <h4 class="section-title">
            訂購商品
          </h4>
          <div
            v-for="(item, index) in order.items"
            :key="index"
            class="item-detail"
          >
            <img
              :src="item.productImage"
              :alt="item.productName"
              class="item-image"
            >
            <div class="item-info">
              <p class="item-name">
                {{ item.productName }}
              </p>
              <p class="item-spec">
                規格: {{ item.spec }}
              </p>
              <div
                v-if="item.addons?.length"
                class="item-addons"
              >
                <p
                  v-for="(addon, aIndex) in item.addons"
                  :key="aIndex"
                  class="addon-item"
                >
                  + {{ addon.name }} (${{ addon.price }})
                </p>
              </div>
            </div>
            <div class="item-price">
              <p class="item-quantity">
                x{{ item.quantity }}
              </p>
              <p class="item-total">
                NT${{ formatPrice(calculateItemTotal(item)) }}
              </p>
            </div>
          </div>
        </div>

        <!-- 配送資訊 -->
        <div class="delivery-section">
          <h4 class="section-title">
            配送資訊
          </h4>
          <div class="delivery-info">
            <p><span class="label">配送方式:</span> {{ order.deliveryInfo.method }}</p>
            <p v-if="order.deliveryInfo.storeName">
              <span class="label">門市:</span> {{ order.deliveryInfo.storeName }}
            </p>
            <p v-if="order.deliveryInfo.storeAddress">
              <span class="label">地址:</span> {{ order.deliveryInfo.storeAddress }}
            </p>
            <p v-if="order.deliveryInfo.address">
              <span class="label">地址:</span> {{ order.deliveryInfo.address }}
            </p>
            <p><span class="label">收件人:</span> {{ order.deliveryInfo.receiverName }}</p>
            <p><span class="label">電話:</span> {{ order.deliveryInfo.receiverPhone }}</p>
            <p
              v-if="order.trackingNumber"
              class="tracking"
            >
              <span class="label">物流編號:</span> {{ order.trackingNumber }}
            </p>
          </div>
        </div>

        <!-- 金額摘要 -->
        <div class="amount-summary">
          <div class="amount-row">
            <span>總金額</span>
            <span class="amount-value">NT${{ formatPrice(order.totalAmount) }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
});

const isExpanded = ref(false);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const formatPrice = (price) => {
  return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const calculateItemTotal = (item) => {
  let total = item.price * item.quantity;
  if (item.addons?.length) {
    item.addons.forEach(addon => {
      total += addon.price * item.quantity;
    });
  }
  return total;
};

const isPreviousCompleted = (index) => {
  if (index === 0) return true;
  return props.order.timeline[index - 1].completed;
};
</script>

<style lang="scss" scoped>
@import '@/styles/scss/components/order/OrderCard.scss';
</style>
