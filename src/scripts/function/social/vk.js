import { debug } from '../../config'
import { echoLog } from '../log'
import { httpRequest } from '../httpRequest'
import { unique, throwError } from '../tool'
import { getI18n } from '../../i18n'

function verifyVkLogin () {
  try {
    return new Promise(resolve => {
      const status = echoLog({ type: 'verifyVkLogin' })
      httpRequest({
        url: 'https://vk.com/im',
        method: 'GET',
        onload (response) {
          if (debug) console.log(response)
          if (response.finalUrl.includes('vk.com/login')) {
            status.error('Error:' + getI18n('loginVk'), true)
            resolve({ result: 'error', statusText: response.statusText, status: response.status })
          } else if (response.status === 200) {
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
    }).then(({ result }) => {
      return result === 'success'
    }).catch(() => {
      return false
    })
  } catch (e) {
    throwError(e, 'verifyVkLogin')
  }
}
async function toggleVk (r, name, join = true) {
  try {
    const { data } = await getVkId(name)
    if (!data) return
    switch (data.type) {
      case 'group':
        toggleVkGroup(r, name, data, join)
        break
      case 'public':
        toggleVkPublic(r, name, data, join)
    }
  } catch (e) {
    throwError(e, 'toggleVk')
  }
}
function toggleVkGroup (r, name, data, join = true) {
  try {
    const status = echoLog({ type: join ? 'joinVkGroup' : 'leaveVkGroup', text: name })
    if ((data.groupAct === 'enter' && !join) || (data.groupAct === 'leave' && join)) {
      status.success()
      r({ result: 'success' })
    }
    const reqData = {
      act: join ? 'enter' : 'leave',
      al: 1,
      gid: data.groupId,
      hash: data.groupHash
    }
    if (join) reqData.context = '_'
    httpRequest({
      url: 'https://vk.com/al_groups.php',
      method: 'POST',
      headers: {
        origin: 'https://vk.com',
        referer: 'https://vk.com/' + name,
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: $.param(reqData),
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
    throwError(e, 'toggleVkGroup')
  }
}

function toggleVkPublic (r, name, data, join = true) {
  try {
    const status = echoLog({ type: join ? 'joinVkPublic' : 'leaveVkPublic', text: name })
    if ((data.publicJoined && join) || (!data.publicJoined && !join)) {
      status.success()
      r({ result: 'success' })
    }

    httpRequest({
      url: 'https://vk.com/al_public.php',
      method: 'POST',
      headers: {
        origin: 'https://vk.com',
        referer: 'https://vk.com/' + name,
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: $.param({
        act: join ? 'a_enter' : 'a_leave',
        al: 1,
        pid: data.publicPid,
        hash: data.publicHash
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
    throwError(e, 'toggleVkPublic')
  }
}

function getVkId (name) {
  try {
    return new Promise(resolve => {
      const status = echoLog({ type: 'getVkId', text: name })

      httpRequest({
        url: 'https://vk.com/' + name,
        method: 'GET',
        onload (response) {
          if (debug) console.log(response)
          if (response.status === 200) {
            const [, groupAct, groupId, groupHash] = response.responseText.match(/Groups.(enter|leave)\(.*?,.*?([\d]+?), '(.*?)'/) || []
            const publicHash = response.responseText.match(/"enterHash":"(.*?)"/)?.[1]
            const publicPid = response.responseText.match(/"public_id":([\d]+?),/)?.[1]
            const publicJoined = !response.responseText.includes('Public.subscribe')
            if (groupAct && groupId && groupHash) {
              status.success()
              resolve({ result: 'success', statusText: response.statusText, status: response.status, data: { groupAct, groupId, groupHash, type: 'group' } })
            } else if (publicHash && publicPid) {
              status.success()
              resolve({ result: 'success', statusText: response.statusText, status: response.status, data: { publicHash, publicPid, publicJoined, type: 'public' } })
            } else {
              status.error('Error: Parameter "id" not found!')
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
    throwError(e, 'getVkId')
  }
}

async function toggleVkActions ({ website, type, elements, resolve, action, toFinalUrl = {} }) {
  try {
    const isLogin = await verifyVkLogin()
    if (!isLogin) {
      return resolve()
    }
    for (const element of unique(elements)) {
      let name = element
      if (website === 'giveawaysu' && toFinalUrl[element]) {
        const toFinalUrlElement = toFinalUrl[element] || ''
        name = toFinalUrlElement.match(/https:\/\/vk.com\/([^/]+)/)?.[1]
      }
      if (name) {
        await new Promise(resolve => {
          toggleVk(resolve, name, action === 'fuck')
        })
      }
    }
    resolve()
  } catch (e) {
    throwError(e, 'toggleVkActions')
  }
}
export { toggleVkActions }
