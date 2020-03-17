/* global getI18n, fuc, globalConf, defaultConf, debug */
const giveawaysu = { // eslint-disable-line no-unused-vars
  test: () => { return window.location.host.includes('giveaway.su') },
  get_tasks: function (e) {
    // 获取任务信息
    const taskInfo = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
    if (taskInfo && !fuc.isEmptyObjArr(taskInfo) && e === 'remove') {
      this.taskInfo = taskInfo
      this.do_task('remove')
    } else {
      if (taskInfo && !fuc.isEmptyObjArr(taskInfo)) this.taskInfo = taskInfo
      const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` })
      const tasks = $('#actions tr')
      for (const task of tasks) {
        const taskDes = $(task).find('td').eq(1).find('a:not([data-trigger="link"])')
        const taskInfo = this.which_task(taskDes)
        for (const info of taskInfo) {
          if (info.name !== 'nonSteam' && this.taskInfo[info.name + 's']) {
            this.taskInfo[info.name + 's'].push(info.link)
            this.taskInfo.links.push(info.link)
          }
        }
      }
      status.success()
      this.getFinalUrl(e)
    }
  },
  which_task: function (taskDes) {
    const taskInfo = []
    const taskName = taskDes.text().trim()
    const link = taskDes.attr('href')
    if (/disable adblock/gim.test(taskName)) {
      return [{ name: 'nonSteam' }]
    } else if (/join.*group/gim.test(taskName)) {
      taskInfo.push({ name: 'group', link })
      this.community = 1
    } else if (/like.*announcement/gim.test(taskName)) {
      taskInfo.push({ name: 'announcement', link })
      this.community = 1
    } else if (/follow.*publisher/gim.test(taskName)) {
      taskInfo.push({ name: 'publisher', link })
      this.store = 1
    } else if (/follow.*developer/gim.test(taskName)) {
      taskInfo.push({ name: 'developer', link })
      this.store = 1
    } else if (/follow.*curator|subscribe.*curator/gim.test(taskName)) {
      taskInfo.push({ name: 'curator', link })
      this.store = 1
    } else {
      if (/(Subscribe.*YouTube)|(Like.*YouTube)|(Follow.*Instagram)|(on twitter)|(Join.*Discord.*server)|(Follow.*on.*Facebook)/gim.test(taskName)) {
        this.links.push(link)
      } else {
        if (/wishlist.*game|add.*wishlist/gim.test(taskName)) {
          taskInfo.push({ name: 'wGame', link })
          this.store = 1
        }
        if (/follow.*button/gim.test(taskName)) {
          taskInfo.push({ name: 'fGame', link })
          this.store = 1
        }
      }
      if (taskInfo.length === 0) return [{ name: 'nonSteam' }]
    }
    return taskInfo
  },
  getFinalUrl: function (e) {
    // 处理任务链接
    const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('processTasksUrl')}<font></font></li>` })
    const pro = []
    for (const link of this.taskInfo.links) {
      pro.push(new Promise(resolve => {
        if (this.taskInfo.toFinalUrl[link]) {
          resolve({ result: 'success' })
        } else {
          fuc.getFinalUrl(resolve, link)
        }
      }))
    }
    Promise.all(pro).then(data => {
      for (const r of data) {
        if (r.finalUrl) {
          this.taskInfo.toFinalUrl[r.url] = r.finalUrl
        }
      }

      this.links = fuc.unique(this.links)
      this.taskInfo.groups = fuc.unique(this.taskInfo.groups)
      this.taskInfo.curators = fuc.unique(this.taskInfo.curators)
      this.taskInfo.publishers = fuc.unique(this.taskInfo.publishers)
      this.taskInfo.developers = fuc.unique(this.taskInfo.developers)
      this.taskInfo.fGames = fuc.unique(this.taskInfo.fGames)
      this.taskInfo.wGames = fuc.unique(this.taskInfo.wGames)
      this.taskInfo.announcements = fuc.unique(this.taskInfo.announcements)
      this.taskInfo.links = fuc.unique(this.taskInfo.links)
      // 任务链接处理完成
      GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
      status.success()
      if (debug) console.log(this)
      e === 'doTask' ? this.do_task('join') : this.do_task('remove')
    }).catch(error => {
      status.error()
      if (debug) console.log(error)
    })
  },
  do_task: function (act) {
    if (globalConf.other.autoOpen && act === 'join' && this.links.length > 0) {
      for (const link of fuc.unique(this.links)) {
        window.open(link, '_blank')
      }
    }
    if ($('div.bind-discord').is(':visible')) $('div.bind-discord a')[0].click()
    if ($('div.bind-twitch').is(':visible')) $('div.bind-twitch a')[0].click()
    new Promise(resolve => {
      if (this.taskInfo.groups.length > 0 || this.taskInfo.announcements.length > 0) {
        if (this.taskInfo.curators.length > 0 || this.taskInfo.publishers.length > 0 || this.taskInfo.developers.length > 0 || this.taskInfo.fGames.length > 0 || this.taskInfo.wGames.length > 0) {
          fuc.updateSteamInfo(resolve, 'all')
        } else {
          fuc.updateSteamInfo(resolve, 'community')
        }
      } else if (this.taskInfo.curators.length > 0 || this.taskInfo.publishers.length > 0 || this.taskInfo.developers.length > 0 || this.taskInfo.fGames.length > 0 || this.taskInfo.wGames.length > 0) {
        fuc.updateSteamInfo(resolve, 'store')
      } else {
        resolve(1)
      }
    }).then(s => {
      if (s === 1) {
        const pro = []
        for (const group of fuc.unique(this.taskInfo.groups)) {
          if (this.taskInfo.toFinalUrl[group]) {
            const groupName = this.taskInfo.toFinalUrl[group].match(/groups\/(.+)\/?/)
            if (groupName) {
              pro.push(new Promise(resolve => {
                if (act === 'join' && this.conf.join.group) {
                  fuc.joinSteamGroup(resolve, groupName[1])
                } else if (act === 'remove' && this.conf.remove.group) {
                  fuc.leaveSteamGroup(resolve, groupName[1])
                } else {
                  resolve(1)
                }
              }))
            }
          }
        }
        for (const curator of fuc.unique(this.taskInfo.curators)) {
          if (this.taskInfo.toFinalUrl[curator]) {
            const curatorId = this.taskInfo.toFinalUrl[curator].match(/curator\/([\d]+)/)
            if (curatorId) {
              pro.push(new Promise(resolve => {
                if (act === 'join' && this.conf.join.curator) {
                  fuc.followCurator(resolve, curatorId[1])
                } else if (act === 'remove' && this.conf.remove.curator) {
                  fuc.unfollowCurator(resolve, curatorId[1])
                } else {
                  resolve(1)
                }
              }))
            }
          }
        }
        for (const publisher of fuc.unique(this.taskInfo.publishers)) {
          if (this.taskInfo.toFinalUrl[publisher]) {
            const publisherName = this.taskInfo.toFinalUrl[publisher].includes('publisher') ? this.taskInfo.toFinalUrl[publisher].match(/publisher\/(.+)\/?/) : this.taskInfo.toFinalUrl[publisher].match(/pub\/(.+)\/?/)
            if (publisherName) {
              pro.push(new Promise(resolve => {
                if (act === 'join' && this.conf.join.publisher) {
                  fuc.followPublisher(resolve, publisherName[1])
                } else if (act === 'remove' && this.conf.remove.publisher) {
                  fuc.unfollowPublisher(resolve, publisherName[1])
                } else {
                  resolve(1)
                }
              }))
            }
          }
        }
        for (const developer of fuc.unique(this.taskInfo.developers)) {
          if (this.taskInfo.toFinalUrl[developer]) {
            const developerName = this.taskInfo.toFinalUrl[developer].includes('developer') ? this.taskInfo.toFinalUrl[developer].match(/developer\/(.+)\/?/) : this.taskInfo.toFinalUrl[developer].match(/dev\/(.+)\/?/)
            if (developerName) {
              pro.push(new Promise(resolve => {
                if (act === 'join' && this.conf.join.developer) {
                  fuc.followDeveloper(resolve, developerName[1])
                } else if (act === 'remove' && this.conf.remove.developer) {
                  fuc.unfollowDeveloper(resolve, developerName[1])
                } else {
                  resolve(1)
                }
              }))
            }
          }
        }
        for (const game of fuc.unique(this.taskInfo.fGames)) {
          if (this.taskInfo.toFinalUrl[game]) {
            const gameId = this.taskInfo.toFinalUrl[game].match(/app\/([\d]+)/)
            if (gameId) {
              pro.push(new Promise(resolve => {
                if (act === 'join' && this.conf.join.followGame) {
                  fuc.followGame(resolve, gameId[1])
                } else if (act === 'remove' && this.conf.remove.unfollowGame) {
                  fuc.unfollowGame(resolve, gameId[1])
                } else {
                  resolve(1)
                }
              }))
            }
          }
        }
        for (const game of fuc.unique(this.taskInfo.wGames)) {
          if (this.taskInfo.toFinalUrl[game]) {
            const gameId = this.taskInfo.toFinalUrl[game].match(/app\/([\d]+)/)
            if (gameId) {
              pro.push(new Promise(resolve => {
                if (act === 'join' && this.conf.join.wishlist) {
                  fuc.addWishlist(resolve, gameId[1])
                } else if (act === 'remove' && this.conf.remove.wishlist) {
                  fuc.removeWishlist(resolve, gameId[1])
                } else {
                  resolve(1)
                }
              }))
            }
          }
        }
        for (const announcement of fuc.unique(this.taskInfo.announcements)) {
          if (this.taskInfo.toFinalUrl[announcement]) {
            const announcementUrl = this.taskInfo.toFinalUrl[announcement]
            const announcementId = announcementUrl.match(/announcements\/detail\/([\d]+)/)
            if (announcementId) {
              if (act === 'join' && this.conf.join.announcement) {
                pro.push(new Promise(resolve => {
                  fuc.likeAnnouncements(resolve, announcementUrl, announcementId[1])
                }))
              }
            }
          }
        }
        Promise.all(pro).finally(data => {
          fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
          if (act === 'join') fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('closeExtensions')}</font></li>` })
        })
      }
    })
  },
  fuck: function () {
  },
  verify: function () {
  },
  join: function () {
    this.get_tasks('doTask')
  },
  remove: function () {
    this.get_tasks('remove')
  },
  get_giveawayId: function () {
    const id = window.location.href.match(/view\/([\d]+)/)
    if (id) {
      return id[1]
    } else {
      return window.location.href
    }
  },
  checkLogin: function () {
    if ($('a.steam-login').length > 0) window.open('/steam/redirect', '_self')
  },
  checkLeft: function (ui) {
    if ($('.giveaway-ended').length > 0) {
      ui.$confirm(getI18n('noKeysLeft'), getI18n('notice'), {
        confirmButtonText: getI18n('confirm'),
        cancelButtonText: getI18n('cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        window.close()
      })
    }
  },
  community: 0,
  store: 0,
  links: [], // 非steam任务
  taskInfo: {
    groups: [], // 任务需要加的组
    curators: [], // 任务需要关注的鉴赏家
    publishers: [], // 任务需要关注的发行商
    developers: [], // 任务需要关注的开发商
    fGames: [], // 任务需要关注的游戏
    wGames: [], // 任务需要加愿望单的游戏
    announcements: [], // 任务需要点赞的通知
    links: [], // 原始链接
    toFinalUrl: {}// 链接转换
  },
  setting: {
    fuck: false,
    verify: false,
    join: true,
    remove: true
  },
  conf: GM_getValue('conf') ? ((GM_getValue('conf').giveawaysu && GM_getValue('conf').giveawaysu.load) ? GM_getValue('conf').giveawaysu : (GM_getValue('conf').global || defaultConf)) : defaultConf
}
