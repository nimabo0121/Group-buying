<script setup>
import { ref } from "vue";
import UserLogin from "@/components/UserLogin.vue";
import { useLoginStore } from '@/stores/login';
import router from "@/router";
const loginStore = useLoginStore();

const UserName = ref(loginStore.getLoginInfo.UserName);

const loginlist = ref(false)
const toggleLoginlist = () =>{
  loginlist.value = !loginlist.value
}


const logout = () =>{
  loginStore.logOutClear();
  UserName.value = null;
  setTimeout(() => {
    window.location.reload(); 
  }, 50);
  router.push("/")
}
</script>
<template>
  <span class="mx-1">
    {{ UserName }}
  </span>
  <div v-if="UserName == null">
    <v-btn
      icon="mdi-login"
      @click="toggleLoginlist"
    />
    <!-- {{ $t("sys.Login") }} -->
  </div>
  <div v-else>
    <v-btn
      icon="mdi-logout"
      @click="logout"
    />
    <!-- {{ $t("sys.Logout") }} -->
  </div>
  <UserLogin v-model="loginlist" />
  <!-- login 視窗 -->
  <!-- <v-overlay
    v-model="loginlist"
    class="d-flex justify-center align-center"
    scroll-strategy="block"
  >
    <v-card class="pa-4 text-center" width="300">
      <h3>登入</h3>
    </v-card>
  </v-overlay> -->
</template>
<style></style>
