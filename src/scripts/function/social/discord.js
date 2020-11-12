import { echoLog } from '../log'
import { httpRequest } from '../httpRequest'
import { unique, throwError, delay } from '../tool'

async function verifyDiscordAuth () {
  try {
    const logStatus = echoLog({ type: 'verifyDiscordAuth' })
    const { result, statusText, status, data } = await httpRequest({
      url: 'https://discord.com/api/v6/users/@me',
      method: 'HEAD',
      headers: { authorization: discordInfo.authorization }
    })
    if (result === 'Success') {
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
    throwError(e, 'verifyDiscordAuth')
    return false
  }
}
async function joinDiscordServer (inviteId) {
  try {
    const logStatus = echoLog({ type: 'joinDiscordServer', text: inviteId })
    const { result, statusText, status, data } = await httpRequest({
      url: 'https://discord.com/api/v6/invites/' + inviteId,
      method: 'POST',
      dataType: 'json',
      headers: { authorization: discordInfo.authorization }
    })
    if (result === 'Success' && data.status === 200) {
      logStatus.success()
      return { result, statusText: data.statusText, status: data.status, guild: [inviteId, data.response?.guild?.id] }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
      return { result, statusText: data?.statusText || statusText, status: data?.status || status }
    }
  } catch (e) {
    throwError(e, 'joinDiscordServer')
  }
}

async function leaveDiscordServer (inviteId, guild) {
  try {
    if (whiteList.discord.server.includes(inviteId)) {
      return { result: 'Skiped', statusText: 'OK', status: 605 }
    }
    const logStatus = echoLog({ type: 'leaveDiscordServer', text: inviteId })
    const { result, statusText, status, data } = await httpRequest({
      url: 'https://discord.com/api/v6/users/@me/guilds/' + guild,
      method: 'DELETE',
      headers: { authorization: discordInfo.authorization }
    })
    if (result === 'Success' && data.status === 204) {
      logStatus.success()
      return { result, statusText: data.statusText, status: data.status }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
      return { result, statusText: data?.statusText || statusText, status: data?.status || status }
    }
  } catch (e) {
    throwError(e, 'leaveDiscordServer')
  }
}
async function toggleDiscordActions ({ website, elements, action, toFinalUrl = {}, toGuild = {} }) {
  try {
    if (new Date().getTime() - discordInfo.updateTime > 10 * 60 * 1000 || discordInfo.expired) {
      const verifyResult = await verifyDiscordAuth()
      if (verifyResult) {
        discordInfo.updateTime = new Date().getTime()
        discordInfo.expired = false
        GM_setValue('discordInfo', discordInfo)
      } else {
        echoLog({ type: 'updateDiscordAuth' })
        return
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
        const guild = toGuild[inviteId]
        if (action === 'fuck') {
          pro.push(joinDiscordServer(inviteId))
        } else if (guild) {
          pro.push(leaveDiscordServer(inviteId, guild))
        }
      }
      await delay(1000)
    }
    return Promise.all(pro)
  } catch (e) {
    throwError(e, 'toggleDiscordActions')
  }
}

export { toggleDiscordActions }
