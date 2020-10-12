import { debug } from '../../config'
import { echoLog } from '../log'
import { httpRequest } from '../httpRequest'
import { unique, throwError } from '../tool'
import { getI18n } from '../../i18n'

/* global commonOptions */

function updateTwitchInfo (notice) {
  try {
    const authToken = Cookies.get('auth-token')
    const isLogin = !!Cookies.get('login')
    if (authToken && isLogin) {
      twitchInfo.authToken = authToken
      twitchInfo.isLogin = isLogin
      twitchInfo.clientId = commonOptions?.headers['Client-ID']
      twitchInfo.updateTime = new Date().getTime()
      GM_setValue('twitchInfo', twitchInfo)
      if (notice) {
        Swal.fire({
          title: getI18n('updateTwitchInfoSuccess'),
          icon: 'success'
        })
      }
    } else {
      if (notice) {
        Swal.fire({
          title: getI18n('needLogin'),
          icon: 'warning'
        })
      }
    }
  } catch (e) {
    if (debug) console.error(e)
    if (notice) {
      Swal.fire({
        title: getI18n('updateTwitchInfoError'),
        icon: 'error'
      })
    }
  }
}

async function verifyTwitchAuth () {
  try {
    const logStatus = echoLog({ type: 'verifyTwitchAuth' })
    const { result, statusText, status, data } = await httpRequest({
      url: 'https://gql.twitch.tv/gql',
      method: 'POST',
      dataType: 'json',
      headers: { Authorization: 'OAuth ' + twitchInfo.authToken, 'Client-Id': twitchInfo.clientId },
      data: '[{"operationName":"FrontPageNew_User","variables":{"limit":1},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"64bd07a2cbaca80699d62636d966cf6395a5d14a1f0a14282067dcb28b13eb11"}}}]'
    })
    if (result === 'Success') {
      if (data.status === 200 && data.response?.[0]?.data?.currentUser) {
        logStatus.success()
        return true
      } else {
        logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
        return false
      }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
      return false
    }
  } catch (e) {
    throwError(e, 'verifyTwitchAuth')
  }
}

async function toggleTwitchChannel (name, follow = true) {
  try {
    const channelId = await getTwitchChannelId(name)
    if (!channelId) return
    const logStatus = echoLog({ type: `${follow ? '' : 'un'}followTwitchChannel`, text: name })
    const followData = '[{"operationName":"FollowButton_FollowUser","variables":{"input":{"disableNotifications":false,"targetID":"' + channelId + '"}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"3efee1acda90efdff9fef6e6b4a29213be3ee490781c5b54469717b6131ffdfe"}}}]'
    const unfollowData = '[{"operationName":"FollowButton_UnfollowUser","variables":{"input":{"targetID":"' + channelId + '"}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"d7fbdb4e9780dcdc0cc1618ec783309471cd05a59584fc3c56ea1c52bb632d41"}}}]'
    const { result, statusText, status, data } = await httpRequest({
      url: 'https://gql.twitch.tv/gql',
      method: 'POST',
      dataType: 'json',
      headers: { Authorization: 'OAuth ' + twitchInfo.authToken },
      data: follow ? followData : unfollowData
    })
    if (result === 'Success') {
      if (data.status === 200) {
        logStatus.success()
      } else {
        logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
      }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
    }
  } catch (e) {
    throwError(e, 'toggleTwitchChannel')
  }
}

async function getTwitchChannelId (name) {
  try {
    const logStatus = echoLog({ type: 'getTwitchChannelId', text: name })
    const { result, statusText, status, data } = await httpRequest({
      url: 'https://gql.twitch.tv/gql',
      method: 'POST',
      headers: { Authorization: 'OAuth ' + twitchInfo.authToken, 'Client-Id': twitchInfo.clientId },
      responseType: 'json',
      data: '[{"operationName":"ActiveWatchParty","variables":{"channelLogin":"' + name + '"},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"4a8156c97b19e3a36e081cf6d6ddb5dbf9f9b02ae60e4d2ff26ed70aebc80a30"}}}]'
    })
    if (result === 'Success') {
      if (data.status === 200) {
        const channelId = data.response?.[0]?.data?.user?.id
        if (channelId) {
          logStatus.success()
          return channelId
        } else {
          logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
          return false
        }
      } else {
        logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
        return false
      }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
      return false
    }
  } catch (e) {
    throwError(e, 'getTwitchChannelId')
  }
}

async function toggleTwitchActions ({ website, type, elements, action, toFinalUrl = {} }) {
  try {
    if (new Date().getTime() - twitchInfo.updateTime > 10 * 60 * 1000) {
      const result = await verifyTwitchAuth()
      if (!result) return
    }
    for (const element of unique(elements)) {
      let name = element
      if (website === 'giveawaysu' && toFinalUrl[element]) {
        const toFinalUrlElement = toFinalUrl[element] || ''
        name = toFinalUrlElement.match(/https:\/\/www.twitch.tv\/(.+)/)?.[1]
      }
      if (name) {
        await toggleTwitchChannel(name, action === 'fuck')
      }
    }
  } catch (e) {
    throwError(e, 'toggleTwitchActions')
  }
}

export { updateTwitchInfo, toggleTwitchActions }
