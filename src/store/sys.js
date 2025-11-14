import { defineStore } from "pinia"
import { ref, reactive } from 'vue'

export const useSysStore = defineStore('sys', () => {
    const appId = ref('ct00')  // 目前的單元
    const fontSizeId = ref('S')  // 字體大小 S,M,L
    const navType = ref(true)  // 主選單樣式 true:動畫版 false:按鈕版
    const loading = ref(false)
    const noticeVisible = ref(false)
    const noticeText = ref('')
    const URLSet = reactive({})

    // payload = {appId: "ct00"}
    const setAppId = (payload) => {
        appId.value = payload.appId
    }
    // payload = {fontSizeId: "S"}
    const setFontSizeId = (payload) => {
        fontSizeId.value = payload.fontSizeId
        switch (payload.fontSizeId) {
            case 'S':
                document.documentElement.classList.remove('font_mid', 'font_big');
                document.documentElement.classList.add('font_generall');
                break;
            case 'M':
                document.documentElement.classList.remove('font_big', 'font_generall');
                document.documentElement.classList.add('font_mid');
                break;
            case 'L':
                document.documentElement.classList.remove('font_mid', 'font_generall');
                document.documentElement.classList.add('font_big');
                break;
            default:
                document.documentElement.classList.remove('font_mid', 'font_big');
                document.documentElement.classList.add('font_generall');
                break;
        }
        localStorage.setItem('fontSizeId', payload.fontSizeId)
    }

    const setNavType = (payload) => {
        navType.value = payload.navType
        localStorage.setItem('navType', payload.navType)
    }

    const setLoading = (payload) => {
        loading.value = payload
    }

    const setNotice = (text, visible = true) => {
        noticeVisible.value = visible
        noticeText.value = text
    }

    const setURLSet = payload => {
        for(let key in payload) URLSet[key] = payload[key]
    }

    return {
        appId,
        fontSizeId,
        navType,
        loading,
        noticeVisible,
        noticeText,
        URLSet,

        setAppId,
        setFontSizeId,
        setNavType,
        setLoading,
        setNotice,
        setURLSet
    }
})
