/* global getI18n, fuc, config, debug, globalConf */
const giveawaysu = { // eslint-disable-line no-unused-vars
  test () { return window.location.host.includes('giveaway.su') },
  get_tasks (e) {
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
  which_task (taskDes) {
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
  getFinalUrl (e) {
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
      e === 'doTask' ? this.do_task('fuck') : this.do_task('remove')
    }).catch(error => {
      status.error()
      if (debug) console.log(error)
    })
  },
  do_task (act) {
    /* disable
    if (globalConf.other.autoOpen && act === 'join' && this.links.length > 0) {
      for (const link of fuc.unique(this.links)) {
        window.open(link, '_blank')
      }
    }
    */
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
        if (this.conf.fuck.joinSteamGroup && this.taskInfo.groups.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'group', elements: this.taskInfo.groups, resolve: resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
          }))
        }
        if (this.conf.fuck.followCurator && this.taskInfo.curators.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'curator', elements: this.taskInfo.curators, resolve: resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
          }))
        }
        if (this.conf.fuck.followPublisher && this.taskInfo.publishers.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'publisher', elements: this.taskInfo.publishers, resolve: resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
          }))
        }
        if (this.conf.fuck.followDeveloper && this.taskInfo.developers.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'developer', elements: this.taskInfo.developers, resolve: resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
          }))
        }
        if (this.conf.fuck.followGame && this.taskInfo.fGames.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'game', elements: this.taskInfo.fGames, resolve: resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
          }))
        }
        if (this.conf.fuck.addToWishlist && this.taskInfo.wGames.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'wishlist', elements: this.taskInfo.wGames, resolve: resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
          }))
        }
        if (this.conf.fuck.likeAnnouncement && this.taskInfo.announcements.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'announcement', elements: this.taskInfo.announcements, resolve: resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
          }))
        }
        Promise.all(pro).finally(() => {
          fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
          if (act === 'fuck') fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('closeExtensions')}</font></li>` })
        })
      }
    })
  },
  fuck () { this.get_tasks('doTask') },
  verify () { },
  remove () { this.get_tasks('remove') },
  get_giveawayId () {
    const id = window.location.href.match(/view\/([\d]+)/)
    return id?.[1] || window.location.href
  },
  checkLogin () {
    if ($('a.steam-login').length > 0) window.open('/steam/redirect', '_self')
  },
  checkLeft (ui) {
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
    fuck: true,
    verify: false,
    remove: true
  },
  conf: config?.giveawaysu?.load ? config.giveawaysu : globalConf
}
