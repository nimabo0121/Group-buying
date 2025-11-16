<template>
  <div class="wishpool">
    <div class="blockTitle">
      {{ wishpool?.blockName }}
    </div>
    <div class="wishlist-container">
      <div
        v-for="(item, index) in sortedWishlist"
        :key="item.codeKey"
        class="wishlist-item"
        :class="{ 'first-place': index === 0 }"
      >
        <span
          v-if="index === 0"
          class="crown-icon"
        >👑</span>
        <div class="wish-rank">
          #{{ index + 1 }}
        </div>
        <div class="wish-content">
          <div class="wish-title">
            {{ item.codeTitle }}
          </div>
          <div class="wish-votes">
            <button
              class="vote-btn vote-good"
              @click="handleVote(item.codeKey, 'good')"
            >
              <span class="vote-icon">👍</span>
              <span class="vote-count">{{ item.good }}</span>
            </button>
            <button
              class="vote-btn vote-bad"
              @click="handleVote(item.codeKey, 'bad')"
            >
              <span class="vote-icon">👎</span>
              <span class="vote-count">{{ item.bad }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  wishpool: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['vote']);

// 許願池排序 - 依照 good 數量由高到低
const sortedWishlist = computed(() => {
  if (!props.wishpool?.wish) return [];
  return [...props.wishpool.wish].sort((a, b) => b.good - a.good);
});

// 投票功能
const handleVote = (wishKey, voteType) => {
  emit('vote', { wishKey, voteType });
};
</script>

<style lang="scss" scoped>
@import '@/styles/scss/components/WishPool.scss';
</style>
