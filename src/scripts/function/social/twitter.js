import { debug } from '../../config'
import { echoLog } from '../log'
import { httpRequest } from '../httpRequest'
import { unique } from '../tool'
import { getI18n } from '../../i18n'

function updateTwitterInfo () {
  return new Promise(resolve => {
    const status = echoLog({ type: 'updateTwitterInfo' })

    httpRequest({
      url: 'https://twitter.com/settings/account?k',
      method: 'HEAD',
      onload (response) {
        if (debug) console.log(response)
        if (response.finalUrl.includes('twitter.com/login')) {
          status.error('Error:' + getI18n('loginTwitter'), true)
          resolve({ result: 'error', statusText: response.statusText, status: response.status })
          return
        }
        if (response.status === 200) {
          const ct0 = response.responseHeaders.match(/ct0=(.+?);/)?.[1]
          if (ct0) {
            twitterInfo.ct0 = ct0
            twitterInfo.updateTime = new Date().getTime()
            status.success()
            resolve({ result: 'success', statusText: response.statusText, status: response.status })
          } else {
            status.error('Error: Parameter "ct0" not found!')
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
  })
}
async function toggleTwitterUser (r, name, follow = true) {
  const userId = await getTwitterUserId(name)
  if (!userId) {
    return r({ result: 'error', statusText: '"getTwitterUserId" failed', status: 0 })
  }
  const status = echoLog({ type: `${follow ? '' : 'un'}followTwitterUser`, text: name })
  httpRequest({
    url: `https://api.twitter.com/1.1/friendships/${follow ? 'create' : 'destroy'}.json`,
    method: 'POST',
    headers: { authorization: 'Bearer ' + twitterInfo.authorization, 'Content-Type': 'application/x-www-form-urlencoded', 'x-csrf-token': twitterInfo.ct0 },
    data: $.param({ include_profile_interstitial_type: 1, include_blocking: 1, include_blocked_by: 1, include_followed_by: 1, include_want_retweets: 1, include_mute_edge: 1, include_can_dm: 1, include_can_media_tag: 1, skip_status: 1, id: userId }),
    onload (response) {
      if (debug) console.log(response)
      if (response.status === 200) {
        status.success()
        r({ result: 'success', statusText: response.statusText, status: response.status })
      } else {
        status.error('Error:' + response.statusText + '(' + response.status + ')')
        r({ result: 'error', statusText: response.statusText, status: response.status })
      }
    },
    r,
    status
  })
}

async function toggleRetweet (r, retweetId, retweet = true) {
  const status = echoLog({ type: `${retweet ? '' : 'un'}retweet`, text: retweetId })
  httpRequest({
    url: `https://api.twitter.com/1.1/statuses/${retweet ? '' : 'un'}retweet.json`,
    method: 'POST',
    headers: { authorization: 'Bearer ' + twitterInfo.authorization, 'Content-Type': 'application/x-www-form-urlencoded', 'x-csrf-token': twitterInfo.ct0 },
    data: $.param({ tweet_mode: 'extended', id: retweetId }),
    responseType: 'json',
    onload (response) {
      if (debug) console.log(response)
      if (response.status === 200 || (response.status === 403 && response.response?.errors?.[0]?.code === 327)) {
        status.success()
        r({ result: 'success', statusText: response.statusText, status: response.status })
      } else {
        status.error('Error:' + response.statusText + '(' + response.status + ')')
        r({ result: 'error', statusText: response.statusText, status: response.status })
      }
    },
    r,
    status
  })
}
function getTwitterUserId (name) {
  return new Promise(resolve => {
    const status = echoLog({ type: 'getTwitterUserId', text: name })
    httpRequest({
      url: 'https://api.twitter.com/graphql/-xfUfZsnR_zqjFd-IfrN5A/UserByScreenName?variables=%7B%22screen_name%22%3A%22' + name + '%22%2C%22withHighlightedLabel%22%3Atrue%7D',
      method: 'POST',
      headers: { authorization: 'Bearer ' + twitterInfo.authorization, 'content-type': 'application/json' },
      responseType: 'json',
      anonymous: true,
      onload: (response) => {
        if (debug) console.log(response)
        if (response.status === 200) {
          const userId = response.response?.data?.user?.rest_id // eslint-disable-line camelcase
          if (userId) {
            status.success()
            resolve({ result: 'success', statusText: response.statusText, status: response.status, userId })
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
  }).then(data => {
    const userId = data.result === 'success' ? data?.userId : null
    return userId || false
  }).catch(() => {
    return false
  })
}

async function toggleTwitterActions ({ website, type, elements, resolve, action, toFinalUrl = {} }) {
  if (new Date().getTime() - twitterInfo.updateTime > 10 * 60 * 1000) {
    await updateTwitterInfo()
  }
  for (const element of unique(elements)) {
    let id = element
    if (website === 'giveawaysu' && toFinalUrl[element]) {
      const toFinalUrlElement = toFinalUrl[element] || ''
      switch (type) {
        case 'follow':
          id = toFinalUrlElement.match(/https:\/\/twitter.com\/(.+)/)?.[1]
          break
        case 'retweet':
          id = toFinalUrlElement.match(/https:\/\/twitter.com\/.*?\/status\/([\d]+)/)?.[1]
          break
      }
    }
    switch (type) {
      case 'follow':
        await new Promise(resolve => {
          toggleTwitterUser(resolve, id, action === 'fuck')
        })
        break
      case 'retweet':
        await new Promise(resolve => {
          toggleRetweet(resolve, id, action === 'fuck')
        })
        break
    }
  }
  resolve()
}
export { toggleTwitterActions }
