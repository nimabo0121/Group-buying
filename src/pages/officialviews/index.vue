<template>
  <div class="official-container">
    <!-- 平台層級 Header -->
    <OfficialHeader :user-data="UserdataInfo" :consumer-data="consumerData" />

    <!-- 動態切換內容 -->
    <component :is="currentComponent" v-if="currentComponent" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import OfficialHeader from "@/components/OfficialHeader.vue";
import OrderTracking from "./order.vue";
import Account from "./account.vue";
import { Userdata, ConsumerData } from "@/utils/api/apiClient";

const route = useRoute();
const shopId = sessionStorage.getItem("currentShopID"); // 取得shopID

const currentView = ref("orders"); // 預設顯示訂單追蹤
const UserdataInfo = ref(null);
// get儲值金額
const consumerData = ref(null);

const fetchConsumerData = async () => {
  const data = {
    userUuid: sessionStorage.getItem("userUUID"),
    shopId: shopId,
    type: "list",
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
// 取得使用者資料
const fetchUserdata = async () => {
  try {
    const res = await Userdata();
    if (res.data.users) {
      UserdataInfo.value = res.data.users;
      console.log("使用者資料:", UserdataInfo.value);
      sessionStorage.setItem("userUUID", UserdataInfo.value.uuid);
    }
  } catch (error) {
    console.error("取得使用者資料失敗:", error);
  }
};

// 根據當前視圖決定要顯示的組件
const currentComponent = computed(() => {
  switch (currentView.value) {
    case "orders":
      return OrderTracking;
    case "profile":
      return Account;
    default:
      return OrderTracking;
  }
});

// 監聴 URL query 參數變化，自動更新視圖
watch(
  () => route.query.view,
  (newView) => {
    if (newView === "profile") {
      currentView.value = "profile";
    } else if (newView === "orders" || !newView) {
      currentView.value = "orders";
    }
  },
  { immediate: true }
);

onMounted(() => {
  fetchUserdata();
  fetchConsumerData();
});
</script>

<style lang="scss" scoped>
.official-container {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
}
</style>
