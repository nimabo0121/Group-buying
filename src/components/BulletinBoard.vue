<template>
  <div class="bulletin">
    <div class="blockTitle">
      {{ bulletin?.blockName }}
    </div>
    <div class="bulletinlist-container">
      <div
        v-for="item in paginatedBulletins"
        :key="item.codeKey"
        class="bulletinlist"
        @click="handleClick(item.codeKey)"
      >
        <span class="bulletin-icon">📢</span>
        <span class="bulletin-title">{{ item.codeTitle }}</span>
        <span class="bulletin-arrow">›</span>
      </div>
    </div>
    <!-- 分頁控制 -->
    <div
      v-if="totalPages > 1"
      class="pagination"
    >
      <button
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        ‹
      </button>
      <span
        v-for="page in totalPages"
        :key="page"
        class="page-number"
        :class="{ active: currentPage === page }"
        @click="changePage(page)"
      >
        {{ page }}
      </span>
      <button
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        ›
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  bulletin: {
    type: Object,
    default: null
  },
  itemsPerPage: {
    type: Number,
    default: 5
  }
});

const emit = defineEmits(['bulletinClick']);

// 公告分頁控制
const currentPage = ref(1);

// 公告分頁計算
const totalPages = computed(() => {
  if (!props.bulletin?.blockContent) return 0;
  return Math.ceil(props.bulletin.blockContent.length / props.itemsPerPage);
});

const paginatedBulletins = computed(() => {
  if (!props.bulletin?.blockContent) return [];
  const start = (currentPage.value - 1) * props.itemsPerPage;
  const end = start + props.itemsPerPage;
  return props.bulletin.blockContent.slice(start, end);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const handleClick = (codeKey) => {
  emit('bulletinClick', codeKey);
};
</script>

<style lang="scss" scoped>
@import '@/styles/scss/components/BulletinBoard.scss';
</style>
