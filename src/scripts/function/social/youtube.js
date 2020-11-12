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
    throwError(e, 'updateYtbInfo')
    if (notice) {
      Swal.fire({
        title: getI18n('updateYtbInfoError'),
        icon: 'error'
      })
    }
  }
}

async function toggleYtbChannel (link, follow = true) {
  try {
    const { params, unknownLink, needLogin } = await getYtbToken(link, 'channel')
    const { apiKey, client, request, channelId } = params || {}

    if (whiteList.enable && !follow && whiteList.youtube.channel.includes(channelId)) {
      return { result: 'Skiped', statusText: 'OK', status: 605 }
    }

    if (needLogin) return echoLog({ type: 'custom', text: getI18n('loginYtb') })
    if (unknownLink) return echoLog({ type: 'custom', text: getI18n('unsupportedLink') })
    if (!apiKey) return echoLog({ type: 'custom', text: '"getYtbToken" failed' })

    const logStatus = echoLog({ type: follow ? 'followYtbChannel' : 'unfollowYtbChannel', text: channelId })
    const nowTime = parseInt(new Date().getTime() / 1000)
    const { result, statusText, status, data } = await httpRequest({
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
      })
    })
    if (result === 'Success') {
      if (data.status === 200) {
        if ((follow && (/"subscribed": true/.test(data.responseText) || data.responseText.includes('The subscription already exists'))) || (!follow && /"subscribed": false/.test(data.responseText))) {
          logStatus.success()
        } else {
          logStatus.error(getI18n('tryUpdateYtbAuth'), true)
        }
      } else {
        logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
      }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
    }
  } catch (e) {
    throwError(e, 'toggleYtbChannel')
  }
}

async function toggleLikeYtbVideo (link, like = true) {
  try {
    const { params, unknownLink, needLogin } = await getYtbToken(link, 'likeVideo')
    const { apiKey, client, request, videoId, likeParams } = params || {}

    if (whiteList.enable && !link && whiteList.youtube.video.includes(videoId)) {
      return { result: 'Skiped', statusText: 'OK', status: 605 }
    }

    if (needLogin) return echoLog({ type: 'custom', text: `<li>${getI18n('loginYtb')}</li>` })
    if (unknownLink) return echoLog({ type: 'custom', text: `<li>${getI18n('unsupportedLink')}</li>` })
    if (!apiKey) return echoLog({ type: 'custom', text: '<li>"getYtbToken" failed</li>' })

    const logStatus = echoLog({ type: like ? 'likeYtbVideo' : 'unlikeYtbVideo', text: videoId })
    const nowTime = parseInt(new Date().getTime() / 1000)
    const likeVideoData = {
      context: {
        client: client,
        request: {
          sessionId: request.sessionId,
          internalExperimentFlags: [],
          consistencyTokenJars: []
        },
        user: {}
      },
      target: {
        videoId: videoId
      }
    }
    if (like) {
      if (likeParams) {
        likeVideoData.params = likeParams
      } else {
        return logStatus.error('Empty likeParams')
      }
    }
    const { result, statusText, status, data } = await httpRequest({
      url: `https://www.youtube.com/youtubei/v1/like/${like ? '' : 'remove'}like?key=${apiKey}`,
      method: 'POST',
      headers: {
        origin: 'https://www.youtube.com',
        referer: 'https://www.youtube.com/watch?v=' + videoId,
        'content-type': 'application/json',
        'x-goog-authuser': 0,
        'x-goog-visitor-id': client.visitorData,
        'x-origin': 'https://www.youtube.com',
        authorization: `SAPISIDHASH ${nowTime}_${sha1(`${nowTime} ${youtubeInfo.PAPISID} https://www.youtube.com`)}`
      },
      data: JSON.stringify(likeVideoData)
    })
    if (result === 'Success') {
      if (data.status === 200) {
        if ((like && data.responseText.includes('Added to Liked videos')) || (!like && (data.responseText.includes('Removed from Liked videos') || data.responseText.includes('Dislike removed')))) {
          logStatus.success()
        } else {
          logStatus.error(getI18n('tryUpdateYtbAuth'), true)
        }
      } else {
        logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
      }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
    }
  } catch (e) {
    throwError(e, 'toggleYtbChannel')
  }
}

async function getYtbToken (link, type) {
  try {
    const logStatus = echoLog({ type: 'getYtbToken' })
    const { result, statusText, status, data } = await httpRequest({
      url: link,
      method: 'GET'
    })
    if (result === 'Success') {
      if (data.status === 200) {
        if (data.responseText.includes('accounts.google.com/ServiceLogin?service=youtube')) {
          logStatus.error('Error:' + getI18n('loginYtb'), true)
          return { needLogin: true }
        }
        const apiKey = data.responseText.match(/"INNERTUBE_API_KEY":"(.*?)"/)?.[1]
        const context = data.responseText.match(/\(\{"INNERTUBE_CONTEXT":([\w\W]*?)\}\)/)?.[1] || '{}'
        const { client, request } = JSON.parse(context)
        if (apiKey && client && request) {
          client.hl = 'en'
          if (type === 'channel') {
            const channelId = data.responseText.match(/<meta itemprop="channelId" content="(.+?)">/)?.[1]
            if (channelId) {
              logStatus.success()
              return { params: { apiKey, client, request, channelId } }
            } else {
              logStatus.error('Error: Get "channelId" failed!')
              return {}
            }
          } else if (type === 'likeVideo') {
            const videoId = data.responseText.match(/<link rel="shortlink" href="https:\/\/youtu\.be\/(.*?)">/)?.[1]
            const likeParams = data.responseText.match(/"likeParams":"(.*?)"/)?.[1]
            if (videoId) {
              logStatus.success()
              return { params: { apiKey, client, request, videoId, likeParams } }
            } else {
              logStatus.error('Error: Get "videoId" failed!')
              return {}
            }
          } else {
            logStatus.error('Error: Unknown type')
            return {}
          }
        } else {
          logStatus.error('Error: Parameter "apiKey" not found!')
          return {}
        }
      } else {
        logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
        return {}
      }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
      return {}
    }
  } catch (e) {
    throwError(e, 'getYtbToken')
  }
}

async function toggleYtbActions ({ website, type, elements, action, toFinalUrl = {} }) {
  try {
    if (!youtubeInfo.PAPISID) {
      return echoLog({ type: 'custom', text: `<li style="color:red;">${getI18n('updateYtbInfo')}</li>` })
    }
    for (const element of unique(elements)) {
      let link = element
      if (website === 'giveawaysu' && toFinalUrl[element]) {
        link = toFinalUrl[element] || ''
      }
      if (link) {
        switch (type) {
          case 'channel':
            await toggleYtbChannel(link, action === 'fuck')
            break
          case 'video':
            await toggleLikeYtbVideo(link, action === 'fuck')
            break
        }
      }
    }
  } catch (e) {
    throwError(e, 'toggleYtbActions')
  }
}

export { toggleYtbActions, updateYtbInfo }
