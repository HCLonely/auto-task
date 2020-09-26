import { debug } from '../../config'
import { echoLog } from '../log'
import { httpRequest } from '../httpRequest'
import { unique, throwError } from '../tool'

function verifyDiscordAuth () {
  try {
    const status = echoLog({ type: 'verifyDiscordAuth' })

    return new Promise(resolve => {
      httpRequest({
        url: 'https://discord.com/api/v6/users/@me',
        method: 'HEAD',
        headers: { authorization: discordInfo.authorization },
        onload (response) {
          if (debug) console.log(response)
          if (response.status === 200) {
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
    })
  } catch (e) {
    throwError(e, 'verifyDiscordAuth')
  }
}
function joinDiscordServer (r, inviteId) {
  try {
    const status = echoLog({ type: 'joinDiscordServer', text: inviteId })

    httpRequest({
      url: 'https://discord.com/api/v6/invites/' + inviteId,
      method: 'POST',
      dataType: 'json',
      headers: { authorization: discordInfo.authorization },
      onload (response) {
        if (debug) console.log(response)
        if (response.status === 200) {
          status.success()
          r({ result: 'success', statusText: response.statusText, status: response.status, guild: [inviteId, response.response?.guild?.id] })
        } else {
          status.error('Error:' + response.statusText + '(' + response.status + ')')
          r({ result: 'error', statusText: response.statusText, status: response.status })
        }
      },
      r,
      status
    })
  } catch (e) {
    throwError(e, 'joinDiscordServer')
  }
}

function leaveDiscordServer (r, inviteId, guild) {
  try {
    const status = echoLog({ type: 'leaveDiscordServer', text: inviteId })

    httpRequest({
      url: 'https://discord.com/api/v6/users/@me/guilds/' + guild,
      method: 'DELETE',
      headers: { authorization: discordInfo.authorization },
      onload (response) {
        if (debug) console.log(response)
        if (response.status === 204) {
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
    throwError(e, 'leaveDiscordServer')
  }
}
async function toggleDiscordActions ({ website, elements, resolve, action, toFinalUrl = {}, toGuild = {} }) {
  try {
    if (new Date().getTime() - discordInfo.updateTime > 10 * 60 * 1000 || discordInfo.expired) {
      const verifyResult = await verifyDiscordAuth()
      if (verifyResult) {
        discordInfo.updateTime = new Date().getTime()
        discordInfo.expired = false
        GM_setValue('discordInfo', discordInfo)
      } else {
        echoLog({ type: 'updateDiscordAuth' })
        return resolve({})
      }
    }
    const pro = []
    for (const element of unique(elements)) {
      let inviteId = element
      if (website === 'giveawaysu' && toFinalUrl[element]) {
        const toFinalUrlElement = toFinalUrl[element] || ''
        inviteId = toFinalUrlElement.match(/invite\/(.+)/)?.[1]
      }
      if (inviteId) {
        pro.push(new Promise(resolve => {
          const guild = toGuild[inviteId]
          if (action === 'fuck') {
            joinDiscordServer(resolve, inviteId)
          } else if (guild) {
            leaveDiscordServer(resolve, inviteId, guild)
          } else {
            resolve({})
          }
        }))
      }
    }
    Promise.all(pro).then(data => {
      resolve(data)
    }).catch(() => {
      resolve()
    })
  } catch (e) {
    throwError(e, 'toggleDiscordActions')
  }
}

export { toggleDiscordActions }
