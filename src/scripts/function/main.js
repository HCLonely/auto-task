import { debug } from '../config'
import { getI18n } from '../i18n'
import { throwError, unique, getUrlQuery, dateFormat, isEmptyObjArr, clearTaskInfo, uniqueTaskInfo } from './tool'

import { httpRequest, getFinalUrl, visitLink } from './httpRequest'
import { updateSteamInfo } from './social/steam'
import { updateTwitchInfo } from './social/twitch'
import { updateTwitterInfo } from './social/twitter'
import { toggleActions } from './social/toggleActions'

import { echoLog, toggleLogs } from './log'
import { getDiscordAuth } from './getAuth'

const fuc = {
  httpRequest,
  updateSteamInfo,
  getFinalUrl,
  visitLink,
  echoLog,
  toggleLogs,
  unique,
  getUrlQuery,
  dateFormat,
  isEmptyObjArr,
  toggleActions,
  getDiscordAuth,
  updateTwitchInfo,
  clearTaskInfo,
  uniqueTaskInfo,
  updateInfo,
  checkUpdate,
  newTabBlock
}
function newTabBlock () {
  try {
    const [d, cookiename] = [new Date(), 'haveVisited1']
    document.cookie = cookiename + '=1; path=/'
    document.cookie = cookiename + '=' + (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + '/' + d.getUTCFullYear() + '; path=/'
  } catch (e) {
    throwError(e, 'newTabBlock')
  }
}
function checkUpdate (s = false) {
  try {
    let status = false
    if (s) status = echoLog({ type: 'custom', text: `<li>${getI18n('checkingUpdate')}<font></font></li>` })
    httpRequest({
      url: 'https://__SITEURL__/version.json?t=' + new Date().getTime(),
      method: 'get',
      dataType: 'json',
      onload (response) {
        if (debug) console.log(response)
        const [ov1, ov2, ov3] = GM_info.script.version.split('.')
        if (response.response?.version) {
          const [nv1, nv2, nv3] = response.response.version.split('.')
          if (nv1 > ov1 || (nv1 === ov1 && nv2 > ov2) || (nv1 === ov1 && nv2 === ov2 && nv3 > ov3)) {
            echoLog({ type: 'custom', text: `<li>${getI18n('newVer') + 'V' + response.response.version}<a href="https://__SITEURL__/__FILENAME__" target="_blank">${getI18n('updateNow')}</a><font></font></li>` })
            if (s) status.success(getI18n('newVer') + response.response.version)
          } else {
            if (s) status.success(getI18n('thisIsNew'))
          }
        } else {
          if (s) status.error('Error:' + (response.statusText || response.status))
        }
      },
      ontimeout (response) {
        if (debug) console.log(response)
        if (s) status.error('Error:Timeout(0)')
      },
      onabort (response) {
        if (debug) console.log(response)
        if (s) status.error('Error:Abort(0)')
      },
      onerror (response) {
        if (debug) console.log(response)
        if (s) status.error('Error:Error(0)')
      },
      status
    })
  } catch (e) {
    throwError(e, 'checkUpdate')
  }
}
function updateInfo (data = {}, args = {}) {
  try {
    let { steamStore, steamCommunity, twitter } = args
    const defaultData = {
      groups: [],
      forums: [],
      curators: [],
      publishers: [],
      developers: [],
      franchises: [],
      fGames: [],
      wGames: [],
      announcements: [],
      discords: [],
      instagrams: [],
      twitchs: [],
      reddits: [],
      vks: [],
      twitterUsers: [],
      retweets: []
    }
    const {
      groups,
      forums,
      curators,
      publishers,
      developers,
      franchises,
      fGames,
      wGames,
      announcements,
      /* disable
    discords,
    instagrams,
    twitchs,
    reddits,
    vks,
    */
      twitterUsers,
      retweets
    } = Object.assign(defaultData, data)
    steamStore = steamStore ?? [...curators, ...publishers, ...developers, ...franchises, ...fGames, ...wGames, ...announcements].length > 0
    steamCommunity = steamCommunity ?? [...groups, ...forums, ...announcements].length > 0
    twitter = twitter ?? [...twitterUsers, ...retweets].length > 0
    const pro = []
    if (steamStore && steamCommunity) {
      pro.push(new Promise(resolve => {
        updateSteamInfo(resolve, 'all')
      }))
    } else if (steamStore) {
      pro.push(new Promise(resolve => {
        updateSteamInfo(resolve, 'store')
      }))
    } else if (steamCommunity) {
      pro.push(new Promise(resolve => {
        updateSteamInfo(resolve, 'community')
      }))
    }
    if (twitter) {
      pro.push(new Promise(resolve => {
        if (new Date().getTime() - twitterInfo.updateTime > 15 * 60 * 1000) {
          updateTwitterInfo(resolve)
        } else {
          resolve()
        }
      }))
    }
    return Promise.all(pro)
  } catch (e) {
    throwError(e, 'updateInfo')
  }
}
export { fuc, throwError }
