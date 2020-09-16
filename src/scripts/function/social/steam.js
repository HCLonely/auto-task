import { debug } from '../../config'
import { getI18n } from '../../i18n'
import { echoLog } from '../log'
import { httpRequest } from '../httpRequest'
import { unique, throwError } from '../tool'

function updateSteamInfo (r, type = 'all', update = false) {
  try {
    if (new Date().getTime() - steamInfo.updateTime > 10 * 60 * 1000 || update) {
      const pro = []
      if (type === 'community' || type === 'all') {
        pro.push(new Promise((resolve, reject) => {
          const status = echoLog({ type: 'updateSteamCommunity' })
          httpRequest({
            url: 'https://steamcommunity.com/my',
            method: 'GET',
            onload (response) {
              if (debug) console.log(response)
              if (response.status === 200) {
                if ($(response.responseText).find('a[href*="/login/home"]').length > 0) {
                  status.error('Error:' + getI18n('loginSteamCommunity'), true)
                  reject(Error('Not Login'))
                } else {
                  const [
                    steam64Id,
                    communitySessionID,
                    userName
                  ] = [
                    response.responseText.match(/g_steamID = "(.+?)";/),
                    response.responseText.match(/g_sessionID = "(.+?)";/),
                    response.responseText.match(/steamcommunity.com\/id\/(.+?)\/friends\//)
                  ]
                  if (steam64Id) steamInfo.steam64Id = steam64Id[1]
                  if (communitySessionID) steamInfo.communitySessionID = communitySessionID[1]
                  if (userName) steamInfo.userName = userName[1]
                  status.success()
                  resolve()
                }
              } else {
                status.error('Error:' + response.statusText + '(' + response.status + ')')
                reject(new Error('Request Failed'))
              }
            },
            r: resolve,
            status
          })
        }))
      }
      if (type === 'store' || type === 'all') {
        pro.push(new Promise((resolve, reject) => {
          const status = echoLog({ type: 'updateSteamStore' })

          httpRequest({
            url: 'https://store.steampowered.com/stats/',
            method: 'GET',
            onload (response) {
              if (debug) console.log(response)
              if (response.status === 200) {
                if ($(response.responseText).find('a[href*="/login/"]').length > 0) {
                  status.error('Error:' + getI18n('loginSteamStore'), true)
                  reject(new Error('Not Login'))
                } else {
                  const storeSessionID = response.responseText.match(/g_sessionID = "(.+?)";/)
                  if (storeSessionID) steamInfo.storeSessionID = storeSessionID[1]
                  status.success()
                  resolve()
                }
              } else {
                status.error('Error:' + response.statusText + '(' + response.status + ')')
                reject(new Error('Request Failed'))
              }
            },
            r: resolve,
            status
          })
        }))
      }
      Promise.all(pro).then(() => {
        steamInfo.updateTime = new Date().getTime()
        GM_setValue('steamInfo', steamInfo)
        r(1)
      }).catch(err => {
        console.error(err)
        r(0)
      })
    } else {
      r(1)
    }
  } catch (e) {
    throwError(e, 'updateSteamInfo')
  }
}
function joinSteamGroup (r, group) {
  try {
    const status = echoLog({ type: 'joinSteamGroup', text: group })

    httpRequest({
      url: 'https://steamcommunity.com/groups/' + group,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      data: $.param({ action: 'join', sessionID: steamInfo.communitySessionID }),
      onload (response) {
        if (debug) console.log(response)
        if (response.status === 200 && !response.responseText.includes('grouppage_join_area')) {
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
    throwError(e, 'joinSteamGroup')
  }
}
function getGroupID (groupName, callback) {
  try {
    const [
      status,
      groupNameToId
    ] = [
      echoLog({ type: 'getSteamGroupId', text: groupName }),
      GM_getValue('groupNameToId') || {}
    ]
    if (groupNameToId[groupName]) {
      status.success()
      callback(groupName, groupNameToId[groupName])
    } else {
      new Promise(resolve => {
        httpRequest({
          url: 'https://steamcommunity.com/groups/' + groupName,
          method: 'GET',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          onload (response) {
            if (debug) console.log(response)
            if (response.status === 200) {
              const groupId = response.responseText.match(/OpenGroupChat\( '([0-9]+)'/)?.[1]
              if (groupId) {
                status.success()
                groupNameToId[groupName] = groupId
                GM_setValue('groupNameToId', groupNameToId)
                resolve(groupId)
              } else {
                status.error('Error:' + response.statusText + '(' + response.status + ')')
                resolve(false)
              }
            } else {
              status.error('Error:' + response.statusText + '(' + response.status + ')')
              resolve(false)
            }
          },
          status,
          r () {
            resolve(false)
          }
        })
      }).then(groupId => {
        if (groupId && callback) callback(groupName, groupId)
      }).catch(err => {
        console.error(err)
      })
    }
  } catch (e) {
    throwError(e, 'getGroupID')
  }
}
function leaveSteamGroup (r, groupName) {
  try {
    getGroupID(groupName, (groupName, groupId) => {
      const status = echoLog({ type: 'leaveSteamGroup', text: groupName })

      httpRequest({
        url: 'https://steamcommunity.com/id/' + steamInfo.userName + '/home_process',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data: $.param({ sessionID: steamInfo.communitySessionID, action: 'leaveGroup', groupId: groupId }),
        onload (response) {
          if (debug) console.log(response)
          if (response.status === 200 && response.finalUrl.includes('groups') && $(response.responseText.toLowerCase()).find(`a[href='https://steamcommunity.com/groups/${groupName.toLowerCase()}']`).length === 0) {
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
    })
  } catch (e) {
    throwError(e, 'leaveSteamGroup')
  }
}
function followCurator (r, curatorId, follow = '1', status = '') {
  try {
    status = status || echoLog({ type: follow === '1' ? 'followCurator' : 'unfollowCurator', text: curatorId })

    httpRequest({
      url: 'https://store.steampowered.com/curators/ajaxfollow',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      data: $.param({ clanid: curatorId, sessionid: steamInfo.storeSessionID, follow: follow }),
      dataType: 'json',
      onload (response) {
        if (debug) console.log(response)
        if (response.status === 200 && response.response?.success?.success === 1) {
          status.success()
          r({ result: 'success', statusText: response.statusText, status: response.status })
        } else {
          status.error(`Error:${response.response?.msg || response.statusText}(${response.response?.success || response.status})`)
          r({ result: 'error', statusText: response.statusText, status: response.status })
        }
      },
      r,
      status
    })
  } catch (e) {
    throwError(e, 'followCurator')
  }
}
function unfollowCurator (r, curatorId) {
  followCurator(r, curatorId, '0')
}
function getCuratorID (developerName, callback, type, path) {
  try {
    const [
      status,
      developerNameToId
    ] = [
      echoLog({ type: 'getCuratorId', text: `${path}/${developerName}` }),
      GM_getValue('developerNameToId') || {}
    ]
    if (developerNameToId[developerName]) {
      status.success()
      callback(developerName, developerNameToId[developerName])
    } else {
      new Promise(resolve => {
        httpRequest({
          url: `https://store.steampowered.com/${path}/${developerName}`,
          method: 'GET',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          onload (response) {
            if (debug) console.log(response)
            if (response.status === 200) {
              const developerId = response.responseText.match(/g_pagingData.*?"clanid":([\d]+)/)?.[1]
              if (developerId) {
                status.success()
                developerNameToId[developerName] = developerId
                GM_setValue('developerNameToId', developerNameToId)
                resolve(developerId)
              } else {
                status.error('Error:' + response.statusText + '(' + response.status + ')')
                resolve(false)
              }
            } else {
              status.error('Error:' + response.statusText + '(' + response.status + ')')
              resolve(false)
            }
          },
          status,
          r () { resolve(false) }
        })
      }).then(curatorId => {
        if (curatorId && callback) callback(developerName, curatorId)
      }).catch(err => {
        console.error(err)
      })
    }
  } catch (e) {
    throwError(e, 'getCuratorID')
  }
}
function followDeveloper (r, developerName, type = 'followDeveloper', path = 'developer') {
  getCuratorID(developerName, (developerName, curatorId) => {
    const status = echoLog({ type, text: developerName })
    followCurator(r, curatorId, '1', status)
  }, type, path)
}
function unfollowDeveloper (r, developerName, type = 'unfollowDeveloper', path = 'developer') {
  getCuratorID(developerName, (developerName, curatorId) => {
    const status = echoLog({ type, text: developerName })
    followCurator(r, curatorId, '0', status)
  }, type, path)
}
function followPublisher (r, publisherName) {
  followDeveloper(r, publisherName, 'followPublisher', 'publisher')
}
function unfollowPublisher (r, publisherName) {
  unfollowDeveloper(r, publisherName, 'unfollowPublisher', 'publisher')
}
function followFranchise (r, franchiseName) {
  followDeveloper(r, franchiseName, 'followFranchise', 'franchise')
}
function unfollowFranchise (r, franchiseName) {
  unfollowDeveloper(r, franchiseName, 'unfollowFranchise', 'franchise')
}
function addWishlist (r, gameId) {
  try {
    const status = echoLog({ type: 'addWishlist', text: gameId })
    new Promise(resolve => {
      httpRequest({
        url: 'https://store.steampowered.com/api/addtowishlist',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data: $.param({ sessionid: steamInfo.storeSessionID, appid: gameId }),
        dataType: 'json',
        onload (response) {
          if (debug) console.log(response)
          if (response.status === 200 && response.response?.success === true) {
            status.success()
            resolve({ result: 'success', statusText: response.statusText, status: response.status })
          } else {
            resolve({ result: 'error', statusText: response.statusText, status: response.status })
          }
        },
        onabort (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
        onerror (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
        ontimeout (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
        r: resolve,
        status
      })
    }).then(result => {
      if (result.result === 'success') {
        r(result)
      } else {
        httpRequest({
          url: 'https://store.steampowered.com/app/' + gameId,
          method: 'GET',
          onload (response) {
            if (debug) console.log(response)
            if (response.status === 200) {
              if (response.responseText.includes('class="queue_actions_ctn"') && response.responseText.includes('已在库中')) {
                status.success()
                r({ result: 'success', statusText: response.statusText, status: response.status, own: true })
              } else if ((response.responseText.includes('class="queue_actions_ctn"') && response.responseText.includes('添加至您的愿望单')) || !response.responseText.includes('class="queue_actions_ctn"')) {
                status.error('Error:' + result.statusText + '(' + result.status + ')')
                r({ result: 'error', statusText: response.statusText, status: response.status })
              } else {
                status.success()
                r({ result: 'success', statusText: response.statusText, status: response.status })
              }
            } else {
              status.error('Error:' + result.statusText + '(' + result.status + ')')
              r({ result: 'error', statusText: response.statusText, status: response.status })
            }
          },
          r,
          status
        })
      }
    }).catch(err => {
      console.error(err)
    })
  } catch (e) {
    throwError(e, 'addWishlist')
  }
}
function removeWishlist (r, gameId) {
  try {
    const status = echoLog({ type: 'removeWishlist', text: gameId })
    new Promise(resolve => {
      httpRequest({
        url: 'https://store.steampowered.com/api/removefromwishlist',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data: $.param({ sessionid: steamInfo.storeSessionID, appid: gameId }),
        dataType: 'json',
        onload (response) {
          if (debug) console.log(response)
          if (response.status === 200 && response.response?.success === true) {
            status.success()
            resolve({ result: 'success', statusText: response.statusText, status: response.status })
          } else {
            resolve({ result: 'error', statusText: response.statusText, status: response.status })
          }
        },
        onabort (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
        onerror (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
        ontimeout (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
        r: resolve,
        status
      })
    }).then(result => {
      if (result.result === 'success') {
        r(result)
      } else {
        httpRequest({
          url: 'https://store.steampowered.com/app/' + gameId,
          method: 'GET',
          onload (response) {
            if (debug) console.log(response)
            if (response.status === 200) {
              if (response.responseText.includes('class="queue_actions_ctn"') && (response.responseText.includes('已在库中') || response.responseText.includes('添加至您的愿望单'))) {
                status.success()
                r({ result: 'success', statusText: response.statusText, status: response.status })
              } else {
                status.error('Error:' + result.statusText + '(' + result.status + ')')
                r({ result: 'error', statusText: response.statusText, status: response.status })
              }
            } else {
              status.error('Error:' + result.statusText + '(' + result.status + ')')
              r({ result: 'error', statusText: response.statusText, status: response.status })
            }
          },
          r,
          status
        })
      }
    }).catch(err => {
      console.error(err)
    })
  } catch (e) {
    throwError(e, 'removeWishlist')
  }
}
function followGame (r, gameId) {
  try {
    const status = echoLog({ type: 'followGame', text: gameId })
    new Promise(resolve => {
      httpRequest({
        url: 'https://store.steampowered.com/explore/followgame/',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data: $.param({ sessionid: steamInfo.storeSessionID, appid: gameId }),
        onload (response) {
          if (debug) console.log(response)
          if (response.status === 200 && response.responseText === 'true') {
            status.success()
            resolve({ result: 'success', statusText: response.statusText, status: response.status })
          } else {
            resolve({ result: 'error', statusText: response.statusText, status: response.status })
          }
        },
        onabort (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
        onerror (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
        ontimeout (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
        r: resolve,
        status
      })
    }).then(result => {
      if (result.result === 'success') {
        r(result)
      } else {
        httpRequest({
          url: 'https://store.steampowered.com/app/' + gameId,
          method: 'GET',
          onload (response) {
            if (debug) console.log(response)
            if (response.status === 200) {
              if (response.responseText.includes('class="queue_actions_ctn"') && response.responseText.includes('class="btnv6_blue_hoverfade btn_medium queue_btn_active" style="">')) {
                status.success()
                r({ result: 'success', statusText: response.statusText, status: response.status })
              } else {
                status.error('Error:' + result.statusText + '(' + result.status + ')')
                r({ result: 'error', statusText: response.statusText, status: response.status })
              }
            } else {
              status.error('Error:' + result.statusText + '(' + result.status + ')')
              r({ result: 'error', statusText: response.statusText, status: response.status })
            }
          },
          r,
          status
        })
      }
    }).catch(err => {
      console.error(err)
    })
  } catch (e) {
    throwError(e, 'followGame')
  }
}
function unfollowGame (r, gameId) {
  try {
    const status = echoLog({ type: 'unfollowGame', text: gameId })
    new Promise(resolve => {
      httpRequest({
        url: 'https://store.steampowered.com/explore/followgame/',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        data: $.param({ sessionid: steamInfo.storeSessionID, appid: gameId, unfollow: '1' }),
        onload (response) {
          if (debug) console.log(response)
          if (response.status === 200 && response.responseText === 'true') {
            status.success()
            resolve({ result: 'success', statusText: response.statusText, status: response.status })
          } else {
            resolve({ result: 'error', statusText: response.statusText, status: response.status })
          }
        },
        onabort (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
        onerror (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
        ontimeout (response) { resolve({ result: 'error', statusText: response.statusText, status: response.status }) },
        r: resolve,
        status
      })
    }).then(result => {
      if (result.result === 'success') {
        r(result)
      } else {
        httpRequest({
          url: 'https://store.steampowered.com/app/' + gameId,
          method: 'GET',
          onload (response) {
            if (debug) console.log(response)
            if (response.status === 200) {
              if (response.responseText.includes('class="queue_actions_ctn"') && response.responseText.includes('class="btnv6_blue_hoverfade btn_medium queue_btn_active" style="">')) {
                status.error('Error:' + result.statusText + '(' + result.status + ')')
                r({ result: 'error', statusText: response.statusText, status: response.status })
              } else {
                status.success()
                r({ result: 'success', statusText: response.statusText, status: response.status })
              }
            } else {
              status.error('Error:' + result.statusText + '(' + result.status + ')')
              r({ result: 'error', statusText: response.statusText, status: response.status })
            }
          },
          r,
          status
        })
      }
    }).catch(err => {
      console.error(err)
    })
  } catch (e) {
    throwError(e, 'unfollowGame')
  }
}
function likeAnnouncements (r, rawMatch) {
  try {
    let [url, status, data] = ['', null, {}]
    if (rawMatch.length === 5) {
      status = echoLog({ type: 'likeAnnouncements', url: rawMatch[1], id: rawMatch[2] })
      url = 'https://store.steampowered.com/updated/ajaxrateupdate/' + rawMatch[2]
      data = {
        sessionid: steamInfo.storeSessionID,
        wgauthtoken: rawMatch[3],
        voteup: 1,
        clanid: rawMatch[4],
        ajax: 1
      }
    } else {
      status = echoLog({ type: 'likeAnnouncements', url: rawMatch.input, id: rawMatch[1] })
      url = rawMatch.input.replace('/detail/', '/rate/')
      data = { sessionid: steamInfo.communitySessionID, voteup: true }
    }

    httpRequest({
      url: url,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      data: $.param(data),
      dataType: 'json',
      onload (response) {
        if (debug) console.log(response)
        if (response.status === 200 && response.response?.success === 1) {
          status.success()
          r({ result: 'success', statusText: response.statusText, status: response.status })
        } else {
          status.error(`Error:${response.response?.msg || response.statusText}(${response.response?.success || response.status})`)
          r({ result: 'error', statusText: response.statusText, status: response.status })
        }
      },
      r,
      status
    })
  } catch (e) {
    throwError(e, 'likeAnnouncements')
  }
}

async function subscribeForum (r, gameId, subscribe = true) {
  try {
    const { forumId } = await getForumId(gameId)
    if (!forumId) {
      return r({ result: 'error', statusText: 'GetForumIdError', status: 0 })
    }
    const status = echoLog({ type: `${subscribe ? '' : 'un'}subscribeForum`, text: gameId })

    httpRequest({
      url: `https://steamcommunity.com/forum/${forumId}/General/${subscribe ? '' : 'un'}subscribe/0/`,
      method: 'POST',
      responseType: 'json',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      data: $.param({ sessionid: steamInfo.communitySessionID }),
      onload (response) {
        if (debug) console.log(response)
        if (response.status === 200 && (response.response?.success === 1 || response.response?.success === 29)) {
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
    throwError(e, 'subscribeForum')
  }
}

function getForumId (gameId) {
  try {
    const status = echoLog({ type: 'getForumId', text: gameId })

    return new Promise(resolve => {
      httpRequest({
        url: 'https://steamcommunity.com/app/' + gameId + '/discussions/',
        method: 'GET',
        onload (response) {
          if (debug) console.log(response)
          if (response.status === 200) {
            const forumId = response.responseText?.match(/General_([\d]+)/)?.[1]
            if (forumId) {
              status.success()
              resolve({ result: 'success', statusText: response.statusText, status: response.status, forumId })
            } else {
              status.error('Error')
              resolve({ result: 'error', statusText: 'GetForumIdError', status: response.status })
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
    throwError(e, 'getForumId')
  }
}
async function toggleSteamActions ({ website, type, elements, resolve, action, toFinalUrl = {} }) {
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
            elementName = toFinalUrlElement.match(/curator\/([\d]+)/)
            break
          case 'publisher':
          case 'developer':
            elementName = (toFinalUrlElement.includes('publisher') ? toFinalUrlElement.match(/publisher\/(.+)\/?/) : toFinalUrlElement.includes('developer') ? toFinalUrlElement.match(/developer\/(.+)\/?/) : (toFinalUrlElement.match(/pub\/(.+)\/?/) || toFinalUrlElement.match(/dev\/(.+)\/?/))) || toFinalUrlElement.match(/curator\/([\d]+)/)
            break
          case 'franchise':
            elementName = toFinalUrlElement.match(/franchise\/(.+)\/?/) || toFinalUrlElement.match(/curator\/([\d]+)/)
            break
          case 'game':
          case 'wishlist':
            elementName = toFinalUrlElement.match(/app\/([\d]+)/)
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
            pro.push(new Promise(resolve => {
              action === 'fuck' ? joinSteamGroup(resolve, elementName[1]) : leaveSteamGroup(resolve, elementName[1])
            }))
            break
          case 'forum':
            pro.push(new Promise(resolve => {
              action === 'fuck' ? subscribeForum(resolve, elementName[1]) : subscribeForum(resolve, elementName[1], false)
            }))
            break
          case 'curator':
            pro.push(new Promise(resolve => {
              action === 'fuck' ? followCurator(resolve, elementName[1]) : unfollowCurator(resolve, elementName[1])
            }))
            break
          case 'publisher':
            pro.push(new Promise(resolve => {
              action === 'fuck' ? followPublisher(resolve, elementName[1]) : unfollowPublisher(resolve, elementName[1])
            }))
            break
          case 'developer':
            pro.push(new Promise(resolve => {
              action === 'fuck' ? followDeveloper(resolve, elementName[1]) : unfollowDeveloper(resolve, elementName[1])
            }))
            break
          case 'franchise':
            pro.push(new Promise(resolve => {
              action === 'fuck' ? followFranchise(resolve, elementName[1]) : unfollowFranchise(resolve, elementName[1])
            }))
            break
          case 'wishlist':
            pro.push(new Promise(resolve => {
              action === 'fuck' ? addWishlist(resolve, elementName[1]) : removeWishlist(resolve, elementName[1])
            }))
            break
          case 'game':
            pro.push(new Promise(resolve => {
              action === 'fuck' ? followGame(resolve, elementName[1]) : unfollowGame(resolve, elementName[1])
            }))
            break
          case 'announcement':
            pro.push(new Promise(resolve => {
              if (action === 'fuck') {
                likeAnnouncements(resolve, elementName)
              }
            }))
            break
        }
      }
    }
    Promise.all(pro).finally(() => {
      resolve()
    })
  } catch (e) {
    throwError(e, 'toggleSteamActions')
  }
}

export { updateSteamInfo, toggleSteamActions }
