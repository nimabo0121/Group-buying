<template>
  <v-main :class="{ 'home-page': !isHomePage }">
    <router-view  />
  </v-main>

  <v-overlay
    :model-value="loading"
    class="justify-center align-center"
    scroll-strategy="block"
    :persistent="true"
  >
    <v-progress-circular indeterminate size="64" color="white" />
  </v-overlay>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useLoginStore } from "@/store/login";
import { useSysStore } from "@/store/sys";
import { storeToRefs } from "pinia";
// import * as JointApiSvc from "@/composables/JointAPI";

import { ref, computed } from "vue";


const route = useRoute();
const Router = useRouter();
const loginStore = useLoginStore();

const sysStore = useSysStore();
const { loading } = storeToRefs(sysStore);

const isHomePage = computed(() => route.path === '/');


</script>

<style lang="scss" scoped>
html{

  body {
    .v-main {
      --v-layout-top: 45px !important;
      --v-layout-left: v-bind(isHomePage ? '0px !important' : '150px !important');
      --v-layout-right: 30px !important;
      padding-right: 0px;
       &.home-page {
         .v-main {
      --v-layout-top: 45px !important;
      --v-layout-left: 0px !important;
      --v-layout-right: 30px !important;
      padding-right: 0px;
    }
      }
    }
  }
}

</style>
