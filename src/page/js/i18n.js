import zh_CN from './lang/zh-CN.json' // eslint-disable-line camelcase
import en_US from './lang/en-US.json' // eslint-disable-line camelcase

/* global language */
var i18n = {
  'zh-CN': zh_CN,
  'en-US': en_US
}
function getI18n (e, s = '') {
  return i18n[language][e] ? i18n[language][e].replace(/%s/g, s) : `{{${e}}}`
}

export { getI18n }
