import { filereq, req, PPB_req } from "./api";
// import { PPB_filereq, PPB_req } from "./PPB_api";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost",
  timeout: 5000,
});
//  Login 使用者登入
// export const getUserInfo = (data) => {
//   return api.post("/WHMWebAPI/api/SC/LoginUser", data);
// };

// #region SSO登入
export const SCLogin = (data) => {
  return PPB_req("POST", "/SC/SCLogin", data);
};

// #region 取得控制權
export const Register = (data) => {
  return req("POST", "/Register", data);
};
// #endregion

// #region 測試ＡＰＩ
export const ShopHomedata = (data) => {
  return filereq("/TCBBPPBWeb/json/shopdata.json", data);
};
// #endregion