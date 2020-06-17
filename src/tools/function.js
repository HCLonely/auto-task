/* global getI18n, debug, steamInfo */
const fuc = {
  httpRequest (e) {
    e.method = e.method.toUpperCase()
    if (e.dataType) e.responseType = e.dataType
    const requestObj = Object.assign({
      timeout: 30000,
      ontimeout (data) {
        if (debug) console.log(data)
        if (e.status) e.status.error('Error:Timeout(0)')
        if (e.r) e.r({ result: 'error', statusText: 'Timeout', status: 0, option: e })
      },
      onabort (data) {
        if (debug) console.log(data)
        if (e.status) e.status.error('Error:Aborted(0)')
        if (e.r) e.r({ result: 'error', statusText: 'Aborted', status: 0, option: e })
      },
      onerror (data) {
        if (debug) console.log(data)
        if (e.status) e.status.error('Error:Error(0)')
        if (e.r) e.r({ result: 'error', statusText: 'Error', status: 0, option: e })
      }
    }, e)
    if (debug) console.log('发送请求:', requestObj)
    GM_xmlhttpRequest(requestObj)
  },
  updateSteamInfo (r, type = 'all', update = false) {
    if (new Date().getTime() - steamInfo.updateTime > 10 * 60 * 1000 || update) {
      const pro = []
      if (type === 'community' || type === 'all') {
        pro.push(new Promise((resolve, reject) => {
          const status = this.echoLog({ type: 'updateSteamCommunity' })
          this.httpRequest({
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
                reject(Error('Request Failed'))
              }
            },
            r: resolve,
            status
          })
        }))
      }
      if (type === 'store' || type === 'all') {
        pro.push(new Promise((resolve, reject) => {
          const status = this.echoLog({ type: 'updateSteamStore' })

          this.httpRequest({
            url: 'https://store.steampowered.com/stats/',
            method: 'GET',
            onload (response) {
              if (debug) console.log(response)
              if (response.status === 200) {
                if ($(response.responseText).find('a[href*="/login/"]').length > 0) {
                  status.error('Error:' + getI18n('loginSteamStore'), true)
                  reject(Error('Not Login'))
                } else {
                  const storeSessionID = response.responseText.match(/g_sessionID = "(.+?)";/)
                  if (storeSessionID) steamInfo.storeSessionID = storeSessionID[1]
                  status.success()
                  resolve()
                }
              } else {
                status.error('Error:' + response.statusText + '(' + response.status + ')')
                reject(Error('Request Failed'))
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
      })
    } else {
      r(1)
    }
  },
  joinSteamGroup (r, group) {
    const status = this.echoLog({ type: 'joinSteamGroup', text: group })

    this.httpRequest({
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
  },
  getGroupID (groupName, callback) {
    const [
      status,
      groupNameToId
    ] = [
      this.echoLog({ type: 'getGroupId', text: groupName }),
      GM_getValue('groupNameToId') || {}
    ]
    if (groupNameToId[groupName]) {
      status.success()
      callback(groupName, groupNameToId[groupName])
    } else {
      new Promise(resolve => {
        this.httpRequest({
          url: 'https://steamcommunity.com/groups/' + groupName,
          method: 'GET',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          onload (response) {
            if (debug) console.log(response)
            if (response.status === 200) {
              const groupId = response.responseText.match(/OpenGroupChat\( '([0-9]+)'/)
              if (groupId === null) {
                status.error('Error:' + response.statusText + '(' + response.status + ')')
                resolve(false)
              } else {
                status.success()
                groupNameToId[groupName] = groupId[1]
                GM_setValue('groupNameToId', groupNameToId)
                resolve(groupId[1])
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
        if (groupId !== false && callback) callback(groupName, groupId)
      }).catch(err => {
        console.error(err)
      })
    }
  },
  leaveSteamGroup (r, groupName) {
    this.getGroupID(groupName, (groupName, groupId) => {
      const status = this.echoLog({ type: 'leaveSteamGroup', text: groupName })

      this.httpRequest({
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
  },
  followCurator (r, curatorId, follow = '1', status = '') {
    status = status || this.echoLog({ type: follow === '1' ? 'followCurator' : 'unfollowCurator', text: curatorId })

    this.httpRequest({
      url: 'https://store.steampowered.com/curators/ajaxfollow',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      data: $.param({ clanid: curatorId, sessionid: steamInfo.storeSessionID, follow: follow }),
      dataType: 'json',
      onload (response) {
        if (debug) console.log(response)
        if (response.status === 200 && response?.response?.success?.success === 1) {
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
  },
  unfollowCurator (r, curatorId) {
    this.followCurator(r, curatorId, '0')
  },
  getCuratorID (developerName, callback, type, path) {
    const [
      status,
      developerNameToId
    ] = [
      this.echoLog({ type: 'getCuratorId', text: developerName }),
      GM_getValue('developerNameToId') || {}
    ]
    if (developerNameToId[developerName]) {
      status.success()
      callback(developerName, developerNameToId[developerName])
    } else {
      new Promise(resolve => {
        this.httpRequest({
          url: `https://store.steampowered.com/${path}/${developerName}`,
          method: 'GET',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          onload (response) {
            if (debug) console.log(response)
            if (response.status === 200) {
              const developerId = response.responseText.match(/g_pagingData.*?"clanid":([\d]+)/)
              if (developerId === null) {
                status.error('Error:' + response.statusText + '(' + response.status + ')')
                resolve(false)
              } else {
                status.success()
                developerNameToId[developerName] = developerId[1]
                GM_setValue('developerNameToId', developerNameToId)
                resolve(developerId[1])
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
        if (curatorId !== false && callback) callback(developerName, curatorId)
      }).catch(err => {
        console.error(err)
      })
    }
  },
  followDeveloper (r, developerName, type = 'followDeveloper', path = 'developer') {
    this.getCuratorID(developerName, (developerName, curatorId) => {
      const status = this.echoLog({ type, text: developerName })
      this.followCurator(r, curatorId, '1', status)
    }, type, path)
  },
  unfollowDeveloper (r, developerName, type = 'unfollowDeveloper', path = 'developer') {
    this.getCuratorID(developerName, (developerName, curatorId) => {
      const status = this.echoLog({ type, text: developerName })
      this.followCurator(r, curatorId, '0', status)
    }, type, path)
  },
  followPublisher (r, publisherName) {
    this.followDeveloper(r, publisherName, 'followPublisher', 'publisher')
  },
  unfollowPublisher (r, publisherName) {
    this.unfollowDeveloper(r, publisherName, 'unfollowPublisher', 'publisher')
  },
  followFranchise (r, franchiseName) {
    this.followDeveloper(r, franchiseName, 'followFranchise', 'franchise')
  },
  unfollowFranchise (r, franchiseName) {
    this.unfollowDeveloper(r, franchiseName, 'unfollowFranchise', 'franchise')
  },
  addWishlist (r, gameId) {
    const status = this.echoLog({ type: 'addWishlist', text: gameId })
    new Promise(resolve => {
      this.httpRequest({
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
        this.httpRequest({
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
  },
  removeWishlist (r, gameId) {
    const status = this.echoLog({ type: 'removeWishlist', text: gameId })
    new Promise(resolve => {
      this.httpRequest({
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
        this.httpRequest({
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
  },
  followGame (r, gameId) {
    const status = this.echoLog({ type: 'followGame', text: gameId })
    new Promise(resolve => {
      this.httpRequest({
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
        this.httpRequest({
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
  },
  unfollowGame (r, gameId) {
    const status = this.echoLog({ type: 'unfollowGame', text: gameId })
    new Promise(resolve => {
      this.httpRequest({
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
        this.httpRequest({
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
  },
  likeAnnouncements (r, url, id) {
    const status = this.echoLog({ type: 'likeAnnouncements', url, id })

    this.httpRequest({
      url: url.replace('/detail/', '/rate/'),
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      data: $.param({ sessionid: steamInfo.communitySessionID, voteup: true }),
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
  },
  getFinalUrl (r, url, options = null) {
    const conf = Object.assign({
      url,
      method: 'GET',
      onload (response) {
        r({ result: 'success', finalUrl: response.finalUrl, url })
      },
      r
    }, options)
    this.httpRequest(conf)
  },
  visitLink (r, url, options = {}) {
    if (!options.method) options.method = 'HEAD'
    const status = this.echoLog({ type: 'visitLink', text: url })
    new Promise(resolve => {
      this.getFinalUrl(resolve, url, options)
    }).then(() => {
      status.warning('Complete')
      r(1)
    }).catch(err => {
      console.error(err)
    })
  },
  checkUpdate (s = false) {
    let status = false
    if (s) status = this.echoLog({ type: 'custom', text: `<li>${getI18n('checkingUpdate')}<font></font></li>` })
    this.httpRequest({
      url: 'https://github.com/HCLonely/auto-task/raw/master/version.json?t=' + new Date().getTime(),
      method: 'get',
      dataType: 'json',
      onload (response) {
        if (debug) console.log(response)
        if (response.response?.version === GM_info.script.version) {
          if (s) status.success(getI18n('thisIsNew'))
        } else if (response.response?.version) {
          this.echoLog({ type: 'custom', text: `<li>${getI18n('newVer') + 'V' + response.response.version}<a href="https://github.com/HCLonely/auto-task/raw/master/auto-task.user.js" target="_blank">${getI18n('updateNow')}</a><font></font></li>` })
          if (s) status.success(getI18n('newVer') + response.response.version)
        } else {
          if (s) status.error('Error:' + (response.statusText || response.status))
        }
      },
      ontimeout (response) {
        if (debug) console.log(response)
        if (s) status.error('Error:Timeout(0)')
      },
      onabort (response) {
        if (debug) console.log(response)
        if (s) status.error('Error:Abort(0)')
      },
      onerror (response) {
        if (debug) console.log(response)
        if (s) status.error('Error:Error(0)')
      },
      status
    })
  },
  newTabBlock () {
    const [d, cookiename] = [new Date(), 'haveVisited1']
    document.cookie = cookiename + '=1; path=/'
    document.cookie = cookiename + '=' + (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + '/' + d.getUTCFullYear() + '; path=/'
  },
  echoLog (e) { // switch case !!
    let ele = ''
    switch (e.type) {
      case 'updateSteamCommunity':
        ele = $(`<li>${getI18n('updateCommunityId')}<font></font></li>`)
        break
      case 'updateSteamStore':
        ele = $(`<li>${getI18n('updateStoreId')}<font></font></li>`)
        break
      case 'joinSteamGroup':
        ele = $(`<li>${getI18n('joinGroup')}<a href="https://steamcommunity.com/groups/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
        break
      case 'getGroupId':
        ele = $(`<li>${getI18n('getGroupId')}<a href="https://steamcommunity.com/groups/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
        break
      case 'leaveSteamGroup':
        ele = $(`<li>${getI18n('leaveGroup')}<a href="https://steamcommunity.com/groups/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
        break
      case 'followCurator':
        ele = $(`<li>${getI18n('followCurator')}<a href="https://store.steampowered.com/curator/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
        break
      case 'unfollowCurator':
        ele = $(`<li>${getI18n('unfollowCurator')}<a href="https://store.steampowered.com/curator/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
        break
      case 'getDeveloperId':
        ele = $(`<li>${getI18n('getDeveloperId')}<a href="https://store.steampowered.com/developer/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
        break
      case 'followDeveloper':
        ele = $(`<li>${getI18n('followDeveloper')}<a href="https://store.steampowered.com/developer/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
        break
      case 'unfollowDeveloper':
        ele = $(`<li>${getI18n('unfollowDeveloper')}<a href="https://store.steampowered.com/developer/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
        break
      case 'getPublisherId':
        ele = $(`<li>${getI18n('getPublisherId')}<a href="https://store.steampowered.com/publisher/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
        break
      case 'followPublisher':
        ele = $(`<li>${getI18n('followPublisher')}<a href="https://store.steampowered.com/publisher/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
        break
      case 'unfollowPublisher':
        ele = $(`<li>${getI18n('unfollowPublisher')}<a href="https://store.steampowered.com/publisher/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
        break
      case 'getFranchiseId':
        ele = $(`<li>${getI18n('getFranchiseId')}<a href="https://store.steampowered.com/franchise/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
        break
      case 'followFranchise':
        ele = $(`<li>${getI18n('followFranchise')}<a href="https://store.steampowered.com/franchise/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
        break
      case 'unfollowFranchise':
        ele = $(`<li>${getI18n('unfollowFranchise')}<a href="https://store.steampowered.com/franchise/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
        break
      case 'addWishlist':
        ele = $(`<li>${getI18n('addWishlist')}<a href="https://store.steampowered.com/app/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
        break
      case 'removeWishlist':
        ele = $(`<li>${getI18n('removeWishlist')}<a href="https://store.steampowered.com/app/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
        break
      case 'followGame':
        ele = $(`<li>${getI18n('followGame')}<a href="https://store.steampowered.com/app/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
        break
      case 'unfollowGame':
        ele = $(`<li>${getI18n('unfollowGame')}<a href="https://store.steampowered.com/app/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
        break
      case 'likeAnnouncements':
        ele = $(`<li>${getI18n('likeAnnouncements')}<a href="${e.url}" target="_blank">${e.id}</a>...<font></font></li>`)
        break
      case 'visitLink':
        ele = $(`<li>${getI18n('visitLink')}...<a href="${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
        break
      case 'custom':
        ele = $(e.text)
        break
      default:
        ele = $(`<li>${getI18n('unknown')}<font></font></li>`)
        break
    }
    ele.addClass('card-text')
    $('#fuck-task-info .card-textarea').append(ele)
    ele[0].scrollIntoView()
    const font = ele.find('font')
    const status = {
      font,
      success (text = 'Success', html = false) {
        this.font.attr('class', '').addClass('success')
        html ? this.font.html(text) : this.font.text(text)
      },
      error (text = 'Error', html = false) {
        this.font.attr('class', '').addClass('error')
        html ? this.font.html(text) : this.font.text(text)
      },
      warning (text = 'Warning', html = false) {
        this.font.attr('class', '').addClass('warning')
        html ? this.font.html(text) : this.font.text(text)
      },
      info (text = 'Info', html = false) {
        this.font.attr('class', '').addClass('info')
        html ? this.font.html(text) : this.font.text(text)
      }
    }
    return status
  },
  unique: e => [...new Set(e)],
  getUrlQuery (url) {
    const q = {}
    if (url) {
      if (url.includes('?')) url.split('?')[1].replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => { q[k] = v })
    } else {
      window.location.search.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => { q[k] = v })
    }
    return q
  },
  dateFormat (fmt, date) {
    let ret = null
    const opt = {
      'Y+': date.getFullYear().toString(),
      'm+': (date.getMonth() + 1).toString(),
      'd+': date.getDate().toString(),
      'H+': date.getHours().toString(),
      'M+': date.getMinutes().toString(),
      'S+': date.getSeconds().toString()
    }
    for (const k in opt) {
      ret = new RegExp('(' + k + ')').exec(fmt)
      if (ret) {
        fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
      }
    }
    return fmt
  },
  isEmptyObjArr (object) {
    for (const value of Object.values(object)) {
      if (Object.prototype.toString.call(value) === '[object Array]') {
        if (value.length !== 0) return false
      } else if (Object.prototype.toString.call(value) === '[object Object]') {
        if (Object.keys(value).length !== 0) return false
      } else if (Object.prototype.toString.call(value) === '[object String]') {
        if (value !== '') return false
      }
    }
    return true
  },
  toggleActions ({ website, type, elements, resolve, action, toFinalUrl = {} }) {
    const pro = []
    for (const element of fuc.unique(elements)) {
      let elementName = null
      if (website === 'giveawaysu' && toFinalUrl[element]) {
        const toFinalUrlElement = toFinalUrl[element] || ''
        switch (type) {
          case 'group':
            elementName = toFinalUrlElement.match(/groups\/(.+)\/?/)
            break
          case 'curator':
            elementName = toFinalUrlElement.match(/curator\/([\d]+)/)
            break
          case 'publisher':
            elementName = toFinalUrlElement.includes('publisher') ? toFinalUrlElement.match(/publisher\/(.+)\/?/) : toFinalUrlElement.match(/pub\/(.+)\/?/)
            break
          case 'developer':
            elementName = toFinalUrlElement.includes('developer') ? toFinalUrlElement.match(/developer\/(.+)\/?/) : toFinalUrlElement.match(/dev\/(.+)\/?/)
            break
          case 'franchise':
            elementName = toFinalUrlElement.match(/franchise\/(.+)\/?/)
            break
          case 'game':
          case 'wishlist':
            elementName = toFinalUrlElement.match(/app\/([\d]+)/)
            break
          case 'announcement':
            elementName = toFinalUrlElement.match(/announcements\/detail\/([\d]+)/)
            break
          default:
            elementName = null
        }
      } else {
        elementName = [null, element]
      }
      if (elementName?.[1]) {
        switch (type) {
          case 'group':
            pro.push(new Promise(resolve => {
              action === 'fuck' ? fuc.joinSteamGroup(resolve, elementName[1]) : fuc.leaveSteamGroup(resolve, elementName[1])
            }))
            break
          case 'curator':
            pro.push(new Promise(resolve => {
              action === 'fuck' ? fuc.followCurator(resolve, elementName[1]) : fuc.unfollowCurator(resolve, elementName[1])
            }))
            break
          case 'publisher':
            pro.push(new Promise(resolve => {
              action === 'fuck' ? fuc.followPublisher(resolve, elementName[1]) : fuc.unfollowPublisher(resolve, elementName[1])
            }))
            break
          case 'developer':
            pro.push(new Promise(resolve => {
              action === 'fuck' ? fuc.followDeveloper(resolve, elementName[1]) : fuc.unfollowDeveloper(resolve, elementName[1])
            }))
            break
          case 'franchise':
            pro.push(new Promise(resolve => {
              action === 'fuck' ? fuc.followFranchise(resolve, elementName[1]) : fuc.unfollowFranchise(resolve, elementName[1])
            }))
            break
          case 'wishlist':
            pro.push(new Promise(resolve => {
              action === 'fuck' ? fuc.addWishlist(resolve, elementName[1]) : fuc.removeWishlist(resolve, elementName[1])
            }))
            break
          case 'game':
            pro.push(new Promise(resolve => {
              action === 'fuck' ? fuc.followGame(resolve, elementName[1]) : fuc.unfollowGame(resolve, elementName[1])
            }))
            break
          case 'announcement':
            pro.push(new Promise(resolve => {
              if (action === 'like') {
                fuc.likeAnnouncements(resolve, elementName.input, elementName[1])
              }
            }))
            break
        }
      }
    }
    Promise.all(pro).finally(() => {
      resolve()
    })
  }
}
