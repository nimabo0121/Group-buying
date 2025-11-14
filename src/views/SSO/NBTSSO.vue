<template>
  <v-container class="no-user" v-if="!isValidUser">
    <div>
      <h2>{{ inValidText }}</h2>
      <img src="@/assets/images/noData.png">
    </div>

  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { commonFun } from "@/utils/js/common";

const commonF = commonFun();
const isValidUser = ref(true);
const inValidText = ref("")

onMounted(() => {
  commonF.vaildNBTSSO()
    .then(res => {
      window.location.href = `${res}?${sessionStorage.getItem("sid")}`;
    })
    .catch(err => {
      // console.log(err);
      isValidUser.value = false;
      inValidText.value = err;
    })
});


</script>

<style lang="scss" scoped>
.no-user {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  img {
    margin: auto;
    margin-top: 30px;
  }
}
</style>
