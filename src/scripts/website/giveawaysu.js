import { getI18n } from '../i18n'
import { fuc } from '../function/main'
import { config, globalConf, debug } from '../config'

const giveawaysu = {
  test () { return window.location.host.includes('giveaway.su') },
  get_tasks (e) { // 获取任务信息
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
        const td = $(task).find('td:not(".hidden")')
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
  getFinalUrl (e) { // 处理任务链接
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
  async do_task (action) {
    /* disable
    if (globalConf.other.autoOpen && act === 'join' && this.links.length > 0) {
      for (const link of fuc.unique(this.links)) {
        window.open(link, '_blank')
      }
    }
    */
    if ($('div.bind-discord').is(':visible')) $('div.bind-discord a')[0].click()
    if ($('div.bind-twitch').is(':visible')) $('div.bind-twitch a')[0].click()
    const {
      groups,
      curators,
      publishers,
      developers,
      franchises,
      fGames,
      wGames,
      announcements,
      discords,
      instagrams,
      twitchs,
      reddits,
      vks,
      toFinalUrl,
      toGuild
    } = this.taskInfo
    const pro = []
    const fuck = action === 'fuck'
    await new Promise(resolve => {
      if (groups.length > 0 || announcements.length > 0) {
        if (curators.length > 0 || publishers.length > 0 || developers.length > 0 || fGames.length > 0 || wGames.length > 0) {
          fuc.updateSteamInfo(resolve, 'all')
        } else {
          fuc.updateSteamInfo(resolve, 'community')
        }
      } else if (curators.length > 0 || publishers.length > 0 || developers.length > 0 || fGames.length > 0 || wGames.length > 0) {
        fuc.updateSteamInfo(resolve, 'store')
      } else {
        resolve(1)
      }
    }).then(s => {
      if (s === 1) {
        if (this.conf[action][fuck ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'group', elements: groups, resolve, action, toFinalUrl })
          }))
        }
        if (this.conf[action][fuck ? 'followCurator' : 'unfollowCurator'] && curators.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'curator', elements: curators, resolve, action, toFinalUrl })
          }))
        }
        if (this.conf[action][fuck ? 'followPublisher' : 'unfollowPublisher'] && publishers.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'publisher', elements: publishers, resolve, action, toFinalUrl })
          }))
        }
        if (this.conf[action][fuck ? 'followDeveloper' : 'unfollowDeveloper'] && developers.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'developer', elements: developers, resolve, action, toFinalUrl })
          }))
        }
        if (this.conf[action][fuck ? 'followFranchise' : 'unfollowFranchise'] && franchises.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'franchise', elements: franchises, resolve, action, toFinalUrl })
          }))
        }
        if (this.conf[action][fuck ? 'followGame' : 'unfollowGame'] && fGames.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'game', elements: fGames, resolve, action, toFinalUrl })
          }))
        }
        if (this.conf[action][fuck ? 'addToWishlist' : 'removeFromWishlist'] && wGames.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'wishlist', elements: wGames, resolve, action, toFinalUrl })
          }))
        }
        if (fuck && this.conf.fuck.likeAnnouncement && announcements.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'giveawaysu', type: 'announcement', elements: announcements, resolve, action, toFinalUrl })
          }))
        }
      }
    }).catch(() => {})
    if (this.conf[action][fuck ? 'joinDiscordServer' : 'leaveDiscordServer'] && discords.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ social: 'discord', website: 'giveawaysu', elements: discords, resolve, action, toFinalUrl, toGuild })
      }).then(data => {
        if (fuck) {
          for (const e of data) {
            const [inviteId, guild] = e.guild || [null, null]
            toGuild[inviteId] = guild
          }
          GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
        }
      }))
    }
    if (this.conf[action][fuck ? 'followIns' : 'unfollowIns'] && instagrams.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ social: 'ins', website: 'giveawaysu', elements: instagrams, resolve, action, toFinalUrl })
      }))
    }
    if (this.conf[action][fuck ? 'followTwitchChannel' : 'unfollowTwitchChannel'] && twitchs.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ social: 'twitch', website: 'giveawaysu', elements: twitchs, resolve, action, toFinalUrl })
      }))
    }
    if (this.conf[action][fuck ? 'joinReddit' : 'leaveReddit'] && reddits.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ social: 'reddit', website: 'giveawaysu', elements: reddits, resolve, action, toFinalUrl })
      }))
    }
    if (this.conf[action][fuck ? 'joinVk' : 'leaveVk'] && vks.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ social: 'vk', website: 'giveawaysu', elements: vks, resolve, action, toFinalUrl })
      }))
    }
    Promise.all(pro).finally(() => {
      fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
      if (fuck) fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('closeExtensions')}</font></li>` })
    })
  },
  fuck () { this.get_tasks('doTask') },
  verify () { },
  remove () { this.get_tasks('remove') },
  get_giveawayId () {
    return window.location.href.match(/view\/([\d]+)/)?.[1] || window.location.href
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
      }).then(({ value }) => {
        if (value) {
          window.close()
        }
      })
    }
  },
  taskInfo: {
    groups: [],
    curators: [],
    publishers: [],
    developers: [],
    franchises: [],
    fGames: [],
    wGames: [],
    announcements: [],
    discords: [],
    instagrams: [],
    twitchs: [],
    reddits: [],
    vks: [],
    links: [],
    toFinalUrl: {},
    toGuild: {}
  },
  setting: {
    verify: {
      show: false
    }
  },
  conf: config?.giveawaysu?.enable ? config.giveawaysu : globalConf
}

export { giveawaysu }
