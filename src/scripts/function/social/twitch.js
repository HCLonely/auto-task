import { debug } from '../../config'
import { echoLog } from '../log'
import { httpRequest } from '../httpRequest'
import { unique } from '../tool'
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
    if (debug) console.log(e)
    if (notice) {
      Swal.fire({
        title: getI18n('updateTwitchInfoError'),
        icon: 'error'
      })
    }
  }
}

function verifyTwitchAuth () {
  const status = echoLog({ type: 'verifyTwitchAuth' })

  return new Promise(resolve => {
    httpRequest({
      url: 'https://gql.twitch.tv/gql',
      method: 'POST',
      dataType: 'json',
      headers: { Authorization: 'OAuth ' + twitchInfo.authToken, 'Client-Id': twitchInfo.clientId },
      data: '[{"operationName":"FrontPageNew_User","variables":{"limit":1},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"64bd07a2cbaca80699d62636d966cf6395a5d14a1f0a14282067dcb28b13eb11"}}}]',
      onload (response) {
        if (debug) console.log(response)
        if (response.status === 200 && response.response?.[0]?.data?.currentUser) {
          status.success()
          resolve({ result: 'success', statusText: response.statusText, status: response.status })
        } else {
          status.error('Error:' + getI18n('updateTwitchAuth', true))
          resolve({ result: 'error', statusText: response.statusText, status: response.status })
        }
      },
      r: resolve,
      status
    })
  }).then(({ result }) => {
    return result === 'success'
  }).catch(error => {
    if (debug) console.log(error)
    return false
  })
}

async function toggleTwitchChannel (resolve, name, follow = true) {
  const channelId = await getTwitchChannelId(name)
  if (!channelId) {
    return resolve({ result: 'error', statusText: '"getTwitchChannelId" failed', status: 0 })
  }
  const status = echoLog({ type: `${follow ? '' : 'un'}followTwitchChannel`, text: name })
  const followData = '[{"operationName":"FollowButton_FollowUser","variables":{"input":{"disableNotifications":false,"targetID":"' + channelId + '"}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"3efee1acda90efdff9fef6e6b4a29213be3ee490781c5b54469717b6131ffdfe"}}}]'
  const unfollowData = '[{"operationName":"FollowButton_UnfollowUser","variables":{"input":{"targetID":"' + channelId + '"}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"d7fbdb4e9780dcdc0cc1618ec783309471cd05a59584fc3c56ea1c52bb632d41"}}}]'
  httpRequest({
    url: 'https://gql.twitch.tv/gql',
    method: 'POST',
    dataType: 'json',
    headers: { Authorization: 'OAuth ' + twitchInfo.authToken },
    data: follow ? followData : unfollowData,
    onload (response) {
      if (debug) console.log(response)
      if (response.status === 200) {
        status.success()
        resolve({ result: 'success', statusText: response.statusText, status: response.status })
      } else {
        status.error('Error:' + response.statusText + '(' + response.status + ')')
        resolve({ result: 'error', statusText: response.statusText, status: response.status })
      }
    },
    r: resolve,
    status
  })
}

function getTwitchChannelId (name) {
  return new Promise(resolve => {
    const status = echoLog({ type: 'getTwitchChannelId', text: name })
    httpRequest({
      url: 'https://gql.twitch.tv/gql',
      method: 'POST',
      headers: { Authorization: 'OAuth ' + twitchInfo.authToken, 'Client-Id': twitchInfo.clientId },
      responseType: 'json',
      data: '[{"operationName":"ActiveWatchParty","variables":{"channelLogin":"' + name + '"},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"4a8156c97b19e3a36e081cf6d6ddb5dbf9f9b02ae60e4d2ff26ed70aebc80a30"}}}]',
      onload: (response) => {
        if (debug) console.log(response)
        if (response.status === 200) {
          const channelId = response.response?.[0]?.data?.user?.id
          if (channelId) {
            status.success()
            resolve({ result: 'success', statusText: response.statusText, status: response.status, channelId })
          } else {
            status.error('Error:' + response.statusText + '(' + response.status + ')')
            resolve({ result: 'error', statusText: response.statusText, status: response.status })
          }
        } else {
          status.error('Error:' + response.statusText + '(' + response.status + ')')
          resolve({ result: 'error', statusText: response.statusText, status: response.status })
        }
      },
      r: resolve,
      status
    })
  }).then(({ channelId }) => {
    return channelId
  }).catch(() => {
    return false
  })
}

async function toggleTwitchActions ({ website, type, elements, resolve, action, toFinalUrl = {} }) {
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
      await new Promise(resolve => {
        toggleTwitchChannel(resolve, name, action === 'fuck')
      })
    }
  }
  resolve()
}

export { updateTwitchInfo, toggleTwitchActions }
