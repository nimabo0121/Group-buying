<template>
  <div class="shopTop">
    <div class="shopTopContent">
      <img
        class="shopblockimg"
        :src="shopInfo?.blockImage"
        alt="店家Logo"
      >
      <div class="shopInfo">
        <h1 class="shopTitle">
          {{ shopInfo?.blockTitle }}
        </h1>
        <p class="shopText">
          {{ shopInfo?.blockText }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  shopInfo: {
    type: Object,
    default: null
  }
});
</script>

<style lang="scss" scoped>
@import '@/styles/scss/components/ShopHeader.scss';
</style>
