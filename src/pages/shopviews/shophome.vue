<template>
  <div class="shopcontent">
    <!-- 活動專區輪播圖 -->
    <ActivityCarousel
      v-if="isBlockVisible('activity') && activity"
      :activity="activity"
    />

    <!-- 中間內容區塊 -->
    <div
      v-if="hasBodyContent"
      class="shopbody"
      :class="bodyLayoutClass"
    >
      <!-- 許願池區塊 -->
      <WishPool
        v-if="isBlockVisible('wishpool') && wishpool"
        :wishpool="wishpool"
        @vote="handleVote"
      />

      <!-- 公告專區 -->
      <BulletinBoard
        v-if="isBlockVisible('bulletin') && bulletin"
        :bulletin="bulletin"
        :items-per-page="5"
        @bulletin-click="handleBulletinClick"
      />
    </div>

    <!-- 懸浮下單按鈕 (僅手機版) -->
    <FloatingOrderButton
      :shop-id="shopId"
      @order-click="handleOrderClick"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import WishPool from "@/components/WishPool.vue";
import BulletinBoard from "@/components/BulletinBoard.vue";
import ActivityCarousel from "@/components/ActivityCarousel.vue";
import FloatingOrderButton from "@/components/FloatingOrderButton.vue";

const props = defineProps({
  shopId: {
    type: [String, null],
    required: true
  },
  productUuid: {
    type: [String, null],
    default: null
  },
  shopFullData: {
    type: Object,
    default: null
  }
});

// 資料儲存
const wishpool = ref(null); // blockID: 2 - 許願池
const bulletin = ref(null); // blockID: 3 - 公告專區
const activity = ref(null); // blockID: 4 - 活動專區
const useBlocks = ref([]); // 可顯示的區塊清單

// 處理店家完整資料
const processShopData = (fullData) => {
  if (!fullData) return;
  
  console.log("ShopHomedataAPI-res:", fullData);
  
  // 儲存可顯示的區塊清單
  useBlocks.value = fullData.use || [];
  console.log("可顯示區塊:", useBlocks.value);
  
  // 根據 blockID 分配資料
  fullData.Data?.forEach((block) => {
    switch (block.blockID) {
      case 2:
        wishpool.value = block;
        break;
      case 3:
        bulletin.value = block;
        break;
      case 4:
        activity.value = block;
        break;
    }
  });
};

// 監聽 shopFullData 變化
watch(() => props.shopFullData, (newData) => {
  processShopData(newData);
}, { immediate: true });

// 檢查區塊是否可顯示 (使用 blockKey)
const isBlockVisible = (blockKey) => {
  return useBlocks.value.includes(blockKey);
};

// 檢查是否有 shopbody 內容
const hasBodyContent = computed(() => {
  return (isBlockVisible('wishpool') && wishpool.value) || 
         (isBlockVisible('bulletin') && bulletin.value);
});

// 動態計算 shopbody 的佈局 class
const bodyLayoutClass = computed(() => {
  const wishVisible = isBlockVisible('wishpool') && wishpool.value;
  const bulletinVisible = isBlockVisible('bulletin') && bulletin.value;
  
  if (wishVisible && bulletinVisible) {
    return 'has-both';
  } else if (wishVisible || bulletinVisible) {
    return 'has-single';
  }
  return '';
});

// 處理許願池投票
const handleVote = ({ wishKey, voteType }) => {
  if (!wishpool.value?.wish) return;
  
  const wishItem = wishpool.value.wish.find(item => item.codeKey === wishKey);
  if (wishItem) {
    if (voteType === 'good') {
      wishItem.good += 1;
    } else if (voteType === 'bad') {
      wishItem.bad += 1;
    }
    console.log(`投票: ${wishKey}, 類型: ${voteType}`, wishItem);
    // 這裡可以加入 API 呼叫,將投票結果傳送到後端
  }
};

// 處理公告點擊
const handleBulletinClick = (codeKey) => {
  console.log("公告key", codeKey);
  // 這裡可以加入路由跳轉或彈窗顯示公告內容
};

// 處理下單按鈕點擊
const handleOrderClick = () => {
  console.log("前往下單頁面", { shopID: props.shopId });
  // 這裡可以加入路由跳轉到下單頁面
  // 例如: router.push({ name: 'order', params: { shopID: props.shopId } })
};


</script>

<style lang="scss" scoped>
.shopcontent {
    width: 100%;
    min-height: 100vh;
    background-color: #f8f9fa;
    padding-bottom: 20px;
}

.shopbody {
    width: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 1200px;
    margin: 0 auto;

    // 當只有一個區塊時,全寬顯示
    &.has-single {
        :deep(.wishpool),
        :deep(.bulletin) {
            width: 100%;
        }
    }
}

// 平板以上 (768px+)
@media (min-width: 768px) {
    .shopbody {
        padding: 24px;

        // 當有兩個區塊時,水平排列
        &.has-both {
            flex-direction: row;
            align-items: flex-start;

            :deep(.wishpool) {
                flex: 1;
            }

            :deep(.bulletin) {
                flex: 2;
            }
        }

        // 當只有一個區塊時,全寬顯示
        &.has-single {
            :deep(.wishpool),
            :deep(.bulletin) {
                max-width: 100%;
            }
        }
    }
}

// 桌面 (1024px+)
@media (min-width: 1024px) {
    .shopbody {
        padding: 32px;
    }
}
</style>
