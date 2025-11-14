<script setup>
import { ref } from "vue";
// header
import panels from "../public/json/panels.json";
import panelstitle from "../public/json/panelstitle.json";
import { useRouter } from "vue-router";
import useraction from "./components/useraction.vue";
import { GetNotifyDataNumber } from "@/utils/api/apiClient";
import { useI18n } from "vue-i18n";
import { useLoginStore } from "./stores/login";
const loginStore = useLoginStore();
const TokenUid = loginStore.getLoginInfo.TokenUid;
const permissionID = ref(Number(loginStore.getLoginInfo.Permission));

// console.log("loginStore",loginStore.getLoginInfo);
// console.log("loginStore",loginStore);
// console.log("permissionID",permissionID);

const { t } = useI18n();

const snackbars = ref({});
const msgSnackbars = ref(false);
const drawerOpen = ref(false);

const openSnackbars = (text) => {
  snackbars.value = {
    text: text,
  };
  msgSnackbars.value = true;
};

// const LoginBtn = ;
</script>
<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawerOpen"
      app
      style="background-color: white"
      class="navigation-drawer"
    >
      <v-list-item
        style="padding-top: 50px;"
        prepend-avatar="/public/images/background-removed.png"
        :title="t('basic.CompanyName')"
        class="d-flex justify-center"
        
      />
      <!-- <v-divider /> -->
      <v-expansion-panels variant="accordion" >
        <v-expansion-panel
          style="background-color: white"
          v-for="item in panelstitle"
          :key="item.tid"
          link
        >
          <v-expansion-panel-title class="v-expansion-panel-title">
            <v-list-item :prepend-icon="item.icon">
              {{ item.title }}
            </v-list-item>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <v-list-item
              v-for="subItem in panels.filter(
                (panel) => panel.tid === item.tid
              )"
              :key="subItem.id"
              :href="subItem.href"
              link
            >
              <template #title>
                <span>{{ subItem.title }}</span>
              </template>
            </v-list-item>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-navigation-drawer>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawerOpen = !drawerOpen" />
      <template #append>
        <useraction />
      </template>
    </v-app-bar>

    <v-main app class="d-flex justify-center">
      <v-container>
        <router-view v-slot="{ Component }">
          <v-fade-transition>
            <component :is="Component" />
          </v-fade-transition>
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.v-main {
  min-height: 800px;
}
</style>
