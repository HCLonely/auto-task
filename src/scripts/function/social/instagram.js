import { debug } from '../../config'
import { echoLog } from '../log'
import { httpRequest } from '../httpRequest'
import { unique } from '../tool'

function getInsInfo (name) {
  return new Promise(resolve => {
    const status = echoLog({ type: 'getInsInfo' })

    httpRequest({
      url: `https://www.instagram.com/${name}/`,
      method: 'GET',
      onload (response) {
        if (debug) console.log(response)
        if (response.status === 200) {
          const _data = response.responseText?.match(/window._sharedData[\s]*=[\s]*?(\{[\w\W]*?\});/)?.[1]
          if (_data) {
            const data = JSON.parse(_data)
            // insInfo.updateTime = new Date().getTime()
            insInfo.csrftoken = data?.config?.csrf_token // eslint-disable-line camelcase
            insInfo.hash = data?.config?.rollout_hash // eslint-disable-line camelcase
            // GM_setValue('insInfo', insInfo)
            resolve({ result: 'success', statusText: response.statusText, status: response.status, id: data?.entry_data?.ProfilePage?.[0]?.graphql?.user?.id }) // eslint-disable-line camelcase
          } else {
            status.error('Error: Ins data error!')
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
    return { id: data?.id, error: !data?.id }
  }).catch(error => {
    return { id: null, error }
  })
}

async function followIns (r, name) {
  const { id, error } = await getInsInfo(name)
  if (error) {
    r({ result: 'error', statusText: 'getInsInfo error' })
    return error
  }
  const status = echoLog({ type: 'followIns', text: [name, id] })
  httpRequest({
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
    },
    onload (response) {
      if (debug) console.log(response)
      if (response.status === 200 && response.response?.result === 'following') {
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

async function unfollowIns (r, name) {
  const { id, error } = await getInsInfo(name)
  if (error) {
    r({ result: 'error', statusText: 'getInsInfo error' })
    return error
  }
  const status = echoLog({ type: 'followIns', text: [name, id] })
  httpRequest({
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
    },
    onload (response) {
      if (debug) console.log(response)
      if (response.status === 200 && response.response?.status === 'ok') {
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

async function toggleInsActions ({ website, elements, resolve, action, toFinalUrl = {} }) {
  const pro = []
  for (const element of unique(elements)) {
    let name = null
    if (website === 'giveawaysu' && toFinalUrl[element]) {
      const toFinalUrlElement = toFinalUrl[element] || ''
      name = toFinalUrlElement.match(/https:\/\/www.instagram.com\/(.+)?\//)?.[1]
      if (name) {
        pro.push(new Promise(resolve => {
          if (action === 'fuck') {
            followIns(resolve, name)
          } else {
            unfollowIns(resolve, name)
          }
        }))
      }
    }
  }
  Promise.all(pro).finally(() => {
    resolve()
  })
}

export { toggleInsActions }
