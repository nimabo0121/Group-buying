import { createI18n } from 'vue-i18n'
import zhTw from './locales/zh-TW.json'



export default createI18n({
  legacy: false,
  locale: 'zh-TW',
  fallbackLocale: 'zh-TW',
  messages: zhTw
})
