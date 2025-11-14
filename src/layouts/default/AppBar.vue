<template>
  <v-navigation-drawer permanent v-if="!isHomePage">
    <div class="d-flex align-center justify-center pt-5">
      <img style="width: 167px;height: 40px;" src="@/assets/images/logo.png" class="img" />
    </div>
    <v-list>
      <template v-for="index in panelstitle" :key="index.title">
        <template v-if="GroupID == index.GroupID">
          <v-list-item
            v-if="index.type == 'item'"
            :prepend-icon="index.icon"
            :title="index.title"
            :to="index.href"
            router
          ></v-list-item>
          <v-list-group v-if="index.type == 'group'">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="index.icon"
                :title="index.title"
              ></v-list-item>
            </template>
            <template v-for="item in panels" :key="item.title">
              <template v-if="item.badge == true">
                <v-list-item
                  v-if="GroupID == item.GroupID"
                  :title="item.title"
                  :to="item.href"
                  class=""
                  router
                >
                  <template v-slot:append>
                    <v-badge color="#C11920" content="2" inline></v-badge>
                    <v-badge color="#C11920" content="2" inline></v-badge>
                  </template>
                </v-list-item>
              </template>
              <div v-else>
                <v-list-item
                  v-if="GroupID == item.GroupID"
                  :title="item.title"
                  :to="item.href"
                  router
                >
                </v-list-item>
              </div>
            </template>
          </v-list-group>
        </template>
      </template>
    </v-list>
  </v-navigation-drawer>
  <!-- router-view -->
  <default-view />
  <v-app-bar class="d-print-none" flat>
    <v-app-bar-title>
      <div class="user-info">

        <router-link
          to="/SCMenu"
          custom
          v-slot="{ navigate }"
          v-if="loginStore.isSCMenuMode && shouldShowButton"
        >
          <v-btn variant="tonal" @click="navigate" role="link">{{
            $t("btn.backMenu")
          }}</v-btn>
        </router-link>
      </div>
      <div class="user-info">
        <p>
          {{ $t("label.Dept") }}：{{ loginStore.loginInfoAll.DeptID }}
          {{ loginStore.loginInfoAll.DeptName }}
        </p>
        <p>
          {{ $t("label.LoginUser") }}：{{ loginStore.loginInfoAll.UserID }}
          {{ loginStore.loginInfoAll.UserName }}
        </p>
        <v-btn
          icon="mdi-logout-variant"
          @click="logoutConfirm"
          v-if="loginStore.isSCMenuMode"
        >
        </v-btn>
      </div>
      <!-- <v-btn @click="close"> 關閉 </v-btn> -->
    </v-app-bar-title>
  </v-app-bar>
</template>

<script setup>
import { computed } from "vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import DefaultView from "./View.vue";
// header
import panels from "@/utils/json/panels.json";
import panelstitle from "@/utils/json/panelstitle.json";
import { useLoginStore } from "@/store/login";


const route = useRoute();
const isHomePage = computed(() => route.path === '/');

const loginStore = useLoginStore();
const GroupID = computed(() => loginStore.loginInfoAll.GroupID);
// console.log(GroupID.value);

// AP畫面關閉
// const close = () => {
//   window.chrome.webview.postMessage("done");
// };
</script>

<style lang="scss" scoped>
:deep(.v-list-item--active) {
  background-color: #F5F5F5 !important;
  color: #B7181F !important;
  
  // 禁用覆蓋層效果
  .v-list-item__overlay {
    opacity: 0 !important;
  }
  }
</style>
