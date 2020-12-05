import { echoLog } from '../log'
import { httpRequest } from '../httpRequest'
import { unique, throwError, delay } from '../tool'
import { getI18n } from '../../i18n'

async function getInsInfo (name) {
  try {
    const logStatus = echoLog({ type: 'getInsInfo', text: name })
    const { result, statusText, status, data } = await httpRequest({
      url: `https://www.instagram.com/${name}/`,
      method: 'GET'
    })
    if (result === 'Success') {
      if (data.finalUrl.includes('accounts/login')) {
        logStatus.error('Error:' + getI18n('loginIns'), true)
        return null
      } else if (data.finalUrl.includes('www.instagram.com/challenge')) {
        logStatus.error('Error:' + getI18n('insBanned'))
        return null
      }
      if (data.status === 200) {
        const _data = data.responseText?.match(/window._sharedData[\s]*=[\s]*?(\{[\w\W]*?\});/)?.[1]
        if (_data) {
          const data = JSON.parse(_data)
          insInfo.csrftoken = data?.config?.csrf_token // eslint-disable-line camelcase
          insInfo.hash = data?.rollout_hash // eslint-disable-line camelcase
          const id = data?.entry_data?.ProfilePage?.[0]?.graphql?.user?.id // eslint-disable-line camelcase
          if (id) logStatus.success()
          return id
        } else {
          logStatus.error('Error: Get ins data error!')
          return null
        }
      } else {
        logStatus.error(`${result}:${statusText}(${status})`)
        return null
      }
    }
  } catch (e) {
    throwError(e, 'getInsInfo')
    return null
  }
}

async function followIns (name) {
  try {
    const id = await getInsInfo(name)
    if (!id) return
    const logStatus = echoLog({ type: 'followIns', text: name })
    const { result, statusText, status, data } = await httpRequest({
      url: `https://www.instagram.com/web/friendships/${id}/follow/`,
      method: 'POST',
      dataType: 'json',
      headers: {
        'x-csrftoken': insInfo.csrftoken,
        origin: 'https://www.instagram.com',
        referer: `https://www.instagram.com/${name}/`,
        'content-type': 'application/x-www-form-urlencoded',
        'sec-fetch-site': 'same-origin',
        'x-instagram-ajax': insInfo.hash
      }
    })
    if (result === 'Success') {
      if (data.status === 200 && data.response?.result === 'following') {
        logStatus.success()
      } else {
        logStatus.error('Error:' + (data.response?.feedback_message || (data.statusText + '(' + data.status + ')'))) // eslint-disable-line camelcase
      }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
    }
  } catch (e) {
    throwError(e, 'followIns')
  }
}

async function unfollowIns (name) {
  try {
    if (whiteList.enable && whiteList.instagram.user.includes(name)) {
      return { result: 'Skiped', statusText: 'OK', status: 605 }
    }
    const id = await getInsInfo(name)
    if (!id) return
    const logStatus = echoLog({ type: 'unfollowIns', text: name })
    const { result, statusText, status, data } = await httpRequest({
      url: `https://www.instagram.com/web/friendships/${id}/unfollow/`,
      method: 'POST',
      dataType: 'json',
      headers: {
        'x-csrftoken': insInfo.csrftoken,
        origin: 'https://www.instagram.com',
        referer: `https://www.instagram.com/${name}/`,
        'content-type': 'application/x-www-form-urlencoded',
        'sec-fetch-site': 'same-origin',
        'x-instagram-ajax': insInfo.hash
      }
    })
    if (result === 'Success') {
      if (data.status === 200 && data.response?.status === 'ok') {
        logStatus.success()
      } else {
        logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
      }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
    }
  } catch (e) {
    throwError(e, 'unfollowIns')
  }
}

async function toggleInsActions ({ website, elements, action, toFinalUrl = {} }) {
  try {
    const pro = []
    for (const element of unique(elements)) {
      let name = element
      if (website === 'giveawaysu' && toFinalUrl[element]) {
        const toFinalUrlElement = toFinalUrl[element] || ''
        name = toFinalUrlElement.match(/https:\/\/www\.instagram\.com\/(.+)?\//)?.[1]
      }
      if (name) {
        if (action === 'fuck') {
          pro.push(followIns(name))
        } else {
          pro.push(unfollowIns(name))
        }
      }
      await delay(1000)
    }
    return Promise.all(pro)
  } catch (e) {
    throwError(e, 'toggleInsActions')
  }
}

export { toggleInsActions }
