
import { defineStore } from "pinia"
import { reactive, ref, computed } from 'vue'
export const useLoginStore = defineStore('login', () => {
  const isLoggedIn = ref(sessionStorage.getItem('isLoggedIn') === 'true');

  const loginInfo = reactive({
    StaffID: sessionStorage.getItem('StaffID'),
    UserName: sessionStorage.getItem('Name'),
    Area: sessionStorage.getItem('Area'),
    TokenUid: sessionStorage.getItem('TokenUid'),
    Permission: sessionStorage.getItem('Permission')
  })


  const setUserInfo = (data) => {
    Object.entries(data).forEach(k => { sessionStorage.setItem(k[0], k[1]) });
    loginInfo.StaffID = data.StaffID;
    loginInfo.UserName = data.Name;
    loginInfo.Area = data.Area;
    loginInfo.Permission = data.Permission;
    isLoggedIn.value = true;
    // sessionStorage.setItem("isLoggedIn", isLoggedIn.value);
  }

  const logOutClear = () => {
    sessionStorage.clear();
    isLoggedIn.value = false;
    Object.keys(loginInfo).forEach(e => {
      loginInfo[e] = '';
    })
  }

  const isLogin = computed(() => { return isLoggedIn.value })
  const getLoginInfo = computed(() => { return loginInfo })



  return {
    isLogin,
    getLoginInfo,
    setUserInfo,
    logOutClear
  }
})
