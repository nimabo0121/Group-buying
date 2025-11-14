
import { defineStore } from "pinia"
import { reactive, ref } from 'vue'

export const useLoginStore = defineStore('login', () => {
  const isLoggedIn = ref(sessionStorage.getItem('isLoggedIn') === 'true')
  // const isLoggedIn = ref(false)
  const isSCMenuMode = ref(sessionStorage.getItem('LoginMode') === 'SCMenuSSO');
  const loginLoaded = ref(false)
  const loginInfoAll = reactive({
    GroupID: sessionStorage.getItem('GroupID'),
    Permissions: sessionStorage.getItem('Permissions'),
    GroupName: sessionStorage.getItem('GroupName'),
    DeptID: sessionStorage.getItem('DeptID'),
    DeptName: sessionStorage.getItem('DeptName'),
    UserID: sessionStorage.getItem('UserID'),
    UserName: sessionStorage.getItem('UserName')
  })

  const login = (data) => {
    isLoggedIn.value = true
    sessionStorage.setItem('isLoggedIn', true);
    sessionStorage.setItem('TokenID', data.TokenID);
    Object.entries(data).forEach(k => {sessionStorage.setItem(k[0], k[1])});
    loginInfoAll.GroupID = sessionStorage.getItem('GroupID');
    loginInfoAll.GroupName = sessionStorage.getItem('GroupName');
    loginInfoAll.DeptID = sessionStorage.getItem('DeptID');
    loginInfoAll.DeptName =  sessionStorage.getItem('DeptName');
    loginInfoAll.UserID = sessionStorage.getItem('UserID');
    loginInfoAll.UserName = sessionStorage.getItem('UserName');
    loginInfoAll.CenterArea = sessionStorage.getItem('CenterArea');

  }

  const reset = () =>{
    isLoggedIn.value = false;
    isSCMenuMode.value = false;
    loginLoaded.value = false;
    Object.keys(loginInfoAll).forEach((key) => {
      loginInfoAll[key] = null; // 或者 undefined
    });
  }

  return {
    isLoggedIn,
    loginLoaded,
    loginInfoAll,
    isSCMenuMode,
    login,
    reset


  }
})
