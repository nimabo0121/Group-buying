<template>
  <DefaultView></DefaultView>
</template>

<script setup>
import DefaultView from "@/layouts/default/Default.vue";
import { GetInitialDataAPI } from "@/composables/JointAPI";
import { computed, onMounted } from "vue";
import { hostLog } from "@/composables/JointAPI.js";

// const foo = computed(() => initialState.value)

onMounted(async () => {
  await GetInitialDataAPI().catch((error) => {
    hostLog(`獲取資料失敗: ${error}`);
  });
});
</script>
<style lang="scss" scoped>

</style>
