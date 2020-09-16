import { debug } from '../../config'
import { echoLog } from '../log'
import { httpRequest } from '../httpRequest'
import { unique, throwError } from '../tool'
import { getI18n } from '../../i18n'

function updateRedditInfo () {
  try {
    return new Promise(resolve => {
      const status = echoLog({ type: 'updateRedditInfo' })

      httpRequest({
        url: 'https://www.reddit.com/',
        method: 'GET',
        nochche: true,
        onload (response) {
          if (debug) console.log(response)
          if (response.status === 200) {
            if (response.responseText.includes('www.reddit.com/login/')) {
              status.error('Error:' + getI18n('loginReddit'), true)
              resolve({ result: 'error', statusText: response.statusText, status: response.status })
              return
            }
            const [, accessToken, expiresTime] = response.responseText.match(/"accessToken":"(.*?)","expires":"(.*?)"/) || []
            if (accessToken) {
              redditInfo.accessToken = accessToken
              redditInfo.expiresTime = new Date(expiresTime).getTime()
              GM_setValue('redditInfo', redditInfo)
              status.success()
              resolve({ result: 'success', statusText: response.statusText, status: response.status })
            } else {
              status.error('Error: Parameter "accessToken" not found!')
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
  } catch (e) {
    throwError(e, 'updateRedditInfo')
  }
}

function toggleReddit (r, name, join = true) {
  try {
    const status = echoLog({ type: join ? 'joinReddit' : 'leaveReddit', text: name })

    httpRequest({
      url: 'https://oauth.reddit.com/api/subscribe?redditWebClient=desktop2x&app=desktop2x-client-production&raw_json=1&gilding_detail=1',
      method: 'POST',
      headers: { authorization: 'Bearer ' + redditInfo.accessToken, 'content-type': 'application/x-www-form-urlencoded' },
      data: $.param({
        action: join ? 'sub' : 'unsub',
        sr_name: name,
        api_type: 'json'
      }),
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
  } catch (e) {
    throwError(e, 'toggleReddit')
  }
}

async function toggleRedditActions ({ website, type, elements, resolve, action, toFinalUrl = {} }) {
  try {
    if (new Date().getTime() > redditInfo.expiresTime) {
      const result = await updateRedditInfo()
      if (!result?.result === 'success') return
    }
    for (const element of unique(elements)) {
      let name = element
      if (website === 'giveawaysu' && toFinalUrl[element]) {
        const toFinalUrlElement = toFinalUrl[element] || ''
        name = toFinalUrlElement.match(/https?:\/\/www.reddit.com\/r\/([^/]*)/)?.[1]
      }
      if (name) {
        await new Promise(resolve => {
          toggleReddit(resolve, name, action === 'fuck')
        })
      }
    }
    resolve()
  } catch (e) {
    throwError(e, 'toggleRedditActions')
  }
}
export { toggleRedditActions }
