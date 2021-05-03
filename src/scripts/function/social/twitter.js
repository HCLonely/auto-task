import { echoLog } from '../log'
import { httpRequest } from '../httpRequest'
import { unique, throwError } from '../tool'
import { getI18n } from '../../i18n'

async function updateTwitterInfo () {
  try {
    const logStatus = echoLog({ type: 'text', text: 'updateTwitterInfo' })
    const { result, statusText, status, data } = await httpRequest({
      url: 'https://twitter.com/settings/account?k',
      method: 'HEAD',
      cookie: 'ct0='
    })
    if (result === 'Success') {
      if (data.finalUrl.includes('twitter.com/login')) {
        logStatus.error('Error:' + getI18n('loginTwitter'), true)
        return false
      }
      if (data.status === 200) {
        const ct0 = data.responseHeaders.match(/ct0=(.+?);/)?.[1]
        if (ct0) {
          twitterInfo.ct0 = ct0
          twitterInfo.updateTime = new Date().getTime()
          GM_setValue('twitterInfo', twitterInfo)
          logStatus.success()
          return true
        } else {
          logStatus.error('Error: Parameter "ct0" not found!')
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
    throwError(e, 'updateTwitterInfo')
  }
}
async function toggleTwitterUser (name, follow = true) {
  try {
    if (whiteList.enable && !follow && whiteList.twitter.user.includes(name)) {
      return { result: 'Skiped', statusText: 'OK', status: 605 }
    }
    const userId = await getTwitterUserId(name)
    if (!userId) return
    const logStatus = echoLog({ type: `${follow ? '' : 'un'}followTwitterUser`, text: name })
    const { result, statusText, status, data } = await httpRequest({
      url: `https://api.twitter.com/1.1/friendships/${follow ? 'create' : 'destroy'}.json`,
      method: 'POST',
      headers: { authorization: 'Bearer ' + twitterInfo.authorization, 'Content-Type': 'application/x-www-form-urlencoded', 'x-csrf-token': twitterInfo.ct0 },
      data: $.param({ include_profile_interstitial_type: 1, include_blocking: 1, include_blocked_by: 1, include_followed_by: 1, include_want_retweets: 1, include_mute_edge: 1, include_can_dm: 1, include_can_media_tag: 1, skip_status: 1, id: userId })
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
    throwError(e, 'toggleTwitterUser')
  }
}

async function toggleRetweet (retweetId, retweet = true) {
  try {
    if (whiteList.enable && !retweet && whiteList.twitter.tweet.includes(retweetId)) {
      return { result: 'Skiped', statusText: 'OK', status: 605 }
    }
    const logStatus = echoLog({ type: `${retweet ? '' : 'un'}retweet`, text: retweetId })
    const { result, statusText, status, data } = await httpRequest({
      url: `https://api.twitter.com/1.1/statuses/${retweet ? '' : 'un'}retweet.json`,
      method: 'POST',
      headers: { authorization: 'Bearer ' + twitterInfo.authorization, 'Content-Type': 'application/x-www-form-urlencoded', 'x-csrf-token': twitterInfo.ct0 },
      data: $.param({ tweet_mode: 'extended', id: retweetId }),
      responseType: 'json'
    })
    if (result === 'Success') {
      if (data.status === 200 || (data.status === 403 && data.response?.errors?.[0]?.code === 327)) {
        logStatus.success()
      } else {
        logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
      }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
    }
  } catch (e) {
    throwError(e, 'toggleRetweet')
  }
}
async function getTwitterUserId (name) {
  try {
    const logStatus = echoLog({ type: 'getTwitterUserId', text: name })
    const { result, statusText, status, data } = await httpRequest({
      url: 'https://api.twitter.com/graphql/-xfUfZsnR_zqjFd-IfrN5A/UserByScreenName?variables=%7B%22screen_name%22%3A%22' + name + '%22%2C%22withHighlightedLabel%22%3Atrue%7D',
      method: 'GET',
      headers: { authorization: 'Bearer ' + twitterInfo.authorization, 'content-type': 'application/json' },
      responseType: 'json',
      anonymous: true
    })
    if (result === 'Success') {
      if (data.status === 200) {
        let response = data.response || (typeof data.responseText === 'object' ? data.responseText : null)
        if (!response) {
          try {
            response = JSON.parse(data.responseText)
          } catch (e) { }
        }
        const userId = response?.data?.user?.rest_id // eslint-disable-line camelcase
        if (userId) {
          logStatus.success()
          return userId
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
    throwError(e, 'getTwitterUserId')
  }
}

async function toggleTwitterActions ({ website, type, elements, action, toFinalUrl = {} }) {
  try {
    for (const element of unique(elements)) {
      let id = element
      if (website === 'giveawaysu' && toFinalUrl[element]) {
        const toFinalUrlElement = toFinalUrl[element] || ''
        switch (type) {
          case 'follow':
            id = toFinalUrlElement.match(/https:\/\/twitter\.com\/(.+)/)?.[1]
            break
          case 'retweet':
            id = toFinalUrlElement.match(/https:\/\/twitter\.com\/.*?\/status\/([\d]+)/)?.[1]
            break
        }
      }
      if (id) {
        switch (type) {
          case 'follow':
            await toggleTwitterUser(id, action === 'fuck')
            break
          case 'retweet':
            await toggleRetweet(id, action === 'fuck')
            break
        }
      }
    }
  } catch (e) {
    throwError(e, 'toggleTwitterActions')
  }
}
export { toggleTwitterActions, updateTwitterInfo }
