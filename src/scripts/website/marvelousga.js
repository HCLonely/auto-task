import { getI18n } from '../i18n'
import { fuc } from '../function/main'
import { config, globalConf, debug } from '../config'

const marvelousga = {
  test () { return window.location.host.includes('marvelousga') },
  before () { fuc.newTabBlock() },
  fuck () { this.get_tasks('do_task') },
  get_tasks (callback = 'do_task') {
    const taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
    if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory
    if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
      this.remove(true)
    } else {
      this.currentTaskInfo = fuc.clearTaskInfo(this.currentTaskInfo)
      const [
        status,
        tasksContainer
      ] = [
        fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` }),
        $('.container_task')
      ]

      for (const task of tasksContainer) { // 遍历任务信息
        const [
          taskDes,
          verifyBtn
        ] = [
          $(task).find('.card-body p.card-text.monospace'),
          $(task).find('button[id^=task_]:not(:contains(VERIFIED))')
        ]
        if (/join[\w\W]*?steamcommunity.com\/groups/gim.test(taskDes.html())) { // 加组任务
          const groupName = taskDes.find('a[href*="steamcommunity.com/groups"]').attr('href').match(/steamcommunity.com\/groups\/([\w\d\-_]*)/)[1]
          if (verifyBtn.length > 0) {
            this.currentTaskInfo.groups.push(groupName)
          }
          this.taskInfo.groups.push(groupName)
        }
        if (/follow[\w\W]*?store.steampowered.com\/curator/gim.test(taskDes.html())) { // 关注鉴赏家任务
          const curatorName = taskDes.find('a[href*="store.steampowered.com/curator"]').attr('href').match(/store.steampowered.com\/curator\/([\d]*)/)[1]
          if (verifyBtn.length > 0) {
            this.currentTaskInfo.curators.push(curatorName)
          }
          this.taskInfo.curators.push(curatorName)
        }
        if (/follow[\w\W]*?https?:\/\/twitter.com\//gim.test(taskDes.html())) { // 关注twitter
          const name = taskDes.find('a[href*="twitter.com"]').attr('href').match(/twitter.com\/([^/]+)/)?.[1]
          if (name) {
            if (verifyBtn.length > 0) {
              this.currentTaskInfo.twitterUsers.push(name)
            }
            this.taskInfo.twitterUsers.push(name)
          }
        }
        if (/follow[\w\W]*?https?:\/\/twitch.tv\//gim.test(taskDes.html())) { // 关注twitch
          const name = taskDes.find('a[href*="twitch.tv"]').attr('href').match(/twitch.tv\/([^/]+)/)?.[1]
          if (name) {
            if (verifyBtn.length > 0) {
              this.currentTaskInfo.twitchChannels.push(name)
            }
            this.taskInfo.twitchChannels.push(name)
          }
        }
        if (/visit.*?this.*?page/gim.test(taskDes.text()) && verifyBtn.length > 0) { // 浏览页面任务
          const pageUrl = taskDes.find('a[id^="task_webpage_clickedLink"]').attr('href')
          this.currentTaskInfo.links.push({ pageUrl: pageUrl, taskId: verifyBtn.attr('id').split('_')[3] })
        }
        if (verifyBtn.length > 0) { // 任务验证信息
          const ids = verifyBtn.attr('id').split('_')
          const [, provider, taskRoute, taskId] = ids
          this.currentTaskInfo.tasks.push({ provider, taskRoute, taskId, taskDes: taskDes.html() })
        }
      }
      this.currentTaskInfo = fuc.uniqueTaskInfo(this.currentTaskInfo)
      this.taskInfo = fuc.uniqueTaskInfo(this.taskInfo)
      GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
      status.success()
      if (debug) console.log(this)
      if (callback === 'do_task') {
        if (this.currentTaskInfo.tasks.length === 0) {
          fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
          if (this.conf.fuck.verifyTask) this.verify()
        } else {
          this.do_task()
        }
      } else if (callback === 'verify') {
        this.currentTaskInfo.tasks.length > 0 ? this.verify(true) : fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('verifyTasksComplete')}</font></li>` })
      } else {
        !fuc.isEmptyObjArr(this.taskInfo) ? this.remove(true) : fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('cannotRemove')}</font></li>` })
      }
    }
  },
  async do_task () {
    const pro = await this.toggleActions('fuck')
    const links = fuc.unique(this.currentTaskInfo.links)
    if (this.conf.fuck.visitLink) {
      for (const link of links) {
        pro.push(new Promise(resolve => {
          fuc.visitLink(resolve, link.pageUrl, {
            url: '/ajax/verifyTasks/webpage/clickedLink',
            method: 'POST',
            headers: {
              'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
            },
            data: $.param({
              giveaway_slug: this.get_giveawayId(),
              giveaway_task_id: link.taskId
            })
          })
        }))
      }
    }
    Promise.all(pro).finally(() => {
      fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
      if (this.conf.fuck.verifyTask) this.verify()
    })
  },
  verify (verify = false) {
    if (verify) {
      const pro = []
      for (const task of fuc.unique(this.currentTaskInfo.tasks)) {
        const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('verifyingTask')}${task.taskDes}...<font></font></li>` })
        pro.push(new Promise(resolve => {
          fuc.httpRequest({
            url: '/ajax/verifyTasks/' + task.provider + '/' + task.taskRoute,
            method: 'POST',
            dataType: 'json',
            headers: {
              'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
            },
            data: $.param({
              giveaway_slug: this.get_giveawayId(),
              giveaway_task_id: task.taskId
            }),
            onload (response) {
              if (debug) console.log(response)
              if (response.status === 200) {
                if (response.response.status === 1) {
                  $(`#task_${task.provider}_${task.taskRoute}_${task.taskId}`).text('VERIFIED')
                  status.success(response.response.percentageNanoBar.toFixed(2) + '%')
                  resolve({ result: 'success', statusText: response.statusText, status: response.status })
                } else {
                  status.error('Error:' + (response.response.message || 'error'))
                  if (globalConf.other.autoOpen) {
                    if (/Visit[\w\W]*?this[\w\W]*?webpage/gim.test(task.taskDes)) {
                      $(`task_webpage_clickedLink_${task.taskId}`).click()
                    } else {
                      window.open($(`<div>${task.taskDes}</div>`).find('a').attr('href'), '_blank')
                    }
                  }
                  resolve({ result: 'error', statusText: response.statusText, status: response.status })
                }
              } else {
                status.error('Error:' + (response.response.message || response.statusText || response.status))
                if (globalConf.other.autoOpen) {
                  if (/Visit[\w\W]*?this[\w\W]*?webpage/gim.test(task.taskDes)) {
                    $(`task_webpage_clickedLink_${task.taskId}`).click()
                  } else {
                    window.open($(`<div>${task.taskDes}</div>`).find('a').attr('href'), '_blank')
                  }
                }
                resolve({ result: 'error', statusText: response.statusText, status: response.status })
              }
            },
            r: resolve,
            status
          })
        }))
      }
      Promise.all(pro).finally(() => {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('verifyTasksComplete')}</font><font class="warning">${getI18n('doYourself')}<a class="hclonely-google" href="javascript:void(0)" target="_self">${getI18n('googleVerify')}</a>${getI18n('getKey')}!</font></li>` })
        $('#get_key_container').show()
        $('.hclonely-google').unbind().click(() => { $('#get_key_container')[0].scrollIntoView() })
      })
    } else {
      this.get_tasks('verify')
    }
  },
  async remove (remove = false) {
    if (remove) {
      const pro = await this.toggleActions('remove')
      Promise.all(pro).finally(() => {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
      })
    } else {
      this.get_tasks('remove')
    }
  },
  async toggleActions (action) {
    const pro = []
    const fuck = action === 'fuck'
    const taskInfo = fuck ? this.currentTaskInfo : this.taskInfo
    await fuc.updateInfo(taskInfo)
    const { groups, curators, twitterUsers, twitchChannels } = taskInfo
    if (this.conf[action][fuck ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'marvelousga', type: 'group', elements: groups, resolve, action })
      }))
    }
    if (this.conf[action][fuck ? 'followCurator' : 'unfollowCurator'] && curators.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'marvelousga', type: 'curator', elements: curators, resolve, action })
      }))
    }
    if (this.conf[action][fuck ? 'followTwitterUser' : 'unfollowTwitterUser'] && twitterUsers.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'marvelousga', social: 'twitter', type: 'follow', elements: twitterUsers, resolve, action })
      }))
    }
    if (this.conf[action][fuck ? 'followTwitchChannel' : 'unfollowTwitchChannel'] && twitchChannels.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'marvelousga', social: 'twitch', elements: twitchChannels, resolve, action })
      }))
    }
    return pro
    /* disable
    const wishlists = action === 'fuck' ? this.wishlists : this.taskInfo.wishlists
    const fGames = action === 'fuck' ? this.fGames : this.taskInfo.fGames
    if (this.conf[action][action === 'fuck' ? 'addToWishlist' : 'removeFromWishlist'] && wishlists.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'marvelousga', type: 'wishlist', elements: wishlists, resolve, action })
      }))
    }
    if (this.conf[action][action === 'fuck' ? 'followGame' : 'unfollowGame'] && fGames.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'marvelousga', type: 'game', elements: fGames, resolve, action })
      }))
    }
    */
  },
  get_giveawayId () {
    return $('#giveawaySlug').val() || window.location.href
  },
  checkLogin () {
    if ($('a[href*=login]').length > 0) window.open('/login', '_self')
  },
  checkLeft () {
    if ($('h3.text-danger:contains(this giveaway is closed)').length > 0) {
      $('#link_to_click').remove()
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
  currentTaskInfo: {
    groups: [],
    curators: [],
    twitterUsers: [],
    twitchChannels: [],
    links: [],
    tasks: []
  },
  taskInfo: {
    groups: [],
    curators: [],
    twitterUsers: [],
    twitchChannels: []
  },
  setting: {},
  conf: config?.marvelousga?.enable ? config.marvelousga : globalConf
}

export { marvelousga }
