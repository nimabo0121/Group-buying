<template>
  <div class="orders-page">
    <div class="page-header">
      <h1 class="page-title">
        訂單追蹤
      </h1>
      <p class="page-subtitle">
        查看您的所有訂單狀態
      </p>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="loading-container"
    >
      <div class="loading-spinner" />
      <p>載入中...</p>
    </div>

    <!-- 訂單列表 -->
    <div
      v-else-if="orders.length"
      class="orders-container"
    >
      <!-- 篩選器 -->
      <div class="filter-tabs">
        <button
          v-for="filter in filters"
          :key="filter.value"
          class="filter-tab"
          :class="{ 'active': currentFilter === filter.value }"
          @click="currentFilter = filter.value"
        >
          {{ filter.label }}
          <span
            v-if="getFilterCount(filter.value) > 0"
            class="filter-count"
          >{{ getFilterCount(filter.value) }}</span>
        </button>
      </div>

      <!-- 訂單卡片 -->
      <div class="orders-list">
        <OrderCard
          v-for="order in filteredOrders"
          :key="order.orderID"
          :order="order"
        />
      </div>

      <!-- 空狀態 -->
      <div
        v-if="filteredOrders.length === 0"
        class="empty-state"
      >
        <p>📦</p>
        <p>目前沒有 {{ getCurrentFilterLabel() }} 的訂單</p>
      </div>
    </div>

    <!-- 無訂單 -->
    <div
      v-else
      class="empty-state"
    >
      <p>📦</p>
      <p>您還沒有任何訂單</p>
      <button
        class="browse-btn"
        @click="goToShops"
      >
        開始購物
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { OrdersData } from '@/utils/api/apiClient';
import OrderCard from '@/components/order/OrderCard.vue';

const loading = ref(true);
const orders = ref([]);
const currentFilter = ref('all');

const filters = [
  { label: '全部', value: 'all' },
  { label: '處理中', value: 'processing' },
  { label: '已出貨', value: 'shipped' },
  { label: '已完成', value: 'delivered' }
];

const filteredOrders = computed(() => {
  if (currentFilter.value === 'all') {
    return orders.value;
  }
  
  if (currentFilter.value === 'processing') {
    return orders.value.filter(order => 
      ['ordered', 'confirmed', 'preparing'].includes(order.status)
    );
  }
  
  return orders.value.filter(order => order.status === currentFilter.value);
});

const getFilterCount = (filterValue) => {
  if (filterValue === 'all') return orders.value.length;
  
  if (filterValue === 'processing') {
    return orders.value.filter(order => 
      ['ordered', 'confirmed', 'preparing'].includes(order.status)
    ).length;
  }
  
  return orders.value.filter(order => order.status === filterValue).length;
};

const getCurrentFilterLabel = () => {
  return filters.find(f => f.value === currentFilter.value)?.label || '';
};

const goToShops = () => {
  // 導向商店列表頁
  console.log('前往商店列表');
};

onMounted(async () => {
  try {
    const res = await OrdersData();
    orders.value = res.data.orders || [];
    console.log('訂單資料:', orders.value);
  } catch (err) {
    console.error('載入訂單失敗:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.orders-page {
  width: 100%;
  min-height: calc(100vh - 80px);
  padding: 20px 16px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #888;
  margin: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 16px;

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #e0e0e0;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  p {
    font-size: 16px;
    color: #666;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.orders-container {
  max-width: 1000px;
  margin: 0 auto;
}

.filter-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 8px;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 2px;
  }
}

.filter-tab {
  padding: 10px 20px;
  border: none;
  background: #ffffff;
  color: #666;
  font-size: 15px;
  font-weight: 500;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    background: #f5f5f5;
  }

  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
}

.filter-count {
  background: rgba(255, 255, 255, 0.3);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
}

.orders-list {
  margin-bottom: 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: #999;
  text-align: center;

  p:first-child {
    font-size: 64px;
    margin: 0 0 16px 0;
  }

  p:last-of-type {
    font-size: 16px;
    margin: 0 0 24px 0;
  }
}

.browse-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

// 平板以上
@media (min-width: 768px) {
  .orders-page {
    padding: 32px 24px;
  }

  .page-title {
    font-size: 32px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .filter-tabs {
    gap: 16px;
  }

  .filter-tab {
    padding: 12px 24px;
    font-size: 16px;
  }
}

// 桌面
@media (min-width: 1024px) {
  .orders-page {
    padding: 40px 32px;
  }
}
</style>
