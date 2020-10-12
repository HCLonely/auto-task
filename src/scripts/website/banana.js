import { getI18n } from '../i18n'
import { fuc, throwError } from '../function/main'
import { config, globalConf, debug } from '../config'

const banana = {
  test () {
    try {
      return (window.location.host.includes('grabfreegame') || window.location.host.includes('bananagiveaway'))
    } catch (e) {
      throwError(e, 'banana.test')
    }
  },
  fuck () {
    try {
      const needBanana = $("p:contains('Collect'):contains('banana')")
      const needPoints = $("p:contains('Collect'):contains('point')")
      let msg = ''
      if (needBanana.length > 0) msg = getI18n('needBanana', needBanana.text().match(/[\d]+/gim)[0])
      if (needPoints.length > 0) msg = getI18n('needPoints', needPoints.text().replace(/Collect/gi, ''))
      if (needPoints.length > 0 || needBanana.length > 0) {
        Swal.fire({
          icon: 'warning',
          title: getI18n('notice'),
          text: msg,
          confirmButtonText: getI18n('confirm'),
          cancelButtonText: getI18n('cancel'),
          showCancelButton: true
        }).then(({ value }) => {
          if (value) {
            this.get_tasks('do_task')
          }
        })
      } else {
        this.get_tasks('do_task')
      }
    } catch (e) {
      throwError(e, 'banana.fuck')
    }
  },
  get_tasks (callback = 'do_task') {
    try {
      const taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
      if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory
      if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
        this.remove(true)
      } else {
        this.currentTaskInfo = fuc.clearTaskInfo(this.currentTaskInfo)
        const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('processTasksInfo')}<font></font></li>` })
        const tasksUl = $('ul.tasks li:not(:contains(Completed))')
        const pro = []
        for (const task of tasksUl) {
          const taskDes = $(task).find('p')
          const verifyBtn = $(task).find('button:contains(Verify)')
          const taskId = verifyBtn.attr('onclick')?.match(/\?verify=([\d]+)/)?.[1]
          if (taskId) {
            this.currentTaskInfo.tasks.push({ taskId, taskDes: taskDes.text() })
            if (/join.*?steam.*?group/gim.test(taskDes.text())) {
              pro.push(fuc.getFinalUrl(window.location.origin + window.location.pathname + '?q=' + taskId)
                .then(({ result, finalUrl }) => {
                  if (result === 'Success') {
                    const groupName = finalUrl.match(/groups\/(.+)\/?/)?.[1]
                    if (groupName) {
                      this.currentTaskInfo.groups.push(groupName)
                      this.taskInfo.groups.push(groupName)
                    } else {
                      this.currentTaskInfo.taskIds.push(taskId)
                    }
                  } else {
                    this.currentTaskInfo.taskIds.push(taskId)
                  }
                }))
            } else if (/follow.*?curator/gim.test(taskDes.text())) {
              pro.push(fuc.getFinalUrl(window.location.origin + window.location.pathname + '?q=' + taskId)
                .then(({ result, finalUrl }) => {
                  if (result === 'Success') {
                    const curatorId = finalUrl.match(/curator\/([\d]+)/)?.[1]
                    if (curatorId) {
                      this.currentTaskInfo.curators.push(curatorId)
                      this.taskInfo.curators.push(curatorId)
                    } else {
                      this.currentTaskInfo.taskIds.push(taskId)
                    }
                  } else {
                    this.currentTaskInfo.taskIds.push(taskId)
                  }
                }))
            } else if (/wishlist/gim.test(taskDes.text())) {
              pro.push(fuc.getFinalUrl(window.location.origin + window.location.pathname + '?q=' + taskId)
                .then(({ result, finalUrl }) => {
                  if (result === 'Success') {
                    const appId = finalUrl.match(/store.steampowered.com\/app\/([\d]+)/)?.[1]
                    if (appId) {
                      this.currentTaskInfo.wishlists.push(appId)
                      this.taskInfo.wishlists.push(appId)
                    } else {
                      this.currentTaskInfo.taskIds.push(taskId)
                    }
                  } else {
                    this.currentTaskInfo.taskIds.push(taskId)
                  }
                }))
            } else if (/Retweet/gim.test(taskDes.text())) {
              pro.push(fuc.getFinalUrl(window.location.origin + window.location.pathname + '?q=' + taskId)
                .then(({ result, finalUrl }) => {
                  if (result === 'Success') {
                    const appId = finalUrl.match(/status\/([\d]+)/)?.[1]
                    if (appId) {
                      this.currentTaskInfo.retweets.push(appId)
                      this.taskInfo.retweets.push(appId)
                    } else {
                      this.currentTaskInfo.taskIds.push(taskId)
                    }
                  } else {
                    this.currentTaskInfo.taskIds.push(taskId)
                  }
                }))
            } else { // TODO: twitter & youtube
              if (/(Subscribe.*channel)|(Twitter)|(Retweet)/gim.test(taskDes.text())) {
                if (!this.verifyBtn) this.verifyBtn = taskDes.parent().find('button:contains(Verify)')
                if (callback === 'do_task' && globalConf.other.autoOpen) {
                  taskDes.parent().find('button')[0].click()
                }
              }
              pro.push(new Promise(resolve => {
                this.currentTaskInfo.links.push(window.location.origin + window.location.pathname + '?q=' + taskId)
                this.currentTaskInfo.taskIds.push(taskId)
                resolve(1)
              }))
            }
          }
        }
        Promise.all(pro).finally(() => {
          this.currentTaskInfo = fuc.uniqueTaskInfo(this.currentTaskInfo)
          this.taskInfo = fuc.uniqueTaskInfo(this.taskInfo)
          GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
          status.success()
          if (debug) console.log(this)
          if (callback === 'do_task') {
            this.do_task()
          } else if (callback === 'verify') {
            this.currentTaskInfo.tasks.length > 0 ? this.verify(true) : fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
          } else {
            !fuc.isEmptyObjArr(this.taskInfo) ? this.remove(true) : fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('cannotRemove')}</font></li>` })
          }
        })
      }
    } catch (e) {
      throwError(e, 'banana.get_tasks')
    }
  },
  async do_task () {
    try {
      const pro = []
      pro.push(this.toggleActions('fuck'))
      const links = fuc.unique(this.currentTaskInfo.links)
      if (this.conf.fuck.visitLink) {
        for (const link of links) {
          pro.push(fuc.visitLink(link))
          await fuc.delay(1000)
        }
      }
      Promise.all(pro).finally(() => {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        if (this.conf.fuck.verifyTask) this.verify()
      })
    } catch (e) {
      throwError(e, 'banana.do_task')
    }
  },
  async verifyTask (task) {
    const logStatus = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('verifyingTask')}${task.taskDes}...<font></font></li>` })
    const { result, statusText, status } = await fuc.httpRequest({
      url: window.location.origin + window.location.pathname + '?verify=' + task.taskId,
      method: 'GET'
    })
    if (result === 'Success') {
      logStatus.warning('Complete')
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
    }
  },
  async verify (verify = false) {
    try {
      if (verify) {
        const pro = []
        for (const task of fuc.unique(this.currentTaskInfo.tasks)) {
          pro.push(this.verifyTask(task))
          await fuc.delay(500)
        }
        Promise.all(pro).finally(() => {
          fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('verifyTasksComplete')}</font></li>` })
          this.verifyBtn.length > 0 ? this.verifyBtn.removeAttr('disabled')[0].click() : window.location.reload(true)
        })
      } else {
        this.get_tasks('verify')
      }
    } catch (e) {
      throwError(e, 'banana.verify')
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
      throwError(e, 'banana.remove')
    }
  },
  async toggleActions (action) {
    try {
      const fuck = action === 'fuck'
      const taskInfo = fuck ? this.currentTaskInfo : this.taskInfo
      await fuc.updateInfo(taskInfo)
      await fuc.assignment(taskInfo, this.conf[action], action, 'banana')
    } catch (e) {
      throwError(e, 'banana.toggleActions')
    }
  },
  get_giveawayId () {
    try {
      return window.location.href.match(/\/giveaway\/([\w\d-]+)/)?.[1] || window.location.href
    } catch (e) {
      throwError(e, 'banana.get_giveawayId')
    }
  },
  checkLogin () {
    try {
      if ($('a.steam[title*=team]').length > 0) window.open('/giveaway/steam/', '_self')
    } catch (e) {
      throwError(e, 'banana.checkLogin')
    }
  },
  checkLeft () {
    try {
      if ($('.left b').text() === '0') {
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
      throwError(e, 'banana.checkLeft')
    }
  },
  verifyBtn: 0,
  currentTaskInfo: {
    links: [],
    groups: [],
    curators: [],
    wishlists: [],
    fGames: [],
    retweets: [],
    taskIds: [],
    tasks: []
  },
  taskInfo: {
    groups: [],
    curators: [],
    wishlists: [],
    fGames: [],
    retweets: []
  },
  setting: {},
  conf: config?.banana?.enable ? config.banana : globalConf
}

export { banana }
