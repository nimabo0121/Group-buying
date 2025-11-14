import { defineStore } from "pinia"
import { ref, reactive } from 'vue'

export const useSysStore = defineStore('sys', () => {

  const menuList = ref([])
  const proList = ref([])
  const loading = ref(false)
  const URLSet = reactive({})
  const pageTitle = ref('');
  const setLoading = (payload) => {
    loading.value = payload
  }

  const setURLSet = (payload) => {
    for (let key in payload) URLSet[key] = payload[key]
  }

  const setNavItems = (payload) => {
    menuList.value = payload;
  }

  const setPageTitle = (payload) => {
    pageTitle.value = payload;
  }
  const addDays = (days) => {
    var today = new Date();
    today.setDate(today.getDate() + days);
    return today;
  }

  const minusDays = (days) => {
    var today = new Date();
    today.setDate(today.getDate() - days);
    return today;
  }

  // 返回頁面頂端
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return {
    menuList,
    proList,
    URLSet,
    loading,
    pageTitle,
    setLoading,
    setURLSet,
    setNavItems,
    addDays,
    minusDays,
    scrollToTop,
    setPageTitle,
  }
})


