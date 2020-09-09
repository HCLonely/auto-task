import { getI18n } from '../i18n'
import { fuc } from '../function/main'
import { config, globalConf, debug } from '../config'

const gamehag = {
  test () { return window.location.host.includes('gamehag') },
  before () {
    $('#getkey').removeAttr('disabled')
    if (globalConf.other.reCaptcha) $('body').append('<script>window.bannedCountries = ["en"];window.geo ="en";window.respCaptch="";window.isSolveMediaCaptcha =false;</script>')
  },
  fuck () { this.get_tasks('do_task') },
  get_tasks (callback = 'do_task') {
    const [
      status,
      verifyBtns
    ] = [
      fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` }),
      $('button[data-id]')
    ]
    const taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
    if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory
    if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
      status.success()
      this.remove(true)
    } else if (callback === 'do_task') {
      this.currentTaskInfo = fuc.clearTaskInfo(this.currentTaskInfo)
      const pro = []
      for (const btn of verifyBtns) {
        const [taskId, taskDes, taskIcon, taskUrl] = [$(btn).attr('data-id'), $(btn).parent().prev().text(), $(btn).parent().parent().prev().find('use').attr('xlink:href') || '', $(btn).parent().find('a:contains("to do")').attr('href')]
        if ($(btn).parents('.task-content').next().text().includes('+1')) {
          const isSteamGroup = taskIcon.includes('steam') && /join.*?steam.*?group/gim.test(taskDes)
          const isTwitterUser = taskIcon.includes('twitter') && /follow/gim.test(taskDes)
          const isRetweet = taskIcon.includes('twitter') && /retweet/gim.test(taskDes)
          if (isSteamGroup || isTwitterUser || isRetweet) {
            pro.push(new Promise(resolve => {
              new Promise(resolve => {
                fuc.getFinalUrl(resolve, taskUrl)
              }).then(({ result, finalUrl }) => {
                if (result === 'success') {
                  const groupName = finalUrl?.match(/groups\/(.+)\/?/)?.[1]
                  const userName = finalUrl?.match(/https:\/\/twitter.com\/(.+)/)?.[1]
                  const tweetId = finalUrl?.match(/https:\/\/twitter.com\/.*?\/status\/([\d]+)/)?.[1]
                  if (isSteamGroup && groupName) {
                    this.currentTaskInfo.groups.push(groupName)
                    this.taskInfo.groups.push(groupName)
                  } else if (isTwitterUser && userName) {
                    this.currentTaskInfo.twitterUsers.push(userName)
                    this.taskInfo.twitterUsers.push(userName)
                  } else if (isRetweet && tweetId) {
                    this.currentTaskInfo.retweets.push(tweetId)
                    this.taskInfo.retweets.push(tweetId)
                  }
                }
              }).catch(error => {
                if (debug) console.error(error)
              }).finally(() => {
                resolve(1)
              })
            }))
          }
          this.currentTaskInfo.tasks.push({ taskId, taskDes })
        }
      }
      if ($('a.giveaway-survey').length > 0) {
        const [taskId, taskDes] = [$('a.giveaway-survey').attr('data-task_id'), 'Complete the survey']
        this.currentTaskInfo.tasks.push({ taskId, taskDes })
      }

      Promise.all(pro).finally(() => {
        this.currentTaskInfo = fuc.uniqueTaskInfo(this.currentTaskInfo)
        this.taskInfo = fuc.uniqueTaskInfo(this.taskInfo)
        status.success()
        GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
        if (this.currentTaskInfo.tasks.length > 0) {
          this.do_task()
        } else {
          fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
          if (this.conf.fuck.verifyTask) this.verify()
        }
      })
    } else if (callback === 'verify') {
      this.currentTaskInfo.tasks = []
      for (const btn of verifyBtns) {
        const [taskId, taskDes] = [$(btn).attr('data-id'), $(btn).parent().prev().text()]
        if ($(btn).parents('.task-content').next().text().includes('+1')) this.currentTaskInfo.tasks.push({ taskId, taskDes })
      }
      this.currentTaskInfo.tasks = fuc.unique(this.currentTaskInfo.tasks)
      if (this.currentTaskInfo.tasks.length > 0) {
        this.verify(true)
      } else {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('verifyTasksComplete')}</font></li>` })
      }
      status.success()
    } else {
      status.success()
      fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('unknown')}！</font></li>` })
    }
    if (debug) console.log(this)
  },
  async do_task () {
    const [pro, tasks] = [[], fuc.unique(this.currentTaskInfo.tasks)]
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i]
      pro.push(new Promise(resolve => {
        fuc.visitLink(resolve, '/giveaway/click/' + task.taskId, { headers: { 'x-csrf-token': $('meta[name="csrf-token"]').attr('content') } })
      }))
      if (/play.*?games/gim.test(task.taskDes)) {
        pro.push(new Promise(resolve => {
          fuc.visitLink(resolve, '/games', { headers: { 'x-csrf-token': $('meta[name="csrf-token"]').attr('content') } })
        }))
        pro.push(new Promise(resolve => {
          fuc.visitLink(resolve, '/games/war-thunder/play', { headers: { 'x-csrf-token': $('meta[name="csrf-token"]').attr('content') } })
        }))
      }
      await new Promise(resolve => {
        setTimeout(() => { resolve() }, 1000)
      })
    }
    Promise.all(pro).finally(async () => {
      const pro = await this.toggleActions('fuck')
      Promise.all(pro).finally(() => {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        if (this.conf.fuck.verifyTask) this.verify()
      })
    })
  },
  async verify (verify = false) {
    if (verify) {
      const [pro, tasks] = [[], fuc.unique(this.currentTaskInfo.tasks)]
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i]
        const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('verifyingTask')}<a href="/giveaway/click/${task.taskId}" target="_blank">${task.taskDes.trim()}</a>...<font></font></li>` })
        pro.push(new Promise(resolve => {
          fuc.httpRequest({
            url: '/api/v1/giveaway/sendtask',
            method: 'POST',
            dataType: 'json',
            headers: {
              'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
            },
            data: 'task_id=' + task.taskId,
            onload (response) {
              if (debug) console.log(response)
              if (response.response) {
                if (response.response.status === 'success') {
                  status.success()
                  $(`div.task-reward[href="#task-${task.taskId}-collapse"]`).html('<svg class="nc-icon nc-align-to-text grid-24 glyph"><use xlink:href="/icons/nci-fill.svg#nc-icon-check-simple" /></svg>')
                  resolve({ result: 'success', statusText: response.statusText, status: response.status })
                } else {
                  status.error('Error:' + (response.response.message || response.statusText || response.status || 'error'))
                  if (globalConf.other.autoOpen) window.open(`/giveaway/click/${task.taskId}`, '_blank')
                  resolve({ result: 'error', statusText: response.statusText, status: response.status })
                }
              } else {
                status.error('Error:' + response.statusText)
                resolve({ result: 'error', statusText: response.statusText, status: response.status })
              }
            },
            r: resolve,
            status
          })
        }))
        await new Promise(resolve => {
          setTimeout(() => { resolve() }, 1000)
        })
      }
      Promise.all(pro).finally(() => {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('verifyTasksComplete')}</font></li>` })
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
    const { groups, curators, twitterUsers, retweets } = taskInfo
    if (this.conf[action][fuck ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'gamehag', type: 'group', elements: groups, resolve, action })
      }))
    }
    if (this.conf[action][fuck ? 'followCurator' : 'unfollowCurator'] && curators.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'gamehag', type: 'curator', elements: curators, resolve, action })
      }))
    }
    if (this.conf[action][fuck ? 'followTwitterUser' : 'unfollowTwitterUser'] && twitterUsers.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'gamehag', social: 'twitter', type: 'follow', elements: twitterUsers, resolve, action })
      }))
    }
    if (this.conf[action][fuck ? 'retweet' : 'unretweet'] && retweets.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'gamehag', social: 'twitter', type: 'retweet', elements: retweets, resolve, action })
      }))
    }
    return pro
    /* disable
    if (this.conf[action][fuck ? 'addToWishlist' : 'removeFromWishlist'] && wishlists.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'banana', type: 'wishlist', elements: wishlists, resolve, action })
      }))
    }
    if (this.conf[action][fuck ? 'followGame' : 'unfollowGame'] && fGames.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'banana', type: 'game', elements: fGames, resolve, action })
      }))
    }
    */
  },
  get_giveawayId () {
    return window.location.href.match(/\/giveaway\/([\d]+)/)?.[1] || window.location.href
  },
  checkLeft () {
    if ($('.giveaway-counter:first .strong').text() === '0') {
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
    retweets: [],
    tasks: []
  },
  taskInfo: {
    groups: [],
    curators: [],
    twitterUsers: [],
    retweets: []
  },
  setting: {},
  conf: config?.gamehag?.enable.valueOf() ? config.gamehag : globalConf
}

export { gamehag }
