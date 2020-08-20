import { getI18n } from '../i18n'
import { fuc } from '../function/main'
import { config, globalConf, debug } from '../config'

const giveawaysu = {
  test () { return window.location.host.includes('giveaway.su') },
  get_tasks (e) {
    // 获取任务信息
    const taskInfo = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
    if (taskInfo && !fuc.isEmptyObjArr(taskInfo) && e === 'remove') {
      this.taskInfo = taskInfo
      this.do_task('remove')
    } else {
      if (taskInfo && !fuc.isEmptyObjArr(taskInfo)) this.taskInfo = taskInfo
      const [
        status,
        tasks
      ] = [
        fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` }),
        $('#actions tr')
      ]
      for (const task of tasks) {
        const td = $(task).find('td')
        const colorfulTask = td.eq(1).find('a:not([data-trigger="link"])')
        const colorlessTask = td.eq(2).find('a:not([data-trigger="link"])')
        const taskDes = colorfulTask.length > 0 ? colorfulTask : colorlessTask
        const taskIcon = td.eq(0).find('i').attr('class')
        const taskInfo = this.which_task(taskDes, taskIcon)
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
  which_task (taskDes, taskIcon) {
    const [taskInfo, taskName, link] = [[], taskDes.text().trim(), taskDes.attr('href')]
    if (taskIcon.includes('ban') || /disable adblock/gim.test(taskName)) {
      return [{ name: 'nonSteam' }]
    } else if (/join.*steam.*group/gim.test(taskName)) {
      taskInfo.push({ name: 'group', link })
    } else if (/like.*announcement/gim.test(taskName)) {
      taskInfo.push({ name: 'announcement', link })
    } else if (/(follow|subscribe).*publisher/gim.test(taskName)) {
      taskInfo.push({ name: 'publisher', link })
    } else if (/(follow|subscribe).*franchise/gim.test(taskName)) {
      taskInfo.push({ name: 'franchise', link })
    } else if (/(follow|subscribe).*developer/gim.test(taskName)) {
      taskInfo.push({ name: 'developer', link })
    } else if (/(follow|subscribe).*curator/gim.test(taskName)) {
      taskInfo.push({ name: 'curator', link })
    } else if (taskIcon.includes('discord') || /join.*discord/gim.test(taskName)) {
      taskInfo.push({ name: 'discord', link })
    } else if (taskIcon.includes('instagram') || /follow.*instagram/gim.test(taskName)) {
      taskInfo.push({ name: 'instagram', link })
    } else if (taskIcon.includes('twitch') || /follow.*twitch.*channel/gim.test(taskName)) {
      taskInfo.push({ name: 'twitch', link })
    } else if (taskIcon.includes('reddit') || /subscribe.*subreddit/gim.test(taskName)) {
      taskInfo.push({ name: 'reddit', link })
    } else if (taskIcon.includes('vk') || /join.*vk.*group/gim.test(taskName)) {
      taskInfo.push({ name: 'vk', link })
    } else {
      if (/(Subscribe.*YouTube)|(Like.*YouTube)|(on twitter)|(Follow.*on.*Facebook)/gim.test(taskName)) {
        this.links.push(link)
      } else {
        if (/wishlist.*game|add.*wishlist/gim.test(taskName)) {
          taskInfo.push({ name: 'wGame', link })
        }
        if (/follow.*button/gim.test(taskName)) {
          taskInfo.push({ name: 'fGame', link })
        }
      }
      if (taskInfo.length === 0) return [{ name: 'nonSteam' }]
    }
    return taskInfo
  },
  getFinalUrl (e) {
    // 处理任务链接
    const [status, pro] = [fuc.echoLog({ type: 'custom', text: `<li>${getI18n('processTasksUrl')}<font></font></li>` }), []]

    for (const link of this.taskInfo.links) {
      pro.push(new Promise(resolve => {
        if (this.taskInfo.toFinalUrl[link]) {
          resolve({ result: 'success' })
        } else {
          fuc.getFinalUrl(resolve, link, {
            onload (response) {
              if (response.finalUrl.includes('newshub/app')) {
                const div = response.responseText.match(/<div id="application_config"[\w\W]*?>/)?.[0]
                if (!div) {
                  resolve({ result: 'success', finalUrl: response.finalUrl, url: link })
                  return
                }
                const appConfig = $(div)
                const { authwgtoken } = JSON.parse(appConfig.attr('data-userinfo'))
                const { clanAccountID } = JSON.parse(appConfig.attr('data-groupvanityinfo'))[0]
                resolve({ result: 'success', finalUrl: `${response.finalUrl}?authwgtoken=${authwgtoken}&clanid=${clanAccountID}`, url: link })
              } else {
                resolve({ result: 'success', finalUrl: response.finalUrl, url: link })
              }
            }
          })
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
      this.taskInfo = fuc.uniqueTaskInfo(this.taskInfo)
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
  async do_task (act) {
    /* disable
    if (globalConf.other.autoOpen && act === 'join' && this.links.length > 0) {
      for (const link of fuc.unique(this.links)) {
        window.open(link, '_blank')
      }
    }
    */
    if ($('div.bind-discord').is(':visible')) $('div.bind-discord a')[0].click()
    if ($('div.bind-twitch').is(':visible')) $('div.bind-twitch a')[0].click()
    const pro = []
    await new Promise(resolve => {
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
        if (this.conf[act][act === 'fuck' ? 'joinSteamGroup' : 'leaveSteamGroup'] && this.taskInfo.groups.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'group', elements: this.taskInfo.groups, resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
          }))
        }
        if (this.conf[act][act === 'fuck' ? 'followCurator' : 'unfollowCurator'] && this.taskInfo.curators.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'curator', elements: this.taskInfo.curators, resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
          }))
        }
        if (this.conf[act][act === 'fuck' ? 'followPublisher' : 'unfollowPublisher'] && this.taskInfo.publishers.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'publisher', elements: this.taskInfo.publishers, resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
          }))
        }
        if (this.conf[act][act === 'fuck' ? 'followDeveloper' : 'unfollowDeveloper'] && this.taskInfo.developers.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'developer', elements: this.taskInfo.developers, resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
          }))
        }
        if (this.conf[act][act === 'fuck' ? 'followFranchise' : 'unfollowFranchise'] && this.taskInfo.franchises.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'franchise', elements: this.taskInfo.franchises, resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
          }))
        }
        if (this.conf[act][act === 'fuck' ? 'followGame' : 'unfollowGame'] && this.taskInfo.fGames.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'game', elements: this.taskInfo.fGames, resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
          }))
        }
        if (this.conf[act][act === 'fuck' ? 'addToWishlist' : 'removeFromWishlist'] && this.taskInfo.wGames.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'wishlist', elements: this.taskInfo.wGames, resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
          }))
        }
        if (act === 'fuck' && this.conf.fuck.likeAnnouncement && this.taskInfo.announcements.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'announcement', elements: this.taskInfo.announcements, resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
          }))
        }
      }
    }).catch(() => {})
    if (this.conf[act][act === 'fuck' ? 'joinDiscordServer' : 'leaveDiscordServer'] && this.taskInfo.discords.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ social: 'discord', website: 'giveawaysu', elements: this.taskInfo.discords, resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl, toGuild: this.taskInfo.toGuild })
      }).then(data => {
        if (act === 'fuck') {
          for (const e of data) {
            const [inviteId, guild] = e.guild || [null, null]
            this.taskInfo.toGuild[inviteId] = guild
          }
          GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
        }
      }))
    }
    if (this.conf[act][act === 'fuck' ? 'followIns' : 'unfollowIns'] && this.taskInfo.instagrams.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ social: 'ins', website: 'giveawaysu', elements: this.taskInfo.instagrams, resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
      }))
    }
    if (this.conf[act][act === 'fuck' ? 'followTwitchChannel' : 'unfollowTwitchChannel'] && this.taskInfo.twitchs.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ social: 'twitch', website: 'giveawaysu', elements: this.taskInfo.twitchs, resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
      }))
    }
    if (this.conf[act][act === 'fuck' ? 'joinReddit' : 'leaveReddit'] && this.taskInfo.reddits.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ social: 'reddit', website: 'giveawaysu', elements: this.taskInfo.reddits, resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
      }))
    }
    if (this.conf[act][act === 'fuck' ? 'joinVk' : 'leaveVk'] && this.taskInfo.vks.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ social: 'vk', website: 'giveawaysu', elements: this.taskInfo.vks, resolve, action: act, toFinalUrl: this.taskInfo.toFinalUrl })
      }))
    }
    Promise.all(pro).finally(() => {
      fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
      if (act === 'fuck') fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('closeExtensions')}</font></li>` })
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
  checkLeft () {
    if ($('.giveaway-ended').length > 0) {
      Swal.fire({
        icon: 'warning',
        title: getI18n('notice'),
        text: getI18n('noKeysLeft'),
        confirmButtonText: getI18n('confirm'),
        cancelButtonText: getI18n('cancel'),
        showCancelButton: true
      }).then((result) => {
        if (result.value) {
          window.close()
        }
      })
    }
  },
  links: [], // 非steam任务
  taskInfo: {
    groups: [], // 任务需要加的组
    curators: [], // 任务需要关注的鉴赏家
    publishers: [], // 任务需要关注的发行商
    developers: [], // 任务需要关注的开发商
    franchises: [], // 任务需要关注的系列
    fGames: [], // 任务需要关注的游戏
    wGames: [], // 任务需要加愿望单的游戏
    announcements: [], // 任务需要点赞的通知
    discords: [], // 任务需要加入的discord服务器
    instagrams: [], // 任务需要关注的instagram用户
    twitchs: [], // 任务需要关注的twitch频道
    reddits: [], // 任务需要关注的subreddit
    vks: [], // 任务需要加入的vk组
    links: [], // 原始链接
    toFinalUrl: {}, // 链接转换
    toGuild: {}// discord 邀请链接转id
  },
  setting: {
    verify: {
      show: false
    }
  },
  conf: config?.giveawaysu?.enable ? config.giveawaysu : globalConf
}

export { giveawaysu }
