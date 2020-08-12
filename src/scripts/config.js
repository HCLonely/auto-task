import { getI18n } from './i18n'
import { defaultConf } from './defaultConf'

if (GM_getValue('conf') && window.location.host.includes('hclonely.com/setting')) {
  if (typeof GM_getValue('conf').global?.fuck?.joinSteamGroup !== 'boolean') {
    Swal.fire({
      icon: 'warning',
      text: getI18n('firstUpdate'),
      confirmButtonText: getI18n('goSetting'),
      cancelButtonText: getI18n('cancel'),
      showCancelButton: true
    })
  }
}
window.steamInfo = getSteamInfo()
window.discordInfo = getDiscordInfo()
window.insInfo = {}
window.twitchInfo = getTwitchInfo()
window.twitterInfo = getTwitterInfo()

const config = Object.assign(JSON.parse(JSON.stringify(defaultConf)), GM_getValue('conf') || {})
for (const k of Object.keys(config)) {
  const defaultConfig = JSON.parse(JSON.stringify(defaultConf))
  config[k] = defaultConfig[k] ? Object.assign(defaultConfig[k], config[k]) : null
}
const globalConf = config.global
const debug = !!globalConf.other.showDetails

function getSteamInfo () {
  return Object.assign({
    userName: '',
    steam64Id: '',
    communitySessionID: '',
    storeSessionID: '',
    updateTime: 0
  }, GM_getValue('steamInfo'))
}
function getDiscordInfo () {
  return Object.assign({
    authorization: '',
    expired: true,
    updateTime: 0
  }, GM_getValue('discordInfo'))
}
function getTwitchInfo () {
  return Object.assign({
    authToken: '',
    isLogin: false,
    updateTime: 0
  }, GM_getValue('twitchInfo'))
}
function getTwitterInfo () {
  return Object.assign({
    authorization: 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
    ct0: '',
    updateTime: 0
  }, GM_getValue('twitterInfo'))
}

export { defaultConf, globalConf, debug, config }
