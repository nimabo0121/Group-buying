import {
  isNationalIdentificationNumberValid,
  isResidentCertificateNumberValid,
} from "taiwan-id-validator";

// 小工具函式
const zipWith = (a, b, fn) => a.map((v, i) => fn(v, b[i]));
const multiply = (a, b) => a * b;
const add = (a, b) => a + b;

// 統一編號邏輯檢查
const isBusinessIdNumber = (value) => {
  const n = String(value).trim(); // 去除空白字元
  const regex = /^\d{8}$/;

  if (!regex.test(n)) return false;

  const multiplier = [1, 2, 1, 2, 1, 2, 4, 1];
  const intRadix = 10;

  const checksum = zipWith(
    multiplier,
    n.split("").map((c) => parseInt(c, intRadix)),
    multiply
  )
    .map((n) => (n % 10) + Math.floor(n / 10))
    .reduce(add, 0);

  const divisor = 5;

  return (
    checksum % divisor === 0 ||
    (parseInt(n.charAt(6), intRadix) === 7 && (checksum + 1) % divisor === 0)
  );
};

// 身分證字號檢查
const isNationalIdNumber = (value) => {
  const val = String(value).trim(); // 去除空白字元
  return isNationalIdentificationNumberValid(val);
};

// 居留證號檢查
const isResidentIdNumber = (value) => {
  const val = String(value).trim(); // 去除空白字元
  return isResidentCertificateNumberValid(val);
};

// 身分證 / 居留證 / 統一編號檢查
const idNumberValidator = (value) => {
  const val = String(value).trim(); // 去除空白字元

  if (isNationalIdNumber(val)) {
    return { type: "身分證字號驗證通過", valid: true, color:'green' };
  }

  if (isBusinessIdNumber(val)) {
    return { type: "統一編號驗證通過", valid: true, color:'green' };
  }

  // if (isResidentIdNumber(val)) {
  //   return { type: "居留證號", valid: true };
  // }

  return { type: "身分證/統編 錯誤", valid: false,color:'red' };
};

// 台中銀帳號
const accountValidator = (control) => {
  let value = control.replace(/\D/g, "");
  let acc = value.substring(3, 5);
  if (value == '') {
    return {type:"帳號驗證失敗", valid: false, color:'red'};
    // return null;
  }
  let char = [];
  let check;
  if (acc != "10" && acc != "20" && acc != "22" && acc != "24" && acc != "26" && acc != "28" && acc != "70" && acc != "71" && acc != "72") {
    return {type:"帳號驗證失敗", valid: false, color:'red'};
  }
  char = value.toString().split('');
  value = 11 - (((char[0] * 1) + (char[1] * 3) + (char[2] * 7) + (char[3] * 2) + (char[4] * 9) + (char[5] * 1) + (char[6] * 7) + (char[7] * 4) + (char[8] * 1) + (char[9] * 9) + (char[10] * 3)) % 11);
  check = value.toString().substring(value.toString().length - 1);
  if (char[11] != check) {
    return {type:"帳號驗證失敗", valid: false, color:'red'};
  }
  return {type:"帳號驗證通過", valid: true, color:'green'};
}




export {
  idNumberValidator,
  isNationalIdNumber,
  isResidentIdNumber,
  isBusinessIdNumber,
  accountValidator,
};
