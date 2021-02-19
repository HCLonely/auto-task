import { getI18n } from '../i18n'
import { fuc, throwError } from '../function/main'
import { config, globalConf, debug } from '../config'

const freeanywhere = {
  test () {
    try {
      return window.location.host === 'freeanywhere.net'
    } catch (e) {
      throwError(e, 'freeanywhere.test')
    }
  },
  before () {
    try {
      if (!/^https?:\/\/freeanywhere\.net\/#\/giveaway\/[\d]+/.test(window.location.href)) {
        const id = window.location.href.match(/https?:\/\/freeanywhere\.net\/.*?#\/giveaway\/([\d]+)/)?.[1]
        window.location.href = 'https://freeanywhere.net/#/giveaway/' + id
      }
    } catch (e) {
      throwError(e, 'freeanywhere.before')
    }
  },
  fuck () {
    try {
      this.get_tasks('do_task')
    } catch (e) {
      throwError(e, 'freeanywhere.fuck')
    }
  },
  async get_tasks (callback = 'do_task') {
    try {
      const logStatus = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` })
      const giveawayId = this.get_giveawayId()
      if (!/^[\d]+$/.test(giveawayId)) {
        return fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('getGiveawayIdFailed')}</font></li>` })//
      }
      this.giveawayId = giveawayId
      const taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + giveawayId + ']')
      if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory
      if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
        logStatus.success()
        this.remove(true)
      } else if (callback === 'do_task') {
        this.currentTaskInfo = fuc.clearTaskInfo(this.currentTaskInfo)
        const { result, statusText, status, data } = await fuc.httpRequest({
          url: `https://freeanywhere.net/api/v1/giveaway/${giveawayId}/?format=json`,
          method: 'get',
          responseType: 'json'
        })
        if (result === 'Success') {
          const taskInfo = data?.response
          if (taskInfo) {
            const tasks = taskInfo.challenges
            if (tasks) {
              for (const task of tasks) {
                if (task.is_success) continue
                const type = task.challenge
                const social = task.challenge_provider
                this.currentTaskInfo.tasks.push({ taskId: task.id, taskDes: task.title })
                switch (social) {
                  case 'steam':
                    switch (type) {
                      case 'WL':
                        this.currentTaskInfo.wGames.push(task.link.match(/app\/([\d]+)/)?.[1])
                        this.taskInfo.wGames.push(task.link.match(/app\/([\d]+)/)?.[1])
                        break
                      case 'JTG':
                        this.currentTaskInfo.groups.push(task.link.match(/groups\/([^/]*)/)?.[1])
                        this.taskInfo.groups.push(task.link.match(/groups\/([^/]*)/)?.[1])
                        break
                      case 'STC':
                        this.currentTaskInfo.curators.push(task.link.match(/curator\/([\d]+)/)?.[1])
                        this.taskInfo.curators.push(task.link.match(/curator\/([\d]+)/)?.[1])
                        break
                      case 'GF':
                        this.currentTaskInfo.fGames.push(task.link.match(/app\/([\d]+)/)?.[1])
                        this.taskInfo.fGames.push(task.link.match(/app\/([\d]+)/)?.[1])
                        break
                    }
                    break
                  case 'vk-oauth2':
                    switch (type) {
                      case 'SUB':
                      case 'SHARE':
                      case 'LIKE':
                        this.currentTaskInfo.vks.push(task.link.match(/vk\.com\/([^/]*)/)?.[1])
                        this.taskInfo.vks.push(task.link.match(/vk\.com\/([^/]*)/)?.[1])
                        break
                    }
                    break
                  case 'website':
                    break
                  default:
                    // unknown
                    break
                }
              }
              this.currentTaskInfo = fuc.uniqueTaskInfo(this.currentTaskInfo)
              this.taskInfo = fuc.uniqueTaskInfo(this.taskInfo)
              logStatus.success()
              GM_setValue('taskInfo[' + window.location.host + giveawayId + ']', this.taskInfo)
              if (this.currentTaskInfo.tasks.length > 0) {
                this.do_task()
              } else {
                fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
                if (this.conf.fuck.verifyTask) this.verify()
              }
            } else {
              logStatus.error()
              console.error(data)
            }
          } else {
            logStatus.error()
            console.error(data)
          }
        } else {
          logStatus.error(`${result}:${statusText}(${status})`)
        }
      } else if (callback === 'verify') {
        this.currentTaskInfo.tasks = []
        const { result, statusText, status, data } = await fuc.httpRequest({
          url: `https://freeanywhere.net/api/v1/giveaway/${giveawayId}/?format=json`,
          method: 'get',
          responseType: 'json'
        })
        if (result === 'Success') {
          const taskInfo = data?.response
          if (taskInfo) {
            const tasks = taskInfo.challenges
            if (tasks) {
              for (const task of tasks) {
                if (!task.is_success) this.currentTaskInfo.tasks.push({ taskId: task.id, taskDes: task.title })
              }
              this.currentTaskInfo.tasks = fuc.unique(this.currentTaskInfo.tasks)
              if (this.currentTaskInfo.tasks.length > 0) {
                this.verify(true)
              } else {
                fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('verifyTasksComplete')}</font></li>` })
              }
              logStatus.success()
            } else {
              logStatus.error()
              console.error(data)
            }
          } else {
            logStatus.error()
            console.error(data)
          }
        } else {
          logStatus.error(`${result}:${statusText}(${status})`)
        }
      } else {
        logStatus.success()
        if (['remove', 'do_task', 'verify'].includes(callback)) {
          fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        } else {
          fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('unknown')}！</font></li>` })
        }
      }
      if (debug) console.log(this)
    } catch (e) {
      throwError(e, 'freeanywhere.get_tasks')
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
      throwError(e, 'freeanywhere.do_task')
    }
  },
  async verifyTask (task) {
    const logStatus = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('verifyingTask')}${task.taskDes.trim()}...<font></font></li>` })
    const giveawayId = this.giveawayId || this.get_giveawayId()
    const { result, statusText, status, data } = await fuc.httpRequest({
      url: `https://freeanywhere.net/api/v1/giveaway/${giveawayId}/challenge-status/${task.taskId}/?format=json`,
      method: 'GET',
      dataType: 'json'
    })
    if (result === 'Success') {
      if (data?.response?.status) {
        logStatus.success()
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
          this.get_key()
        })
      } else {
        this.get_tasks('verify')
      }
    } catch (e) {
      throwError(e, 'freeanywhere.verify')
    }
  },
  async get_key () {
    const logStatus = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('gettingKey')}...<font></font></li>` })
    const giveawayId = this.giveawayId || this.get_giveawayId()
    const { result, statusText, status, data } = await fuc.httpRequest({
      url: `https://freeanywhere.net/api/v1/giveaway/${giveawayId}/reward/?format=json`,
      method: 'GET',
      dataType: 'json',
      headers: {
        authorization: `Token ${window.localStorage.getItem('token')}`
      }
    })
    if (result === 'Success') {
      if (data?.response?.reward) {
        logStatus.success()
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${data.response.reward}</font></li>` })
      } else {
        logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
      }
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
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
      throwError(e, 'freeanywhere.remove')
    }
  },
  async toggleActions (action) {
    try {
      const fuck = action === 'fuck'
      const taskInfo = fuck ? this.currentTaskInfo : this.taskInfo
      await fuc.updateInfo(taskInfo)
      await fuc.assignment(taskInfo, this.conf[action], action, 'freeanywhere')
    } catch (e) {
      throwError(e, 'freeanywhere.toggleActions')
    }
  },
  get_giveawayId () {
    try {
      return window.location.href.match(/\/giveaway\/([\d]+)/)?.[1] || window.location.href
    } catch (e) {
      throwError(e, 'freeanywhere.get_giveawayId')
    }
  },
  checkLogin () {
    try {
      if ($('a[href="#/login"]').length > 0) window.open('/#/login', '_self')
    } catch (e) {
      throwError(e, 'banana.checkLogin')
    }
  },
  currentTaskInfo: {
    groups: [],
    curators: [],
    wGames: [],
    fGames: [],
    vks: [],
    tasks: []
  },
  taskInfo: {
    groups: [],
    curators: [],
    wGames: [],
    fGames: [],
    vks: []
  },
  setting: {},
  conf: config?.freeanywhere?.enable ? config.freeanywhere : globalConf
}

export { freeanywhere }
