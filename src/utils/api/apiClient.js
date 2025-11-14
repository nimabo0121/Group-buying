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
// #region 釋放控制權
export const UnRegister = (data) => {
  return req("POST", "/UnRegister", data);
};
// #endregion
// #region 等待紙張放入
export const PaperStatusTimeout = (data) => {
  return req("POST", "/PaperStatusTimeout", data);
};
//#endregion
// #region 取得入紙口狀態
export const PaperStatus = (data) => {
  return req("POST", "/PaperStatus", data);
};
//#endregion
// #region 設定放入紙張類型
export const Insert = (data) => {
  return req("POST", "/Insert", data);
};
//#endregion
// #region 退紙
export const Eject = (data) => {
  return req("POST", "/Eject", data);
};
//#endregion
// #region 設定列印起始行
export const LineSet = (data) => {
  return req("POST", "/LineSet", data);
};
//#endregion
// #region 讀磁條
export const MSRead = (data) => {
  return req("POST", "/MSRead", data);
};
//#endregion
// #region 印字
export const PrintForm = (data) => {
  return req("POST", "/PrintForm", data);
};
//#endregion
// #region 印影像
export const PrintImage = (data) => {
  return req("POST", "/PrintImage", data);
};
//#endregion
// 補登 取資料
export const GetPrintData = (data) => {
  // return req("POST", "/PrintImage", data);
  return PPB_req("POST", "/PPB01010/GetPrintData", data);
};
//  92120
export const GetAccountState = (data) => {
  // return req("POST", "/PrintImage", data);
  return PPB_req("POST", "/PPB01020/GetAccountState", data);
};
// #region 分流發送電文 MUFR
export const AddPBWorkData = (data) => {
  return PPB_req("POST", "/PPB01010/AddPBWorkData", data);
};
//#endregion
// #region 取得作業狀態
export const GetWorkStatus = (data) => {
  return PPB_req("POST", "/PPB01010/GetWorkStatus", data);
};
//#endregion

// #region 磁條重建 79020
export const GetRebuildData = (data) => {
  return PPB_req("POST", "/PPB01010/GetRebuildData", data);
};

// #region 換摺 75020
export const GetNewPBData = (data) => {
  return PPB_req("POST", "/PPB01010/GetNewPBData", data);
};
// #region 再登 71028/71020
export const GetRePrintData = (data) => {
  return PPB_req("POST", "/PPB01010/GetRePrintData", data);
};
//#endregion

// #region 初始資料
export const GetInitialData = (data) => {
  return PPB_req("POST", "/PPB01010/GetInitialData", data);
};
//endregion
// #region 取得存摺封面印字資料
export const GetPBCoverData = (data) => {
  return PPB_req("POST", "/PPB01010/GetPBCoverData", data);
};
// #endregion
// #region 取得粽存定期補登資料
export const GetCDPrintData = (data) => {
  return PPB_req("POST", "/PPB01010/GetCDPrintData", data);
};
// #endregion

// #region 主管 
// 取得主管審核資料
export const GetReviewData = (data) => {
  return PPB_req("POST", "/PPB02010/GetReviewData", data);
};

// 主管審核
export const UpdateManagerStatus = (data) => {
  return PPB_req("POST", "/PPB02010/UpdateManagerStatus", data);
};
// #endregion