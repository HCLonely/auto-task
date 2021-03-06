import { getI18n } from '../../i18n'
import { echoLog } from '../log'
import { httpRequest } from '../httpRequest'
import { unique, throwError, delay } from '../tool'

// INFO: Update steam info
async function updateSteamCommunityInfo () {
  try {
    const logStatus = echoLog({ type: 'updateSteamCommunity' })
    const { result, statusText, status, data } = await httpRequest({
      url: 'https://steamcommunity.com/my',
      method: 'GET'
    })
    if (result === 'Success') {
      if (data.status === 200) {
        if ($(data.responseText).find('a[href*="/login/home"]').length > 0) {
          logStatus.error('Error:' + getI18n('loginSteamCommunity'), true)
          return false
        } else {
          const steam64Id = data.responseText.match(/g_steamID = "(.+?)";/)?.[1]
          const communitySessionID = data.responseText.match(/g_sessionID = "(.+?)";/)?.[1]
          const userName = data.responseText.match(/steamcommunity.com\/id\/(.+?)\/friends\//)?.[1]
          if (steam64Id) steamInfo.steam64Id = steam64Id
          if (userName) steamInfo.userName = userName
          if (communitySessionID) {
            steamInfo.communitySessionID = communitySessionID
            steamInfo.communityUpdateTime = new Date().getTime()
            logStatus.success()
            return true
          } else {
            logStatus.error('Error: Get "sessionID" failed')
            return false
          }
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
    throwError(e, 'updateSteamCommunityInfo')
  }
}
async function updateSteamStoreInfo () {
  try {
    const logStatus = echoLog({ type: 'updateSteamStore' })
    const { result, statusText, status, data } = await httpRequest({
      url: 'https://store.steampowered.com/stats/',
      method: 'GET'
    })
    if (result === 'Success') {
      if (data.status === 200) {
        if ($(data.responseText).find('a[href*="/login/"]').length > 0) {
          logStatus.error('Error:' + getI18n('loginSteamStore'), true)
          return false
        } else {
          const storeSessionID = data.responseText.match(/g_sessionID = "(.+?)";/)?.[1]
          if (storeSessionID) {
            steamInfo.storeSessionID = storeSessionID
            steamInfo.storeUpdateTime = new Date().getTime()
            logStatus.success()
            return true
          } else {
            logStatus.error('Error: Get "sessionID" failed')
            return false
          }
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
    throwError(e, 'updateSteamStoreInfo')
  }
}
function updateSteamInfo (type = 'all', update = false) {
  try {
    const pro = []
    if ((new Date().getTime() - steamInfo.communityUpdateTime > 10 * 60 * 1000 || update) && (type === 'community' || type === 'all')) {
      pro.push(updateSteamCommunityInfo())
    }
    if ((new Date().getTime() - steamInfo.storeUpdateTime > 10 * 60 * 1000 || update) && (type === 'store' || type === 'all')) {
      pro.push(updateSteamStoreInfo())
    }
    return Promise.all(pro).then(data => {
      GM_setValue('steamInfo', steamInfo)
      const length = data.length
      if (length === 1) {
        return data[0]
      } else if (length === 2) {
        return data[0] && data[1]
      } else {
        return false
      }
    }).catch(() => {
      return false
    })
  } catch (e) {
    throwError(e, 'updateSteamInfo')
  }
}

// INFO:steam country
async function getCountryInfo () {
  try {
    const logStatus = echoLog({ type: 'text', text: 'getCountryInfo' })
    const { result, statusText, status, data } = await httpRequest({
      url: 'https://store.steampowered.com/cart/',
      method: 'Get'
    })
    if (result === 'Success') {
      if (data.status === 200) {
        const userCountryCurrency = data.responseText.match(/<input id="usercountrycurrency".*?value="(.+?)"/)?.[1]
        const country = [...data.responseText.matchAll(/<div class="currency_change_option .*?" data-country="(.+?)" >/g)].map(e => e[1])
        if (userCountryCurrency && country.length > 0) {
          logStatus.success()
          return { userCountryCurrency, country }
        } else {
          logStatus.error('Error: get country info filed')
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
    throwError(e, 'getCountryInfo')
  }
}
async function changeCountry (cc) {
  try {
    if (!cc) {
      const { userCountryCurrency, country } = await getCountryInfo()
      if (!userCountryCurrency || !country) return
      if (userCountryCurrency !== 'CN') return echoLog({ type: 'text', text: 'notNeedChangeCountry' })
      const anotherCountry = country.filter(e => e && e !== 'CN')
      if (!anotherCountry || anotherCountry.length === 0) return echoLog({ type: 'text', text: 'noAnotherCountry' })
      cc = anotherCountry[0]
    }
    const logStatus = echoLog({ type: 'changeCountry', text: cc })
    const { result, statusText, status, data } = await httpRequest({
      url: 'https://store.steampowered.com/account/setcountry',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      data: $.param({ cc, sessionid: steamInfo.storeSessionID })
    })
    if (result === 'Success') {
      if (data.status === 200 && data.responseText === 'true') {
        const { userCountryCurrency } = await getCountryInfo()
        if (userCountryCurrency === cc) {
          logStatus.success()
          return userCountryCurrency
        } else {
          logStatus.error('Error: change country filed')
          return 'CN'
        }
      } else {
        logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
        return 'CN'
      }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
      return 'CN'
    }
  } catch (e) {
    throwError(e, 'changeCountry')
  }
}

// INFO: Steam group
async function joinSteamGroup (group) {
  try {
    const logStatus = echoLog({ type: 'joinSteamGroup', text: group })
    const { result, statusText, status, data } = await httpRequest({
      url: 'https://steamcommunity.com/groups/' + group,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      data: $.param({ action: 'join', sessionID: steamInfo.communitySessionID })
    })
    if (result === 'Success') {
      if (data.status === 200 && !data.responseText.includes('grouppage_join_area')) {
        logStatus.success()
      } else {
        logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
      }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
    }
  } catch (e) {
    throwError(e, 'joinSteamGroup')
  }
}
async function getGroupID (groupName) {
  try {
    const logStatus = echoLog({ type: 'getSteamGroupId', text: groupName })
    const groupNameToId = GM_getValue('groupNameToId') || {}
    if (groupNameToId[groupName]) {
      logStatus.success()
      return groupNameToId[groupName]
    } else {
      const { result, statusText, status, data } = await httpRequest({
        url: 'https://steamcommunity.com/groups/' + groupName,
        method: 'GET',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
      })
      if (result === 'Success') {
        if (data.status === 200) {
          const groupId = data.responseText.match(/OpenGroupChat\( '([0-9]+)'/)?.[1]
          if (groupId) {
            logStatus.success()
            groupNameToId[groupName] = groupId
            GM_setValue('groupNameToId', groupNameToId)
            return groupId
          } else {
            logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
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
    }
  } catch (e) {
    throwError(e, 'getGroupID')
  }
}
async function leaveSteamGroup (groupName) {
  try {
    if (whiteList.enable && whiteList.steam.group.includes(groupName)) {
      return { result: 'Skiped', statusText: 'OK', status: 605 }
    }
    const groupId = await getGroupID(groupName)
    if (!groupId) return
    const logStatus = echoLog({ type: 'leaveSteamGroup', text: groupName })
    const { result, statusText, status, data } = await httpRequest({
      url: 'https://steamcommunity.com/id/' + steamInfo.userName + '/home_process',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      data: $.param({ sessionID: steamInfo.communitySessionID, action: 'leaveGroup', groupId: groupId })
    })
    if (result === 'Success') {
      if (data.status === 200 && data.finalUrl.includes('groups') && $(data.responseText.toLowerCase()).find(`a[href='https://steamcommunity.com/groups/${groupName.toLowerCase()}']`).length === 0) {
        logStatus.success()
      } else {
        logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
      }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
    }
  } catch (e) {
    throwError(e, 'leaveSteamGroup')
  }
}

// INFO: Steam workshop
async function toggleFavoriteWorkshop (id, favorite = true) {
  try {
    const appid = await getWorkshopAppId(id)
    if (!appid) return
    const logStatus = echoLog({ type: favorite ? 'favoriteWorkshop' : 'unfavoriteWorkshop', text: id })
    const { result, statusText, status, data } = await httpRequest({
      url: `https://steamcommunity.com/sharedfiles/${favorite ? '' : 'un'}favorite`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: $.param({ id, appid, sessionid: steamInfo.communitySessionID })
    })
    if (result === 'Success') {
      if (data.status === 200 && !data.responseText) {
        logStatus.success()
      } else {
        logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
      }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
    }
  } catch (e) {
    throwError(e, 'toggleFavoriteWorkshop')
  }
}
async function getWorkshopAppId (id) {
  try {
    const logStatus = echoLog({ type: 'getWorkshopAppId', text: id })
    const { result, statusText, status, data } = await httpRequest({
      url: `https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`,
      method: 'GET'
    })
    if (result === 'Success') {
      if (data.status === 200) {
        const appid = data.responseText.match(/<input type="hidden" name="appid" value="([\d]+?)" \/>/)?.[1]
        if (appid) {
          logStatus.success()
        } else {
          logStatus.error('Error: getWorkshopAppId failed')
        }
        return appid
      } else {
        logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
        return false
      }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
      return false
    }
  } catch (e) {
    throwError(e, 'getWorkshopAppId')
    return false
  }
}
async function voteupWorkshop (id) {
  try {
    const logStatus = echoLog({ type: 'voteupWorkshop', text: id })
    const { result, statusText, status, data } = await httpRequest({
      url: 'https://steamcommunity.com/sharedfiles/voteup',
      method: 'POST',
      responseType: 'json',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: $.param({ id, sessionid: steamInfo.communitySessionID })
    })
    if (result === 'Success') {
      if (data.status === 200 && data.response?.success === 1) {
        logStatus.success()
      } else {
        logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
      }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
    }
  } catch (e) {
    throwError(e, 'voteupWorkshop')
  }
}

// INFO: Steam curator
async function toggleCurator (curatorId, follow = true, logStatus = null) {
  try {
    if (whiteList.enable && !follow && whiteList.steam.curator.includes(curatorId)) {
      return { result: 'Skiped', statusText: 'OK', status: 605 }
    }
    logStatus = logStatus || echoLog({ type: follow ? 'followCurator' : 'unfollowCurator', text: curatorId })
    const { result, statusText, status, data } = await httpRequest({
      url: 'https://store.steampowered.com/curators/ajaxfollow',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      data: $.param({ clanid: curatorId, sessionid: steamInfo.storeSessionID, follow: follow }),
      dataType: 'json'
    })
    if (result === 'Success') {
      if (data.status === 200 && data.response?.success?.success === 1) {
        logStatus.success()
      } else {
        logStatus.error('Error:' + data.statusText + '(' + data.response?.success || data.status + ')')
      }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
    }
  } catch (e) {
    throwError(e, 'toggleCurator')
  }
}
async function getCuratorID (developerName, path) {
  try {
    const logStatus = echoLog({ type: 'getCuratorId', text: `${path}/${developerName}` })
    const developerNameToId = GM_getValue('developerNameToId') || {}
    if (developerNameToId[developerName]) {
      logStatus.success()
      return developerNameToId[developerName]
    } else {
      const { result, statusText, status, data } = await httpRequest({
        url: `https://store.steampowered.com/${path}/${developerName}`,
        method: 'GET',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
      })
      if (result === 'Success') {
        if (data.status === 200) {
          const developerId = data.responseText.match(/g_pagingData.*?"clanid":([\d]+)/)?.[1]
          if (developerId) {
            logStatus.success()
            developerNameToId[developerName] = developerId
            GM_setValue('developerNameToId', developerNameToId)
            return developerId
          } else {
            logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
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
    }
  } catch (e) {
    throwError(e, 'getCuratorID')
  }
}
async function toggleOtherCurator (name, path, follow = true) {
  try {
    if (whiteList.enable && !follow && whiteList.steam.otherCurator.includes(name)) {
      return { result: 'Skiped', statusText: 'OK', status: 605 }
    }
    const curatorId = await getCuratorID(name, path)
    if (curatorId) {
      const logStatus = echoLog({ type: `${follow ? '' : 'un'}follow${path.replace(/^\S/, s => s.toUpperCase())}`, text: name })
      toggleCurator(curatorId, follow, logStatus)
    }
  } catch (e) {
    throwError(e, 'toggleOtherCurator')
  }
}

// INFO: Steam wishlist
async function addWishlist (gameId) {
  try {
    const logStatus = echoLog({ type: 'addWishlist', text: gameId })
    const { result, data } = await httpRequest({
      url: 'https://store.steampowered.com/api/addtowishlist',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      data: $.param({ sessionid: steamInfo.storeSessionID, appid: gameId }),
      dataType: 'json'
    })
    if (result === 'Success' && data.status === 200 && data.response?.success === true) {
      return logStatus.success()
    }
    const { result: resultR, statusText: statusTextR, status: statusR, data: dataR } = await httpRequest({
      url: 'https://store.steampowered.com/app/' + gameId,
      method: 'GET'
    })
    if (resultR === 'Success') {
      if (dataR.status === 200) {
        if (dataR.responseText.includes('class="queue_actions_ctn"') && dataR.responseText.includes('class="already_in_library"')) {
          logStatus.success()
        } else if ((dataR.responseText.includes('class="queue_actions_ctn"') && dataR.responseText.includes('id="add_to_wishlist_area_success" style="display: none;')) || !dataR.responseText.includes('class="queue_actions_ctn"')) {
          logStatus.error('Error:' + dataR.statusText + '(' + dataR.status + ')')
        } else {
          logStatus.success()
        }
      } else {
        logStatus.error('Error:' + dataR.statusText + '(' + dataR.status + ')')
      }
    } else {
      logStatus.error(`${resultR}:${statusTextR}(${statusR})`)
    }
  } catch (e) {
    throwError(e, 'addWishlist')
  }
}
async function removeWishlist (gameId) {
  try {
    if (whiteList.enable && whiteList.steam.wishlist.includes(gameId)) {
      return { result: 'Skiped', statusText: 'OK', status: 605 }
    }
    const logStatus = echoLog({ type: 'removeWishlist', text: gameId })
    const { result, data } = await httpRequest({
      url: 'https://store.steampowered.com/api/removefromwishlist',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      data: $.param({ sessionid: steamInfo.storeSessionID, appid: gameId }),
      dataType: 'json'
    })
    if (result === 'Success' && data.status === 200 && data.response?.success === true) {
      return logStatus.success()
    }
    const { result: resultR, statusText: statusTextR, status: statusR, data: dataR } = await httpRequest({
      url: 'https://store.steampowered.com/app/' + gameId,
      method: 'GET'
    })
    if (resultR === 'Success') {
      if (dataR.status === 200) {
        if (dataR.responseText.includes('class="queue_actions_ctn"') && (dataR.responseText.includes('已在库中') || dataR.responseText.includes('添加至您的愿望单'))) {
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
  } catch (e) {
    throwError(e, 'removeWishlist')
  }
}

// INFO: Steam follow game
async function toggleGame (gameId, follow) {
  try {
    if (whiteList.enable && !follow && whiteList.steam.game.includes(gameId)) {
      return { result: 'Skiped', statusText: 'OK', status: 605 }
    }
    const logStatus = echoLog({ type: `${follow ? '' : 'un'}followGame`, text: gameId })
    const requestData = { sessionid: steamInfo.storeSessionID, appid: gameId }
    if (!follow) requestData.unfollow = '1'
    const { result, data } = await httpRequest({
      url: 'https://store.steampowered.com/explore/followgame/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: $.param(requestData)
    })
    if (result === 'Success' && data.status === 200 && data.responseText === true) {
      logStatus.success()
    } else {
      const followed = await isFollowed(gameId)
      console.log(followed)
      if (follow === followed) {
        logStatus.success()
      } else {
        logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
      }
    }
  } catch (e) {
    throwError(e, 'toggleGame')
  }
}

async function isFollowed (gameId) {
  try {
    const { result, data } = await httpRequest({
      url: 'https://store.steampowered.com/app/' + gameId,
      method: 'GET'
    })
    if (result === 'Success') {
      if (data.status === 200) {
        if ($(data.responseText.replace(/<img.*?>/g, '')).find('.queue_control_button.queue_btn_follow>.btnv6_blue_hoverfade.btn_medium.queue_btn_active').css('display') !== 'none') {
          return true
        } else {
          return false
        }
      } else {
        return null
      }
    } else {
      return null
    }
  } catch (e) {
    throwError(e, 'isFollowed')
  }
}
// INFO: Steam announcement
async function likeAnnouncements (rawMatch) {
  try {
    let [url, logStatus, requestData] = ['', null, {}]
    if (rawMatch.length === 5) {
      logStatus = echoLog({ type: 'likeAnnouncements', url: rawMatch[1], id: rawMatch[2] })
      url = 'https://store.steampowered.com/updated/ajaxrateupdate/' + rawMatch[2]
      requestData = {
        sessionid: steamInfo.storeSessionID,
        wgauthtoken: rawMatch[3],
        voteup: 1,
        clanid: rawMatch[4],
        ajax: 1
      }
    } else {
      logStatus = echoLog({ type: 'likeAnnouncements', url: rawMatch.input, id: rawMatch[1] })
      url = rawMatch.input.replace('/detail/', '/rate/')
      requestData = { sessionid: steamInfo.communitySessionID, voteup: true }
    }
    const { result, statusText, status, data } = await httpRequest({
      url: url,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      data: $.param(requestData),
      dataType: 'json'
    })
    if (result === 'Success') {
      if (data.status === 200 && data.response?.success === 1) {
        logStatus.success()
      } else {
        logStatus.error('Error:' + (data.response?.msg || data.statusText) + '(' + (data.response?.success || data.status) + ')')
      }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
    }
  } catch (e) {
    throwError(e, 'likeAnnouncements')
  }
}

// INFO: Steam forum
async function toggleForum (gameId, subscribe = true) {
  try {
    if (whiteList.enable && whiteList.steam.forum.includes(gameId)) {
      return { result: 'Skiped', statusText: 'OK', status: 605 }
    }
    const forumId = await getForumId(gameId)
    if (!forumId) return
    const logStatus = echoLog({ type: `${subscribe ? '' : 'un'}subscribeForum`, text: gameId })
    const { result, statusText, status, data } = await httpRequest({
      url: `https://steamcommunity.com/forum/${forumId}/General/${subscribe ? '' : 'un'}subscribe/0/`,
      method: 'POST',
      responseType: 'json',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      data: $.param({ sessionid: steamInfo.communitySessionID })
    })
    if (result === 'Success') {
      if (data.status === 200 && (data.response?.success === 1 || data.response?.success === 29)) {
        logStatus.success()
      } else {
        logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
      }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
    }
  } catch (e) {
    throwError(e, 'subscribeForum')
  }
}
async function getForumId (gameId) {
  try {
    const logStatus = echoLog({ type: 'getForumId', text: gameId })
    const { result, statusText, status, data } = await httpRequest({
      url: 'https://steamcommunity.com/app/' + gameId + '/discussions/',
      method: 'GET'
    })
    if (result === 'Success') {
      if (data.status === 200) {
        const forumId = data.responseText?.match(/General_([\d]+)/)?.[1]
        if (forumId) {
          logStatus.success()
        } else {
          logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
        }
        return forumId
      } else {
        logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
        return false
      }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
      return false
    }
  } catch (e) {
    throwError(e, 'getForumId')
  }
}

// INFO: Steam task assignment
async function toggleSteamActions ({ website, type, elements, action, toFinalUrl = {} }) {
  try {
    const pro = []
    for (const element of unique(elements)) {
      let elementName = Array.isArray(element) ? [null, ...element] : [null, element]
      if (website === 'giveawaysu' && toFinalUrl[element]) {
        const toFinalUrlElement = toFinalUrl[element] || ''
        switch (type) {
          case 'group':
            elementName = toFinalUrlElement.match(/groups\/(.+)\/?/)
            break
          case 'forum':
            elementName = toFinalUrlElement.match(/app\/([\d]+)/)
            break
          case 'curator':
          case 'publisher':
          case 'developer':
          case 'franchise':
            if (toFinalUrlElement.includes('curator')) {
              type = 'curator'
              elementName = toFinalUrlElement.match(/curator\/([\d]+)/)
            } else if (toFinalUrlElement.includes('publisher')) {
              type = 'publisher'
              elementName = toFinalUrlElement.match(/publisher\/(.+)\/?/)
            } else if (toFinalUrlElement.includes('developer')) {
              type = 'developer'
              elementName = toFinalUrlElement.match(/developer\/(.+)\/?/)
            } else if (toFinalUrlElement.includes('pub')) {
              type = 'pub'
              elementName = toFinalUrlElement.match(/pub\/(.+)\/?/)
            } else if (toFinalUrlElement.includes('dev')) {
              type = 'dev'
              elementName = toFinalUrlElement.match(/dev\/(.+)\/?/)
            } else if (toFinalUrlElement.includes('franchise')) {
              type = 'franchise'
              elementName = toFinalUrlElement.match(/franchise\/(.+)\/?/)
            }
            break
            /* disable
          case 'publisher':
          case 'developer':
            elementName = (toFinalUrlElement.includes('publisher') ? toFinalUrlElement.match(/publisher\/(.+)\/?/) : toFinalUrlElement.includes('developer') ? toFinalUrlElement.match(/developer\/(.+)\/?/) : (toFinalUrlElement.match(/pub\/(.+)\/?/) || toFinalUrlElement.match(/dev\/(.+)\/?/))) || toFinalUrlElement.match(/curator\/([\d]+)/)
            break
          case 'franchise':
            elementName = toFinalUrlElement.match(/franchise\/(.+)\/?/) || toFinalUrlElement.match(/curator\/([\d]+)/)
            break
            */
          case 'game':
          case 'wishlist':
            elementName = toFinalUrlElement.match(/app\/([\d]+)/)
            break
          case 'favoriteWorkshop':
          case 'voteupWorkshop':
            elementName = toFinalUrlElement.match(/\?id=([\d]+)/)
            break
          case 'announcement': {
            if (toFinalUrlElement.includes('announcements/detail')) {
              elementName = toFinalUrlElement.match(/announcements\/detail\/([\d]+)/)
            } else {
              elementName = toFinalUrlElement.match(/(https?:\/\/store\.steampowered\.com\/newshub\/app\/[\d]+\/view\/([\d]+))\?authwgtoken=(.+?)&clanid=(.+)/)
            }
            break
          }
        }
      }
      if (elementName?.[1]) {
        switch (type) {
          case 'group':
            pro.push(action === 'fuck' ? joinSteamGroup(elementName[1]) : leaveSteamGroup(elementName[1]))
            break
          case 'forum':
            pro.push(toggleForum(elementName[1], action === 'fuck'))
            break
          case 'curator':
            pro.push(toggleCurator(elementName[1], action === 'fuck'))
            break
          case 'pub':
          case 'dev':
          case 'publisher':
          case 'franchise':
          case 'developer':
            pro.push(toggleOtherCurator(elementName[1], type, action === 'fuck'))
            break
          case 'wishlist':
            pro.push(action === 'fuck' ? addWishlist(elementName[1]) : removeWishlist(elementName[1]))
            break
          case 'game':
            pro.push(toggleGame(elementName[1], action === 'fuck'))
            break
          case 'favoriteWorkshop':
            pro.push(toggleFavoriteWorkshop(elementName[1], action === 'fuck'))
            break
          case 'voteupWorkshop':
            pro.push(voteupWorkshop(elementName[1]))
            break
          case 'announcement':
            pro.push(likeAnnouncements(elementName))
            break
        }
      }
      await delay(1000)
    }
    return Promise.all(pro)
  } catch (e) {
    throwError(e, 'toggleSteamActions')
  }
}

export { updateSteamInfo, changeCountry, toggleSteamActions }
