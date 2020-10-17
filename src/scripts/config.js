import { getI18n } from './i18n'
import { defaultConf } from './defaultConf'
import { throwError } from './function/main'

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
window.redditInfo = getRedditInfo()
window.youtubeInfo = getYtbInfo()

const config = Object.assign(JSON.parse(JSON.stringify(defaultConf)), GM_getValue('conf') || {})
for (const k of Object.keys(config)) {
  const defaultConfig = JSON.parse(JSON.stringify(defaultConf))
  if (defaultConfig[k]) {
    if (Object.prototype.toString.call(defaultConfig[k]) === '[object Object]') {
      for (const k1 of Object.keys(defaultConfig[k])) {
        if (Object.prototype.toString.call(defaultConfig[k][k1]) === '[object Object]') {
          config[k][k1] = Object.assign(defaultConfig[k][k1], config[k][k1])
        } else {
          config[k][k1] = config[k][k1] ?? defaultConfig[k][k1]
        }
      }
    } else {
      config[k] = config[k] ?? defaultConfig[k]
    }
  }
}
const globalConf = config.global
const debug = globalConf.other.showDetails

function getSteamInfo () {
  try {
    return Object.assign({
      userName: '',
      steam64Id: '',
      communitySessionID: '',
      storeSessionID: '',
      storeUpdateTime: 0,
      communityUpdateTime: 0
    }, GM_getValue('steamInfo'))
  } catch (e) {
    throwError(e, 'getSteamInfo')
  }
}
function getDiscordInfo () {
  try {
    return Object.assign({
      authorization: '',
      expired: true,
      updateTime: 0
    }, GM_getValue('discordInfo'))
  } catch (e) {
    throwError(e, 'getDiscordInfo')
  }
}
function getTwitchInfo () {
  try {
    return Object.assign({
      authToken: '',
      isLogin: false,
      updateTime: 0
    }, GM_getValue('twitchInfo'))
  } catch (e) {
    throwError(e, 'getTwitchInfo')
  }
}
function getTwitterInfo () {
  try {
    return Object.assign({
      authorization: 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
      ct0: '',
      updateTime: 0
    }, GM_getValue('twitterInfo'))
  } catch (e) {
    throwError(e, 'getTwitterInfo')
  }
}
function getRedditInfo () {
  try {
    return Object.assign({
      accessToken: '',
      expiresTime: 0
    }, GM_getValue('redditInfo'))
  } catch (e) {
    throwError(e, 'getRedditInfo')
  }
}
function getYtbInfo () {
  try {
    return Object.assign({
      PAPISID: '',
      updateTime: 0
    }, GM_getValue('youtubeInfo'))
  } catch (e) {
    throwError(e, 'getYtbInfo')
  }
}

export { defaultConf, globalConf, debug, config }
