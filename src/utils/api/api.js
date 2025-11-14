import axios from "axios";
import { useSysStore } from "@/stores/sys";
import { hostLog } from "@/composables/JointAPI.js";

function createAxios(baseURLKey, createConfig = {}) {
  return async function (method, url, data = null, config) {
    const sysStore = useSysStore();

    await axios.get(import.meta.env.VITE_CONFIG_PATH).then((res) => {
      sysStore.setURLSet(res.data);
    });

    // console.log("API", sysStore.URLSet[baseURLKey]);
    const instance = axios.create({
      // baseURL: `${import.meta.env.VITE_API_DOMAIN}`,
      baseURL: `${sysStore.URLSet[baseURLKey]}`,
      timeout: 1000 * 200,
      withCredentials: false, // 跨域是否需要帶cookie
      headers: {
        Accept: "application/x-www-form-urlencoded",
        "Access-Control-Allow-Header": "Authorization",
        "Content-Type": "application/json",
      },
      ...createConfig,
    });

    instance.interceptors.request.use(
      function (config) {
        const token = sessionStorage.getItem("TokenID");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      function (error) {
        // Do something with request error
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      function (response) {
        // console.log("response", response);
        // 只需顯示長度的欄位
        const lengthFields = [
          "CoverData",
          "TxData",
          "FirstLineData",
          "Page1TxData",
          "Page2TxData",
          "msData"
        ];
        // 過濾
        const jsonStr = JSON.stringify(
          response?.data,
          (key, value) => {
            if (key === "") return value;
            if (lengthFields.includes(key) && typeof value === "string") {
              return `<omitted, length:${value.length}>`;
            }

            return value;
          }
        );
         
        hostLog(
          `API: ${response?.config?.url} - Status: ${
            response?.status
          } - data: ${JSON.stringify(jsonStr)}`
        );
        // Do something with response data
        return response;
      },
      function (error) {
        hostLog(
          `API Error: ${error?.config?.url} - Status: ${
            error?.response ? error?.response?.status : "No Response"
          }- data: ${JSON.stringify(error?.response?.data)}`
        );
        // 客戶連線問題
        if (!window.navigator.onLine) {
          sysStore.setNotice("網路出了點問題，請重新連線後重整網頁");
          return;
        }
        // 如果呼叫的function有寫catch則交由各自處理
        if (error.config.catch) {
          return Promise.reject(error);
        }
        // 若沒有則統一處理
        if (error.response) {
          switch (error.response.status) {
            case 404:
              sysStore.setNotice("你要找的頁面不存在");
              // go to 404 page
              break;
            case 403:
              sysStore.setNotice("403");

              return Promise.reject(error);
            case 500:
              sysStore.setNotice("程式發生問題");
              // go to 500 page
              break;
            default:
              console.log(error.message);
          }
        }
        return Promise.reject(error);
      }
    );

    method = method.toLowerCase();
    switch (method) {
      case "post":
        return instance.post(url, data, config);
      case "get":
        return instance.get(url, { params: data });
      case "delete":
        return instance.delete(url, { params: data });
      case "put":
        return instance.put(url, data);
      case "patch":
        return instance.patch(url, data);
      default:
        console.log(`未知的 method: ${method}`);
        return false;
    }
  };
}

export const req = createAxios("baseURL");
export const PPB_req = createAxios("PPB_baseURL");
export const filereq = (path) => {
  return axios.get(path);
};
// async function fetchSignOff() {
//   try {
//     const response = await filereq("/public/test-api/PartsSignOff.json");
//     console.log("test-data：", response.data);
//   } catch (error) {
//     console.error("讀取SignOff JSON 失敗：", error);
//   }

// }
// async function fetchCollar() {
//   try {
//     const response = await filereq("/public/test-api/PartsCollar.json");
//     console.log("test-data：", response.data);
//   } catch (error) {
//     console.error("讀取Collar JSON 失敗：", error);
//   }

// }
// async function fetchCollarList() {
//   try {
//     const response = await filereq("/public/test-api/PartsCollarList.json");
//     console.log("test-data：", response.data);
//   } catch (error) {
//     console.error("讀取CollarList JSON 失敗：", error);
//   }

// }
// async function userlist() {
//   try {
//     const response = await filereq("/public/test-api/userlist.json");
//     console.log("user-list：", response.data);
//   } catch (error) {
//     console.error("讀取CollarList JSON 失敗：", error);
//   }

// }
// async function kubelist() {
//   try {
//     const response = await filereq("/public/test-api/kubelist.json");
//     console.log("user-list：", response.data);
//   } catch (error) {
//     console.error("讀取kubelist JSON 失敗：", error);
//   }

// }
// fetchCollar();
// fetchSignOff();
// fetchCollarList();
// userlist();
// kubelist();
