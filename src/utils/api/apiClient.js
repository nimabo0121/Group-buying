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
  return filereq("/GoodGoWeb/json/shopdata.json", data);
};
// 商品資料
export const Productdata = (data) => {
  return filereq("/GoodGoWeb/json/product.json", data);
}
// 訂單資料
export const OrdersData = (data) => {
  return filereq("/GoodGoWeb/json/orders.json", data);
}
// 下單資訊info
export const storeInfo = (data) => {
  return filereq("/GoodGoWeb/json/storeInfo.json", data);
}
// user編輯資料data
export const Userdata = (data) => {
  return filereq("/GoodGoWeb/json/userdata.json", data);
}
// user儲值金data
export const ConsumerData = (data) => {
  return filereq("/GoodGoWeb/json/consumer.json", data);
}
// #endregion