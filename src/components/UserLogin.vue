<script setup>
import { ref } from 'vue'
import { getUserInfo } from "@/utils/api/apiClient"
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/login'


const router = useRouter()
const loginStore = useLoginStore()

const loginForm = ref({
  UserID: "",
  PWD: "",
})

const loginError = ref(null)
const isLoading = ref(false)

const login = async () => {
  if (!loginForm.value.UserID || !loginForm.value.PWD) {
    loginError.value = "請輸入帳號密碼"
    return
  }

  isLoading.value = true;
  loginError.value = null;

  try {
    const response = await getUserInfo({
      UserID: loginForm.value.UserID,
      PWD: btoa(loginForm.value.PWD), // Base64
    })
    // console.log('API 回應:', response);

    if (response.data?.Success && response.data?.Data) {
      loginStore.setUserInfo(response.data.Data)

      // loginError.value = "登入成功"
      router.push("@/pages/thing/index.vue"); 
      window.location.reload()
    } else {
      loginError.value = "登入失敗"
    }
  } catch (error) {
    // console.log(error); 
    loginError.value = error?.response?.data?.ExceptionMessage || "登入錯誤";
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <v-overlay
    class="d-flex justify-center align-center"
    scroll-strategy="block"
  >
    <v-card
      class="pa-4 text-center"
      width="400"
    >
      <v-card-title> {{ $t("basic.WarehouseManagement") }}</v-card-title>
      <v-text-field
        v-model="loginForm.UserID"
        label="帳號"
        required
      />
      <v-text-field
        v-model="loginForm.PWD"
        label="密碼"
        type="password"
        required
      />
      <v-alert
        v-if="loginError"
        type="error"
      >
        {{ loginError }}
      </v-alert>
      <v-btn :loading="isLoading" block color="primary" class="mt-4" @click="login">
        {{ $t("sys.Login") }}
      </v-btn>
    </v-card>
  </v-overlay>
</template>

