<template>
  <v-navigation-drawer>
    <!-- <v-list-item title="Navigation drawer" link></v-list-item> -->
    <div class="d-flex align-center justify-center pt-5">
      <img src="@/assets/images/logo.png" class="img" />
    </div>
    <v-list>
      <template v-for="index in panelstitle" :key="index.title">
        <template v-if="permissions == index.user">
          <v-list-item
            v-if="index.type == 'item'"
            :prepend-icon="index.icon"
            :title="index.title"
            :to="index.href"
            color="#db1d25"
            router
          ></v-list-item>
          <v-list-group v-if="index.type == 'group'">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="index.icon"
                :title="index.title"
                color="#db1d25"
              ></v-list-item>
            </template>
            <template v-for="item in panels" :key="item.title">
              <template v-if="item.badge == true">
                <v-list-item
                  v-if="permissions == item.user"
                  :title="item.title"
                  :to="item.href"
                  class=""
                  router
                >
                  <template v-slot:append>
                    <v-badge color="red" content="2" inline></v-badge>
                    <v-badge color="red" content="2" inline></v-badge>
                  </template>
                </v-list-item>
              </template>
              <div v-else>
                <v-list-item
                  v-if="permissions == item.user"
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
    </v-app-bar-title>
  </v-app-bar>

  <!-- <v-dialog id="msg-dialog" v-model="msgDialog">
    <v-card>
      <v-card-title>
        <v-row>
          <v-icon icon="mdi-alert"></v-icon>
          <span>{{ $t("dialogTitle.Hint") }}</span>
        </v-row>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="msgDialog = false"
        ></v-btn>
      </v-card-title>
      <v-card-text>{{ $t("dialogText.AppBar") }}</v-card-text>
      <v-card-actions>
        <v-btn class="white-btn mini-size" variant="tonal" @click="logout">{{
          $t("btn.Logout")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> -->
</template>

<script setup>
import { computed } from "vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
// header
import panels from "@/utils/json/panels.json";
import panelstitle from "@/utils/json/panelstitle.json";
import { useLoginStore } from "@/store/login";
const loginStore = useLoginStore();
const permissions = computed(() => loginStore.loginInfoAll.Permissions);
// console.log(permissions.value);

// const loginStore = useLoginStore();
// const route = useRoute();
// const router = useRouter();

// const msgDialog = ref(false);

// const shouldShowButton = computed(() => {
//   // 检查当前路由路径是否为 '/test'
//   return route.path !== "/SCMenu";
// });

// const logoutConfirm = () => {
//   msgDialog.value = true;
// };
// const logout = async () => {
//   msgDialog.value = false;
//   // 使用动态导入来按需加载 commonFun 模块
//   const { commonFun } = await import("@/utils/js/common.js");
//   // const commonF = commonFun().default();
//   // 现在你可以在 commonFun 中访问导入的模块
//   commonFun()
//     .logout()
//     .then((res) => {
//       if (route.path == "/SCMenu") {
//         router.go(0);
//       } else {
//         router.push("/SCMenu");
//       }

//       loginStore.reset();
//     });
// };
// const logout = () => {
//   // commonF.logout().then(res => {
//   //   router.push("/SCMenu");
//   // })

// }
</script>

<style lang="scss" scoped>
.v-list-item--active {
  background-color: #ffe0e0 !important; // 淺紅底
  color: #db1d25 !important; // 文字紅色
}
</style>
