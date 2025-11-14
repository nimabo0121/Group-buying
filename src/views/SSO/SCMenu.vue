<template>
  <v-container class="menu">
    <div class="btn-area" v-if="isValidUser">
      <button v-for="item in ProList" :key="item.ProPath" class="page-btn" @click="goPage(item.ProID)">
        <span class="page-text">{{ item.ProName }}</span>
      </button>
    </div>
    <div v-if="!isValidUser" class="d-flex flex-column">
      <h2>{{ inValidText }}</h2>
      <img src="@/assets/images/noData.png">
    </div>

  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { commonFun } from "@/utils/js/common";
import { useRouter } from 'vue-router';
import { useLoginStore } from "@/store/login";
import { useSysStore } from '@/store/sys'
import { SCMenu } from "@/utils/api/apiClient";

const sysStore = useSysStore();
const commonF = commonFun();
const isValidUser = ref(true);
const inValidText = ref("")
const ProList = ref([]);
const router = useRouter();
const loginStore = useLoginStore();
onMounted(() => {
  if (!loginStore.isLoggedIn) {
    commonF.vaildSCMenuSID()
      .then(res => {
        // console.log("SSO  res", res);
        ProList.value = res.filter(e =>  !sysStore.URLSet.MissProID?.includes(e.ProID));
      })
      .catch(err => {
        // console.log(err);
        isValidUser.value = false;
        inValidText.value = err;
      })
  }else{
    getMenu();
  }
});

const goPage = (proPath) => {
  router.push("/" + proPath);
}


const getMenu = () => {
  console.log(sysStore.URLSet.MissProID);
  SCMenu().then(res => {

    ProList.value = res.data.Data.SysList[0].MenuList[0].ProList.filter(e =>  !sysStore.URLSet.MissProID?.includes(e.ProID));

    // console.log(ProList.value);
    // console.log("getMenu:",res.data.Data.SysList[0].MenuList[0].ProList);
  })
}

</script>

<style lang="scss" scoped>
.menu {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60%;

  img {
    margin: auto;
    margin-top: 30px;
  }
}

.btn-area {
  flex-flow: wrap;
  box-sizing: border-box;
  display: flex;
  max-width: 68vw;

  .page-btn {
    flex-direction: row;
    box-sizing: border-box;
    display: flex;
    place-content: center flex-start;
    align-items: center;
    margin-right: 32px;
    width: 200px;
    height: 80px;
    background: #FFFFFF;
    border: 2px solid #D6D6D6;
    border-radius: 8px;
    margin-bottom: 32px;

    .page-text {
      margin-left: 16px;
      font-family: "Noto Sans CJK TC";
      font-weight: 500;
      font-size: 20px;
      line-height: 20px;
      color: #333;
    }
  }
}
</style>
