import { debug } from '../../config'
import { echoLog } from '../log'
import { httpRequest } from '../httpRequest'
import { unique } from '../tool'

function verifyDiscordAuth (r) {
  const status = echoLog({ type: 'verifyDiscordAuth' })

  httpRequest({
    url: 'https://discord.com/api/v6/users/@me',
    method: 'HEAD',
    headers: { authorization: discordInfo.authorization },
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
}
function joinDiscordServer (r, inviteId) {
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
}

function leaveDiscordServer (r, inviteId, guild) {
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
}
async function toggleDiscordActions ({ website, elements, resolve, action, toFinalUrl = {}, toGuild = {} }) {
  if (new Date().getTime() - discordInfo.updateTime > 10 * 60 * 1000 || discordInfo.expired) {
    const verifyResult = await verifyDiscordAuth()
    if (verifyResult) {
      discordInfo.updateTime = new Date().getTime()
      discordInfo.expired = false
      GM_setValue('discordInfo', discordInfo)
    } else {
      echoLog({ type: 'updateDiscordAuth' })
      resolve({})
      return
    }
  }
  const pro = []
  for (const element of unique(elements)) {
    let inviteId = null
    if (website === 'giveawaysu' && toFinalUrl[element]) {
      const toFinalUrlElement = toFinalUrl[element] || ''
      inviteId = toFinalUrlElement.match(/invite\/(.+)/)?.[1]
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
  }
  Promise.all(pro).then(data => {
    resolve(data)
  }).catch(() => {
    resolve()
  })
}

export { toggleDiscordActions }
