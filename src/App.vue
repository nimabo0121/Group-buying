<template>
  <DefaultView></DefaultView>
</template>

<script setup>
import DefaultView from "@/layouts/default/Default.vue";
import { computed, onMounted } from "vue";


// const foo = computed(() => initialState.value)

onMounted(async () => {
  await GetInitialDataAPI().catch((error) => {
    hostLog(`獲取資料失敗: ${error}`);
  });
});
</script>
<style lang="scss" scoped>

</style>
