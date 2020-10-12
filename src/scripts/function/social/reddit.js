import { echoLog } from '../log'
import { httpRequest } from '../httpRequest'
import { unique, throwError } from '../tool'
import { getI18n } from '../../i18n'

async function updateRedditInfo () {
  try {
    const logStatus = echoLog({ type: 'updateRedditInfo' })

    const { result, statusText, status, data } = await httpRequest({
      url: 'https://www.reddit.com/',
      method: 'GET',
      nochche: true
    })
    if (result === 'Success') {
      if (data.status === 200) {
        if (data.responseText.includes('www.reddit.com/login/')) {
          logStatus.error('Error:' + getI18n('loginReddit'), true)
          return false
        }
        const [, accessToken, expiresTime] = data.responseText.match(/"accessToken":"(.*?)","expires":"(.*?)"/) || []
        if (accessToken) {
          redditInfo.accessToken = accessToken
          redditInfo.expiresTime = new Date(expiresTime).getTime()
          GM_setValue('redditInfo', redditInfo)
          logStatus.success()
          return true
        } else {
          logStatus.error('Error: Parameter "accessToken" not found!')
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
    throwError(e, 'updateRedditInfo')
  }
}

async function toggleReddit (name, join = true) {
  try {
    let type = join ? 'joinReddit' : 'leaveReddit'
    if (/^u_/.test(name)) {
      type = join ? 'followRedditUser' : 'unfollowRedditUser'
    }
    const logStatus = echoLog({ type, text: name })

    const { result, statusText, status, data } = await httpRequest({
      url: 'https://oauth.reddit.com/api/subscribe?redditWebClient=desktop2x&app=desktop2x-client-production&raw_json=1&gilding_detail=1',
      method: 'POST',
      headers: { authorization: 'Bearer ' + redditInfo.accessToken, 'content-type': 'application/x-www-form-urlencoded' },
      data: $.param({
        action: join ? 'sub' : 'unsub',
        sr_name: name,
        api_type: 'json'
      })
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
    throwError(e, 'toggleReddit')
  }
}

async function toggleRedditActions ({ website, type, elements, action, toFinalUrl = {} }) {
  try {
    if (new Date().getTime() > redditInfo.expiresTime) {
      const result = await updateRedditInfo()
      if (!result) return
    }
    for (const element of unique(elements)) {
      let name = element
      if (website === 'giveawaysu' && toFinalUrl[element]) {
        const toFinalUrlElement = toFinalUrl[element] || ''
        name = toFinalUrlElement.match(/https?:\/\/www.reddit.com\/r\/([^/]*)/)?.[1]
        let userName = toFinalUrlElement.match(/https?:\/\/www.reddit.com\/user\/([^/]*)/)?.[1]
        if (userName) userName = 'u_' + userName
        name = name || userName
      }
      if (name) {
        await toggleReddit(name, action === 'fuck')
      }
    }
  } catch (e) {
    throwError(e, 'toggleRedditActions')
  }
}
export { toggleRedditActions }
