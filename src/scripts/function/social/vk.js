import { echoLog } from '../log'
import { httpRequest } from '../httpRequest'
import { unique, throwError } from '../tool'
import { getI18n } from '../../i18n'

async function verifyVkLogin () {
  try {
    const logStatus = echoLog({ type: 'verifyVkLogin' })
    const { result, statusText, status, data } = await httpRequest({
      url: 'https://vk.com/im',
      method: 'GET'
    })
    if (result === 'Success') {
      if (data.finalUrl.includes('vk.com/login')) {
        logStatus.error('Error:' + getI18n('loginVk'), true)
        return false
      }
      if (data.status === 200) {
        logStatus.success()
        return true
      } else {
        logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
        return false
      }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
      return false
    }
  } catch (e) {
    throwError(e, 'verifyVkLogin')
  }
}
async function toggleVk (name, join = true) {
  try {
    if (!join && whiteList.vk.vk.includes(name)) {
      return { result: 'Skiped', statusText: 'OK', status: 605 }
    }
    const data = await getVkId(name)
    if (!data) return
    switch (data.type) {
      case 'group':
        await toggleVkGroup(name, data, join)
        break
      case 'public':
        await toggleVkPublic(name, data, join)
        break
      case 'wall':
        await toggleVkWall(name, join)
        break
    }
  } catch (e) {
    throwError(e, 'toggleVk')
  }
}
async function toggleVkWall (name, join) {
  const logStatus = echoLog({ type: 'repostVkWall', text: name })
  const { result, statusText, status, data } = await httpRequest({
    url: 'https://vk.com/like.php',
    method: 'POST',
    headers: {
      origin: 'https://vk.com',
      referer: 'https://vk.com/' + name,
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: $.param({
      act: 'publish_box',
      al: 1,
      object: name
    })
  })
  if (result === 'Success') {
    if (data.status === 200) {
      const hash = data.responseText.match(/shHash:[\s]*'(.*?)'/)?.[1]
      if (hash) {
        const { result: resultR, statusText: statusTextR, status: statusR, data: dataR } = await httpRequest({
          url: 'https://vk.com/like.php',
          method: 'POST',
          headers: {
            origin: 'https://vk.com',
            referer: 'https://vk.com/' + name,
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: $.param({
            Message: '',
            act: 'a_do_publish',
            al: 1,
            close_comments: 0,
            friends_only: 0,
            from: 'box',
            hash: hash,
            list: '',
            mark_as_ads: 0,
            mute_notifications: 0,
            object: name,
            ret_data: 1,
            to: 0
          })
        })
        if (resultR === 'Success') {
          if (dataR.status === 200) {
            const jsonData = JSON.parse(dataR.responseText?.replace('<!--', '') || '{}')
            if (jsonData?.payload?.[1]?.[1]?.share_my === true) { // eslint-disable-line camelcase
              logStatus.success()
            } else {
              logStatus.error('Error:' + dataR.statusText + '(' + dataR.status + ')')
            }
          } else {
            logStatus.error('Error:' + dataR.statusText + '(' + dataR.status + ')')
          }
        } else {
          logStatus.error(`${resultR}:${statusTextR}(${statusR})`)
        }
      } else {
        logStatus.error('Error: Get "hash" failed')
      }
    } else {
      logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
    }
  } else {
    logStatus.error(`${result}:${statusText}(${status})`)
  }
}
async function toggleVkGroup (name, dataParam, join = true) {
  try {
    const logStatus = echoLog({ type: join ? 'joinVkGroup' : 'leaveVkGroup', text: name })
    if ((dataParam.groupAct === 'enter' && !join) || (dataParam.groupAct === 'leave' && join)) {
      return logStatus.success()
    }
    const reqData = {
      act: join ? 'enter' : 'leave',
      al: 1,
      gid: dataParam.groupId,
      hash: dataParam.groupHash
    }
    if (join) reqData.context = '_'
    const { result, statusText, status, data } = await httpRequest({
      url: 'https://vk.com/al_groups.php',
      method: 'POST',
      headers: {
        origin: 'https://vk.com',
        referer: 'https://vk.com/' + name,
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: $.param(reqData)
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
    throwError(e, 'toggleVkGroup')
  }
}

async function toggleVkPublic (name, dataParam, join = true) {
  try {
    const logStatus = echoLog({ type: join ? 'joinVkPublic' : 'leaveVkPublic', text: name })
    if ((dataParam.publicJoined && join) || (!dataParam.publicJoined && !join)) {
      return logStatus.success()
    }
    const { result, statusText, status, data } = await httpRequest({
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
        pid: dataParam.publicPid,
        hash: dataParam.publicHash
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
    throwError(e, 'toggleVkPublic')
  }
}

async function getVkId (name) {
  try {
    if (/^wall-/.test(name)) return { type: 'wall' }
    const logStatus = echoLog({ type: 'getVkId', text: name })
    const { result, statusText, status, data } = await httpRequest({
      url: 'https://vk.com/' + name,
      method: 'GET'
    })
    if (result === 'Success') {
      if (data.status === 200) {
        const [, groupAct, groupId, groupHash] = data.responseText.match(/Groups.(enter|leave)\(.*?,.*?([\d]+?), '(.*?)'/) || []
        const publicHash = data.responseText.match(/"enterHash":"(.*?)"/)?.[1]
        const publicPid = data.responseText.match(/"public_id":([\d]+?),/)?.[1]
        const publicJoined = !data.responseText.includes('Public.subscribe')
        if (groupAct && groupId && groupHash) {
          logStatus.success()
          return { groupAct, groupId, groupHash, type: 'group' }
        } else if (publicHash && publicPid) {
          logStatus.success()
          return { publicHash, publicPid, publicJoined, type: 'public' }
        } else {
          logStatus.error('Error: Parameter "id" not found!')
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
    throwError(e, 'getVkId')
  }
}

async function toggleVkActions ({ website, type, elements, action, toFinalUrl = {} }) {
  try {
    const isLogin = await verifyVkLogin()
    if (!isLogin) return
    for (const element of unique(elements)) {
      let name = element
      if (website === 'giveawaysu' && toFinalUrl[element]) {
        const toFinalUrlElement = toFinalUrl[element] || ''
        name = toFinalUrlElement.match(/https:\/\/vk.com\/([^/]+)/)?.[1]
      }
      if (name) {
        await toggleVk(name, action === 'fuck')
      }
    }
  } catch (e) {
    throwError(e, 'toggleVkActions')
  }
}
export { toggleVkActions }
