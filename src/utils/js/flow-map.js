import { defineAsyncComponent } from "vue";

export const FLOW = {
  // #region 補登
  // 補登取控制權 =>讀取磁條資料
  0: { cmp:defineAsyncComponent(() => import("@/components/steps/Step00Connect")), onEnter: "ConnectFn" },
  1: { cmp: defineAsyncComponent(() => import("@/components/steps/Step01Insert")), onEnter: "checkPaper"},
  2: { cmp: defineAsyncComponent(() => import("@/components/steps/Step02MsRead")), onEnter: "readMagStrip"},
  3: { cmp: defineAsyncComponent(() => import("@/components/steps/Step03NoPassbook")), onEnter: "NoPassbook", yes: 0, no: 25 },
  // 補登流程
  10: { cmp: defineAsyncComponent(() => import("@/components/steps/Step10ChkSeq")), onEnter: "checkSeq" },
  11: { cmp: defineAsyncComponent(() => import("@/components/steps/Step11ChkBal")), onEnter: "checkBal" },
  12: { cmp: defineAsyncComponent(() => import("@/components/steps/Step12Route")), onEnter: "routeBySuject" },
  13: { cmp: defineAsyncComponent(() => import("@/components/steps/Step13Print")), onEnter: "printAndWrite"},
  14: { cmp: defineAsyncComponent(() => import("@/components/steps/Step14ConnectTwo")), onEnter: "ConnectFnTwo"},
  15: { cmp: defineAsyncComponent(() => import("@/components/steps/Step15CheckPaperTwo")), onEnter: "checkPaperTwo" },
  16: { cmp: defineAsyncComponent(() => import("@/components/steps/Step16PageChange")), onEnter: "PageChangeTime"},
  17: { cmp: defineAsyncComponent(() => import("@/components/steps/Step17Onetext")), onEnter: "Onetext", yes: 121, no: 21 },
  18: { cmp: defineAsyncComponent(() => import("@/components/steps/Step18OnetextCheck")), onEnter: "OnetextCheck", yes: 14 },
  19: { cmp: defineAsyncComponent(() => import("@/components/steps/Step19PBBALCheck")), onEnter: "PBBALCheck", yes: 24, no: 21 }, // 補登餘額檢查
  120: { cmp: defineAsyncComponent(() => import("@/components/steps/Step120Medium")), onEnter: "Step120Medium" }, // 補登資料中介
  121: { cmp: defineAsyncComponent(() => import("@/components/steps/Step121Medium")), onEnter: "Step121Medium"}, // 補登資料填入
// #endregion
// #region 退出機器、其它
20: { cmp: defineAsyncComponent(() => import("@/components/steps/Step20Eject")), onEnter: "ejectPassbook"},
21: { cmp: defineAsyncComponent(() => import("@/components/steps/Step21Quit")), onEnter: "ejectAndQuit" }, // 終點
22: { cmp: defineAsyncComponent(() => import("@/components/steps/Step22Rebuild")), onEnter: "goRebuild" }, // 終點
23: { cmp: defineAsyncComponent(() => import("@/components/steps/Step23OutOfControl")), onEnter: "OutOfControl" }, // 終點
24: { cmp: defineAsyncComponent(() => import("@/components/steps/Step24nodataRebuild")), onEnter: "nodataRebuild" }, 
25: { cmp: defineAsyncComponent(() => import("@/components/steps/Step25noDataOutOfControl")), onEnter: "noDataOutOfControl" }, 
// #endregion
// #region 再登、磁條重建、封面印字、定期補登
  30: { cmp: defineAsyncComponent(() => import("@/components/MS_steps/MS_Step30checkBal")), onEnter: "MS_checkBal" },
  31: { cmp: defineAsyncComponent(() => import("@/components/MS_steps/MS_Step31DeLiver")), onEnter: "MS_DeLiver" }, 
  32: { cmp: defineAsyncComponent(() => import("@/components/MS_steps/MS_Step32emitData")), onEnter: "MS_Emitdata" }, 
  33: { cmp: defineAsyncComponent(() => import("@/components/MS_steps/MS_Step33Connect")), onEnter: "MS_ConnectFn" },
  34: { cmp: defineAsyncComponent(() => import("@/components/MS_steps/MS_Step34checkPaper")), onEnter: "MS_checkPaper" },
  // 綜存定期補登 跳轉中介
  111: { cmp: defineAsyncComponent(() => import("@/components/MS_steps/MS_Step111PageCheck")), onEnter: "MS_PageCheck", yes: 30 }, 

  // #endregion
  // #region 換發
  40: { cmp: defineAsyncComponent(() => import("@/components/CH_steps/CH_Step40checkBal")), onEnter: "CH_checkBal" },
  41: { cmp: defineAsyncComponent(() => import("@/components/CH_steps/CH_Step41DeLiver")), onEnter: "CH_DeLiver" },
  42: { cmp: defineAsyncComponent(() => import("@/components/CH_steps/CH_Step42emitData")), onEnter: "CH_Emitdata" },
  43: { cmp: defineAsyncComponent(() => import("@/components/CH_steps/CH_Step43checkPaper")), onEnter: "CH_checkPaper" },
  44: { cmp: defineAsyncComponent(() => import("@/components/CH_steps/CH_Step44PrintForm")), onEnter: "CH_PrintForm" },
  // #endregion
  // #region 錯誤處理
  98: { cmp: defineAsyncComponent(() => import("@/components/steps_Error/StepmachineAgain")), onEnter: "machineAgain" }, // 重新印製
  99: { cmp: defineAsyncComponent(() => import("@/components/steps_Error/StepMachineError")), onEnter: "machineError" }, // 機器故障
  100: { cmp: defineAsyncComponent(() => import("@/components/API_Error/APIErrorMsg")), onEnter: "ApiErrorMsg" }, // 其餘流程 錯誤回傳  動作 --只顯示訊息
  101: { cmp: defineAsyncComponent(() => import("@/components/API_Error/MUFRErrorMsg")), onEnter: "MUFRErrorMsg", yes: 25}, // 補登 補摺機錯誤回傳 動作 --退摺,退控制權

  102: { cmp: defineAsyncComponent(() => import("@/components/API_Error/MUFRErrorMsgTwo")), onEnter: "MUFRErrorMsgTwo" }, // 其餘流程 對方API機錯誤回傳 動作 --關閉,清資料
  103: { cmp: defineAsyncComponent(() => import("@/components/API_Error/PrintCoverErrorMsg")), onEnter: "PrintCoverErrorMsg" }, // 封面印字 ErrorMsg==起迄號碼與領用區間不符Y 不清資料 更新jobid
  // #endregion
  
  110:{ cmp: defineAsyncComponent(() => import("@/components/API_Error/SwitchMsgdialog")), onEnter: "SwitchMsgdialog" }, // 跳轉

  // 101: { cmp: defineAsyncComponent(() => import("@/components/API_Error/APIErrorMsg")), onEnter: "resetUserItem" }, // API 錯誤回傳
};
