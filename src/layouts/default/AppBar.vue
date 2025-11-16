<template>
  <!-- router-view -->
  <default-view />
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import DefaultView from "./View.vue";
// header
import { useLoginStore } from "@/store/login";


const route = useRoute();

const loginStore = useLoginStore();
// console.log(GroupID.value);

// AP畫面關閉
// const close = () => {
//   window.chrome.webview.postMessage("done");
// };
</script>

<style lang="scss" scoped>
</style>
