import { debug } from '../../config'
import { echoLog } from '../log'
import { httpRequest } from '../httpRequest'
import { unique, throwError } from '../tool'
import { getI18n } from '../../i18n'

function updateYtbInfo (notice) {
  try {
    const PAPISID = Cookies.get('__Secure-3PAPISID')
    if (PAPISID) {
      youtubeInfo.PAPISID = PAPISID
      youtubeInfo.updateTime = new Date().getTime()
      GM_setValue('youtubeInfo', youtubeInfo)
      if (notice) {
        Swal.fire({
          title: getI18n('updateYtbInfoSuccess'),
          icon: 'success'
        })
      }
    } else {
      if (notice) {
        Swal.fire({
          title: getI18n('updateYtbInfoError'),
          icon: 'error'
        })
      }
    }
  } catch (e) {
    if (debug) console.log(e)
    if (notice) {
      Swal.fire({
        title: getI18n('updateYtbInfoError'),
        icon: 'error'
      })
    }
  }
}

async function toggleYtbChannel (r, link, follow = true) {
  try {
    const { data, unknownLink, needLogin } = await getYtbToken(link)
    const { apiKey, client, request, channelId } = data || {}
    if (needLogin) return r({ result: 'error', statusText: 'needLogin', status: 0 })
    if (!apiKey) return r({ result: 'error', statusText: '"getYtbToken" failed', status: 0 })
    if (unknownLink) return r({ result: 'error', statusText: 'unsupportedLink', status: 0 })

    const status = echoLog({ type: follow ? 'followYtbChannel' : 'unfollowYtbChannel', text: channelId })
    const nowTime = parseInt(new Date().getTime() / 1000)
    httpRequest({
      url: `https://www.youtube.com/youtubei/v1/subscription/${follow ? '' : 'un'}subscribe?key=${apiKey}`,
      method: 'POST',
      headers: {
        origin: 'https://www.youtube.com',
        referer: 'https://www.youtube.com/channel/' + channelId,
        'content-type': 'application/json',
        'x-goog-authuser': 0,
        'x-goog-visitor-id': client.visitorData,
        'x-origin': 'https://www.youtube.com',
        authorization: `SAPISIDHASH ${nowTime}_${sha1(`${nowTime} ${youtubeInfo.PAPISID} https://www.youtube.com`)}`
      },
      data: JSON.stringify({
        context: {
          client: client,
          request: {
            sessionId: request.sessionId,
            internalExperimentFlags: [],
            consistencyTokenJars: []
          },
          user: {}
        },
        channelIds: [channelId],
        params: follow ? 'EgIIAhgA' : 'CgIIAhgA'
      }),
      onload (response) {
        if (debug) console.log(response)
        if (response.status === 200) {
          if ((follow && /"subscribed": true/.test(response.responseText)) || (!follow && /"subscribed": false/.test(response.responseText))) {
            status.success()
            r({ result: 'success', statusText: response.statusText, status: response.status })
          } else {
            status.error(getI18n('tryUpdateYtbAuth'))
            r({ result: 'error', statusText: response.statusText, status: response.status })
          }
        } else {
          status.error('Error:' + response.statusText + '(' + response.status + ')')
          r({ result: 'error', statusText: response.statusText, status: response.status })
        }
      },
      r,
      status
    })
  } catch (e) {
    throwError(e, 'toggleYtbChannel')
  }
}

function getYtbToken (link) {
  try {
    return new Promise(resolve => {
      if (!/https?:\/\/www\.youtube\.com\/c(hannel)?\/.+/.test(link)) {
        return resolve({ unknownLink: true })
      }
      const status = echoLog({ type: 'getYtbToken' })

      httpRequest({
        url: link,
        method: 'GET',
        onload (response) {
          if (debug) console.log(response)
          if (response.status === 200) {
            if (response.responseText.includes('accounts.google.com/ServiceLogin?service=youtube')) {
              status.error('Error:' + getI18n('loginYtb'), true)
              return resolve({ result: 'error', statusText: response.statusText, status: response.status, needLogin: true })
            }
            const apiKey = response.responseText.match(/"INNERTUBE_API_KEY":"(.*?)"/)?.[1]
            const channelId = response.responseText.match(/<meta itemprop="channelId" content="(.+?)">/)?.[1]
            const context = response.responseText.match(/\(\{"INNERTUBE_CONTEXT":([\w\W]*?)\}\)/)?.[1] || '{}'
            const { client, request } = JSON.parse(context)
            if (apiKey && client && request && channelId) {
              status.success()
              resolve({ result: 'success', statusText: response.statusText, status: response.status, data: { apiKey, client, request, channelId } })
            } else {
              status.error('Error: Parameter "apiKey" not found!')
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
    throwError(e, 'getYtbToken')
  }
}

async function toggleYtbActions ({ website, type, elements, resolve, action, toFinalUrl = {} }) {
  try {
    if (!youtubeInfo.PAPISID) {
      echoLog({ type: 'custom', text: `<li style="color:red;">${getI18n('updateYtbInfo')}</li>` })
      return resolve()
    }
    for (const element of unique(elements)) {
      let link = element
      if (website === 'giveawaysu' && toFinalUrl[element]) {
        link = toFinalUrl[element] || ''
      }
      if (link) {
        await new Promise(resolve => {
          toggleYtbChannel(resolve, link, action === 'fuck')
        })
      }
    }
    resolve()
  } catch (e) {
    throwError(e, 'toggleYtbActions')
  }
}

export { toggleYtbActions, updateYtbInfo }
