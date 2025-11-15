<template>
  <div>home</div>
</template>

<script setup>
import { ref,onMounted } from 'vue';


// 取得網址後面shopID=value, 並存到shopID變數
const shopID = ref(null);
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  shopID.value = urlParams.get('shopID');
  console.log('Shop ID:', shopID.value);
});



</script>

<style lang="scss" scoped>
</style>
