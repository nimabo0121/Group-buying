<template>
  <div class="shop-views">
    <!-- 店家資訊區塊 - 共用 -->
    <OfficialHeader
      v-if="shopID"
      :shop-id="shopID"
      :user-data="UserdataInfo"
      :consumer-data="consumerData"
      @shop-data-loaded="handleShopDataLoaded"
    />

    <!-- 根據網址參數動態切換元件 -->
    <component
      :is="currentComponent"
      v-if="shopID"
      :shop-id="shopID"
      :product-uuid="productUuid"
      :shop-full-data="shopFullData"
      :user-profile="Userprofile"
    />
    <div v-else class="error-message">
      <p>缺少必要參數 shopID</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import OfficialHeader from "@/components/OfficialHeader.vue";
import ShopHome from "./shophome.vue";
import ShopOrder from "./shoporder.vue";
import { Userdata,ConsumerData } from "@/utils/api/apiClient";

const shopID = ref(null);
const productUuid = ref(null);
const shopFullData = ref(null);
const UserdataInfo = ref(null);
const Userprofile = ref(null);

// get儲值金額
const consumerData = ref(null);


const fetchConsumerData = async () => {
  const data = {
    userUuid: sessionStorage.getItem("userUUID"),
    shopId: shopID.value,
    type: "single"
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
    if(res.data.users){
      UserdataInfo.value = res.data.users;
      Userprofile.value = res.data.users.profile;
      console.log("使用者資料:", UserdataInfo.value);
      console.log("使用者個人資料:", Userprofile.value);
      
      sessionStorage.setItem("userUUID", UserdataInfo.value.uuid);
    }
  } catch (error) {
    console.error("取得使用者資料失敗:", error);
  }
};
// 根據網址參數決定顯示哪個元件
const currentComponent = computed(() => {
  return productUuid.value ? ShopOrder : ShopHome;
});

const parseUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  shopID.value = urlParams.get("shopID");
  productUuid.value = urlParams.get("name");
  if (productUuid.value) {
    sessionStorage.setItem("currentProductUUID", productUuid.value);
  }
  if (shopID.value) {
    sessionStorage.setItem("currentShopID", shopID.value);
    fetchConsumerData();
  }
};

// 處理 ShopHeader 載入完成的資料
const handleShopDataLoaded = ({ fullData }) => {
  console.log("ShopHeader 資料載入完成:", fullData);
  shopFullData.value = fullData;
};

onMounted(() => {
  parseUrlParams();
  fetchUserdata();

  // 監聽 URL 變化
  window.addEventListener("popstate", parseUrlParams);
});

// 監聽 URL 參數變化
watch([shopID, productUuid], () => {
  console.log("當前頁面:", productUuid.value ? "商品頁" : "首頁", {
    shopID: shopID.value,
    productUuid: productUuid.value,
  });
});
</script>

<style lang="scss" scoped>
.shop-views {
  width: 100%;
  min-height: 100vh;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;

  p {
    font-size: 18px;
    color: #ff5252;
    text-align: center;
  }
}
</style>
