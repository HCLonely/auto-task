import { debug } from '../config'
import { getI18n } from '../i18n'

import { httpRequest, getFinalUrl, visitLink } from './httpRequest'
import { updateSteamInfo } from './social/steam'
import { updateTwitchInfo } from './social/twitch'
import { toggleActions } from './social/toggleActions'
import { unique, getUrlQuery, dateFormat, isEmptyObjArr, clearTaskInfo, uniqueTaskInfo } from './tool'
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
  checkUpdate (s = false) {
    let status = false
    const echoLog = this.echoLog
    if (s) status = echoLog({ type: 'custom', text: `<li>${getI18n('checkingUpdate')}<font></font></li>` })
    this.httpRequest({
      url: 'https://__SITEURL__/version.json?t=' + new Date().getTime(),
      method: 'get',
      dataType: 'json',
      onload (response) {
        if (debug) console.log(response)
        if (response.response?.version === GM_info.script.version) {
          if (s) status.success(getI18n('thisIsNew'))
        } else if (response.response?.version) {
          echoLog({ type: 'custom', text: `<li>${getI18n('newVer') + 'V' + response.response.version}<a href="https://github.com/HCLonely/auto-task/raw/master/__FILENAME__" target="_blank">${getI18n('updateNow')}</a><font></font></li>` })
          if (s) status.success(getI18n('newVer') + response.response.version)
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
  },
  newTabBlock () {
    const [d, cookiename] = [new Date(), 'haveVisited1']
    document.cookie = cookiename + '=1; path=/'
    document.cookie = cookiename + '=' + (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + '/' + d.getUTCFullYear() + '; path=/'
  }
}

export { fuc }
