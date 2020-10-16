import { getI18n } from '../i18n'
import { fuc, throwError } from '../function/main'
import { config, globalConf, debug } from '../config'

const gamehag = {
  test () {
    try {
      return window.location.host === 'gamehag.com'
    } catch (e) {
      throwError(e, 'gamehag.test')
    }
  },
  before () {
    try {
      $('#getkey').removeAttr('disabled')
      if (globalConf.other.reCaptcha) $('body').append('<script>window.bannedCountries=["a"];window.geo="a";window.respCaptch="";window.isSolveMediaCaptcha=false;window.moneytizergeo="a";</script>')
    } catch (e) {
      throwError(e, 'gamehag.before')
    }
  },
  fuck () {
    try {
      this.get_tasks('do_task')
    } catch (e) {
      throwError(e, 'gamehag.fuck')
    }
  },
  get_tasks (callback = 'do_task') {
    try {
      const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` })
      const verifyBtns = $('button[data-id]')
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
              pro.push(fuc.getFinalUrl(taskUrl)
                .then(({ result, finalUrl }) => {
                  if (result === 'Success') {
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
                }))
            }
            this.currentTaskInfo.tasks.push({ taskId, taskDes })
          }
        }
        if ($('a.giveaway-survey').length > 0) {
          const taskId = $('a.giveaway-survey').attr('data-task_id')
          const taskDes = 'Complete the survey'
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
          const taskId = $(btn).attr('data-id')

          const taskDes = $(btn).parent().prev().text()
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
        if (['remove', 'do_task', 'verify'].includes(callback)) {
          fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        } else {
          fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('unknown')}！</font></li>` })
        }
      }
      if (debug) console.log(this)
    } catch (e) {
      throwError(e, 'gamehag.get_tasks')
    }
  },
  async do_task () {
    try {
      const pro = []
      const tasks = fuc.unique(this.currentTaskInfo.tasks)
      for (const task of tasks) {
        pro.push(fuc.visitLink('/giveaway/click/' + task.taskId, { headers: { 'x-csrf-token': $('meta[name="csrf-token"]').attr('content') } }))
        await fuc.delay(500)
        if (/play.*?games/gim.test(task.taskDes)) {
          pro.push(fuc.visitLink('/games', { headers: { 'x-csrf-token': $('meta[name="csrf-token"]').attr('content') } }))
          await fuc.delay(500)
          pro.push(fuc.visitLink('/games/war-thunder/play', { headers: { 'x-csrf-token': $('meta[name="csrf-token"]').attr('content') } }))
        }
        await fuc.delay(1000)
      }
      Promise.all(pro).finally(async () => {
        await this.toggleActions('fuck')
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        if (this.conf.fuck.verifyTask) this.verify()
      })
    } catch (e) {
      throwError(e, 'gamehag.do_task')
    }
  },
  async verifyTask (task) {
    const logStatus = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('verifyingTask')}<a href="/giveaway/click/${task.taskId}" target="_blank">${task.taskDes.trim()}</a>...<font></font></li>` })
    const { result, statusText, status, data } = await fuc.httpRequest({
      url: '/api/v1/giveaway/sendtask',
      method: 'POST',
      dataType: 'json',
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
      },
      data: 'task_id=' + task.taskId
    })
    if (result === 'Success') {
      if (data.response) {
        if (data.response.status === 'success') {
          logStatus.success()
          $(`div.task-reward[href="#task-${task.taskId}-collapse"]`).html('<svg class="nc-icon nc-align-to-text grid-24 glyph"><use xlink:href="/icons/nci-fill.svg#nc-icon-check-simple" /></svg>')
        } else {
          logStatus.error('Error:' + (data.response.message || data.statusText || data.status || 'error'))
          if (globalConf.other.autoOpen) window.open(`/giveaway/click/${task.taskId}`, '_blank')
        }
      } else {
        logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
      }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
    }
  },
  async verify (verify = false) {
    try {
      if (verify) {
        const pro = []
        const tasks = fuc.unique(this.currentTaskInfo.tasks)
        for (const task of tasks) {
          pro.push(this.verifyTask(task))
          await fuc.delay(1000)
        }
        Promise.all(pro).finally(() => {
          fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('verifyTasksComplete')}</font></li>` })
        })
      } else {
        this.get_tasks('verify')
      }
    } catch (e) {
      throwError(e, 'gamehag.verify')
    }
  },
  async remove (remove = false) {
    try {
      if (remove) {
        await this.toggleActions('remove')
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
      } else {
        this.get_tasks('remove')
      }
    } catch (e) {
      throwError(e, 'gamehag.remove')
    }
  },
  async toggleActions (action) {
    try {
      const fuck = action === 'fuck'
      const taskInfo = fuck ? this.currentTaskInfo : this.taskInfo
      await fuc.updateInfo(taskInfo)
      await fuc.assignment(taskInfo, this.conf[action], action, 'gamehag')
    } catch (e) {
      throwError(e, 'gamehag.toggleActions')
    }
  },
  get_giveawayId () {
    try {
      return window.location.href.match(/\/giveaway\/([\d]+)/)?.[1] || window.location.href
    } catch (e) {
      throwError(e, 'gamehag.get_giveawayId')
    }
  },
  checkLeft () {
    try {
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
    } catch (e) {
      throwError(e, 'gamehag.checkLeft')
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
  conf: config?.gamehag?.enable ? config.gamehag : globalConf
}

export { gamehag }
