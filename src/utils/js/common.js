import { useRoute, useRouter } from "vue-router";
import {
  // SSOLogin,
  // SIDLoginAP,
  // SIDLoginSCMenu,
  // SSOLogout,
  // NBTSSOVaild,
  SCLogin,
} from "@/utils/api/apiClient";
import { useLoginStore } from "@/store/login";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

export const commonFun = () => {
  const checkSSO = () => {
    return new Promise((resolve, reject) => {
      const loginStore = useLoginStore();
      const route = useRoute();
      const router = useRouter();
      console.log("route.query.param.replaceAll", route.query.param.replaceAll);

      SSOLogin(route.query.param.replaceAll(" ", "+")).then((res) => {
        if (res.data.Success) {
          loginStore.login(res.data.Data);
          router.replace({ query: null });
          resolve("登入完成");
          // router.go(0);
        }
      });
    });
  };
  // admin 主管
  // const AdminUserData = {
  //   BName: "",
  //   CenterArea: "03",
  //   DeptID: "0010",
  //   DeptName: "營業部",
  //   GroupID: "111",
  //   LogOutTime: "6000000",
  //   TokenID: "6c6045cb-8526-46e8-a17c-3b1426755a13",
  //   UserID: "007431",
  //   Permissions:'admin',
  //   UserName: "劉小帥",
  // };
  //handle 經辦
  // const HandleUserData = {
  //   BName: "",
  //   CenterArea: "03",
  //   DeptID: "0010",
  //   DeptName: "信託部",
  //   GroupID: "111",
  //   LogOutTime: "6000000",
  //   TokenID: "6c6045cb-8526-46e8-a17c-3b1426755a13",
  //   UserID: "007431",
  //   Permissions:'handle',
  //   UserName: "劉小帥1",
  // };
  const vaildSSOSID = () => {
    return new Promise((resolve, reject) => {
      const loginStore = useLoginStore();
      const route = useRoute();
      const router = useRouter();
      const sid = route.query.sid;
      console.log("sid", sid);
      // console.log("param: ", route.query.sid);
      // if (sid == "admin-user") {
      //   const fakeSID =
      //     "00743111D61B8C3D5265F4B47AA2699EC=O5;XXX;0107C;2043F301574608204DC579818E";
      //   sessionStorage.setItem("sid", fakeSID);
      //   Object.keys(AdminUserData).forEach((key) => {
      //     sessionStorage.setItem(key, AdminUserData[key]);
      //   });
      //   loginStore.login(AdminUserData);
      //   // console.log("sid", fakeSID);
      //   // console.log(AdminUserData);
      //   resolve(AdminUserData);
      // }
      // }else if(sid == "handle-user"){
      //   const fakeSID =
      //   "00743111D61B8C3D5265F4B47AA2699EC=O5;XXX;0107C;2043F301574608204DC579818E";
      // sessionStorage.setItem("sid", fakeSID);
      // Object.keys(HandleUserData).forEach((key) => {
      //   sessionStorage.setItem(key, HandleUserData[key]);
      // });
      // loginStore.login(HandleUserData);
      // // console.log("sid", fakeSID);
      // // console.log(HandleUserData);
      // resolve(HandleUserData);
      //       }
      // console.log("route.query.sid",route.query.sid);

      SCLogin(route.query.sid).then((res) => {
        if (res) {
          router.replace({ query: null });
          console.log("SCLogin", res);

          sessionStorage.setItem("sid", route.query.sid);
          loginStore.login(res.data.data);
          // console.log("userdata",res.data.Data);
          resolve(res.data.data);
          // console.log("sid", route.query.sid);

          // router.go(0);
        } else {
          reject(res.data.Message);
        }
      });
    });
  };
  // console.log(route.query.EMPO);
  // console.log(route.query.TERMNO);
  // console.log(route.query.CARDNO);
  // console.log(route.query.AUTHCODE);
  // NBTSSOVaild({EMPO: route.query.EMPO, TERMNO: route.query.TERMNO, AUTHCODE: route.query.AUTHCODE}).then((res) => {

  const vaildNBTSSO = () => {
    return new Promise((resolve, reject) => {
      const route = useRoute();
      const router = useRouter();
      // 員編、機號、卡號、Authcode認證碼
      console.log(route.query.userId);
      console.log(route.query.machineNo);
      console.log(route.query.cardNo);
      console.log(route.query.AuthCode);
      NBTSSOVaild({
        EMPO: route.query.userId,
        TERMNO: route.query.machineNo,
        AUTHCODE: route.query.AuthCode,
      }).then((res) => {
        // console.log(res.data.Data.Record.AUTHCODE);
        if (res.data.Success) {
          router.replace({ query: null });
          sessionStorage.setItem("sid", res.data.Data.Sid);
          resolve(res.data.Data.Url);
          // router.go(0);
        } else {
          reject(res.data.Message);
        }
      });
    });
  };

  const vaildSCMenuSID = () => {
    return new Promise((resolve, reject) => {
      const { t } = useI18n();
      const loginStore = useLoginStore();
      const route = useRoute();
      const router = useRouter();
      if (!route.query.sid) {
        reject(t("invalidLogin.invalidParam"));
      }
      SIDLoginSCMenu(route.query.sid).then((res) => {
        if (res.data.Success) {
          loginStore.login(res.data.Data);
          loginStore.isSCMenuMode = true;
          sessionStorage.setItem("LoginMode", "SCMenuSSO");

          router.replace({ query: null });
          resolve(res.data.Data.MenuList.SysList[0].MenuList[0].ProList);
          // router.go(0);
        } else {
          reject(res.data.Message);
        }
      });
    });
  };

  const logout = () => {
    return new Promise((resolve, reject) => {
      SSOLogout().then((res) => {
        sessionStorage.clear();
        resolve("成功登出");
      });
    });
  };

  // 帳號檢核
  function accountValidator(value) {
    const checkArray = ref([]);
    checkArray.value = value.toString().split("");
    const checkNo = ref();
    const checkSum = ref();
    if (value.length == 12) {
      // 檢查科目是否存在
      const acc = ref(value.substring(3, 5));
      if (
        acc.value != "10" &&
        acc.value != "20" &&
        acc.value != "22" &&
        acc.value != "24" &&
        acc.value != "26" &&
        acc.value != "28" &&
        acc.value != "70" &&
        acc.value != "71" &&
        acc.value != "72"
      ) {
        return "存款帳號輸入錯誤";
      }
      checkNo.value =
        11 -
        ((checkArray.value[0] * 1 +
          checkArray.value[1] * 3 +
          checkArray.value[2] * 7 +
          checkArray.value[3] * 2 +
          checkArray.value[4] * 9 +
          checkArray.value[5] * 1 +
          checkArray.value[6] * 7 +
          checkArray.value[7] * 4 +
          checkArray.value[8] * 1 +
          checkArray.value[9] * 9 +
          checkArray.value[10] * 3) %
          11);
      checkNo.value = checkNo.value
        .toString()
        .substring(checkNo.value.toString().length - 1);
      if (checkArray.value[11] != checkNo.value) {
        return "存款帳號輸入錯誤";
      }
    } else if (value.length == 14) {
      checkSum.value =
        (checkArray.value[0] * 3 +
          checkArray.value[1] * 7 +
          checkArray.value[2] * 9 +
          checkArray.value[3] * 3 +
          checkArray.value[4] * 7 +
          checkArray.value[5] * 9 +
          checkArray.value[6] * 3 +
          checkArray.value[7] * 7 +
          checkArray.value[8] * 9 +
          checkArray.value[9] * 3 +
          checkArray.value[10] * 7 +
          checkArray.value[11] * 9 +
          checkArray.value[12] * 3) %
        11;
      checkNo.value =
        checkSum.value < 2
          ? checkSum.value.toString()
          : (11 - checkSum.value).toString();
      if (checkArray.value[13] != checkNo.value) {
        return "存款帳號輸入錯誤";
      }
    } else {
      return "存款帳號輸入錯誤";
    }
  }

  // 數字檢核
  function numberValidator(value) {
    if (/\D/g.test(value.toString())) {
      return "請輸入數字";
    }
  }

  return {
    checkSSO,
    logout,
    vaildSSOSID,
    vaildSCMenuSID,
    vaildNBTSSO,
    accountValidator,
    numberValidator,
  };
};
