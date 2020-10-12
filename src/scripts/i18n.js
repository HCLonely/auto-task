import zh_CN from './lang/zh-CN.json' // eslint-disable-line camelcase
import en_US from './lang/en-US.json' // eslint-disable-line camelcase
import { throwError } from './function/tool'

const i18n = {
  'zh-CN': zh_CN,
  'en-US': en_US
}
const language = getLanguage()
function getLanguage () {
  try {
    let lan = GM_getValue('language') || 'auto'
    if (lan === 'auto') {
      const browserLanguage = (navigator?.browserLanguage || navigator?.language || '').toLowerCase()
      lan = browserLanguage.includes('en') ? 'en-US' : 'zh-CN'
    }
    return lan
  } catch (e) {
    throwError(e, 'getLanguage')
  }
}
function getI18n (name, str = null) {
  try {
    let value = 'null'
    if (str) value = i18n[language][name] ? i18n[language][name].replace(/s%/g, str) : name
    else value = i18n[language][name] || name
    return value
  } catch (e) {
    throwError(e, 'getI18n')
  }
}

export { language, getI18n }
