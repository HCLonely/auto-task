import { getI18n } from '../i18n'
import { throwError, unique, getUrlQuery, dateFormat, isEmptyObjArr, clearTaskInfo, uniqueTaskInfo, delay, assignment, addDelayNotice, deleteDelayNotice, notice } from './tool'

import { httpRequest, getFinalUrl, visitLink } from './httpRequest'
import { updateSteamInfo } from './social/steam'
import { updateTwitchInfo } from './social/twitch'
import { updateTwitterInfo } from './social/twitter'
import { updateYtbInfo } from './social/youtube'
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
  assignment,
  getDiscordAuth,
  updateTwitchInfo,
  updateYtbInfo,
  clearTaskInfo,
  uniqueTaskInfo,
  updateInfo,
  checkUpdate,
  newTabBlock,
  delay,
  addDelayNotice,
  deleteDelayNotice,
  notice
}
function newTabBlock () {
  try {
    const date = new Date()
    const cookiename = 'haveVisited1'
    document.cookie = cookiename + '=1; path=/'
    document.cookie = cookiename + '=' + (date.getUTCMonth() + 1) + '/' + date.getUTCDate() + '/' + date.getUTCFullYear() + '; path=/'
  } catch (e) {
    throwError(e, 'newTabBlock')
  }
}
async function checkUpdate (s = false) {
  try {
    let logStatus = false
    if (s) logStatus = echoLog({ type: 'custom', text: `<li>${getI18n('checkingUpdate')}<font></font></li>` })
    const { result, statusText, status, data } = await httpRequest({
      url: 'https://__SITEURL__/version.json?t=' + new Date().getTime(),
      method: 'get',
      dataType: 'json'
    })
    if (result === 'Success') {
      const [ov1, ov2, ov3] = GM_info.script.version.split('.')
      if (data.response?.version) {
        const [nv1, nv2, nv3] = data.response.version.split('.')
        if (nv1 > ov1 || (nv1 === ov1 && nv2 > ov2) || (nv1 === ov1 && nv2 === ov2 && nv3 > ov3)) {
          echoLog({ type: 'custom', text: `<li>${getI18n('newVer') + 'V' + data.response.version}<a href="https://__SITEURL__/__FILENAME__?t=${new Date().getTime()}" target="_blank">${getI18n('updateNow')}</a><font></font></li>` })
          if (s) logStatus.success(getI18n('newVer') + data.response.version)
        } else {
          if (s) logStatus.success(getI18n('thisIsNew'))
        }
      } else {
        if (s) logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
      }
    } else {
      if (s) logStatus.error(`${result}:${statusText}(${status})`)
    }
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
      retweets: [],
      youtubeChannels: [],
      youtubeVideos: []
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
      pro.push(updateSteamInfo('all'))
    } else if (steamStore) {
      pro.push(updateSteamInfo('store'))
    } else if (steamCommunity) {
      pro.push(updateSteamInfo('community'))
    }
    if (twitter && new Date().getTime() - twitterInfo.updateTime > 15 * 60 * 1000) {
      pro.push(updateTwitterInfo())
    }
    return Promise.all(pro)
  } catch (e) {
    throwError(e, 'updateInfo')
  }
}
export { fuc, throwError }
