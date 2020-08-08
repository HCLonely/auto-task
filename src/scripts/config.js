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

export { defaultConf, globalConf, debug, config }
