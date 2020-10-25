/* global VerifyTasks */
import { getI18n } from '../i18n'
import { fuc, throwError } from '../function/main'
import { config, globalConf, debug } from '../config'

const keyhub = {
  test () {
    try {
      return window.location.host === 'key-hub.eu'
    } catch (e) {
      throwError(e, 'keyhub.test')
    }
  },
  fuck () {
    try {
      $('#VPNoverlay').hide()
      $('#mainArticleSection').show()
      this.get_tasks('do_task')
    } catch (e) {
      throwError(e, 'keyhub.fuck')
    }
  },
  async get_tasks (callback = 'do_task') {
    try {
      const taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
      if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory
      if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
        this.remove(true)
      } else {
        this.currentTaskInfo = fuc.clearTaskInfo(this.currentTaskInfo)
        const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` })
        const tasks = $('.task a')
        const pro = []

        for (const task of tasks) {
          // this.currentTaskInfo.tasks.push(task)
          const link = $(task).attr('href')
          const taskDes = $(task).text().trim()

          if (/steamcommunity\.com\/gid\//.test(link) && /join/gim.test(taskDes)) {
            pro.push(fuc.getFinalUrl(link)
              .then(({ result, finalUrl }) => {
                if (result === 'Success') {
                  const groupName = finalUrl.match(/steamcommunity\.com\/groups\/([\w\d\-_]*)/)?.[1]
                  if (groupName) {
                    this.currentTaskInfo.groups.push(groupName)
                    this.taskInfo.groups.push(groupName)
                  }
                }
              }))
          } else if (/steamcommunity\.com\/groups\//.test(link) && /join/gim.test(taskDes)) {
            const groupName = link.match(/steamcommunity\.com\/groups\/([\w\d\-_]*)/)?.[1]
            if (groupName) {
              this.currentTaskInfo.groups.push(groupName)
              this.taskInfo.groups.push(groupName)
            }
          } else if (/store\.steampowered\.com\/app\//.test(link) && /wishlist/gim.test(taskDes)) {
            const gameId = link.match(/app\/([\d]+)/)?.[1]
            if (gameId) {
              this.currentTaskInfo.wGames.push(gameId)
              this.taskInfo.wGames.push(gameId)
            }
          } else if (/\/away\?data=.*/.test(link)) {
            this.currentTaskInfo.links.push(link)
          } else {
            fuc.echoLog({ type: 'custom', text: `<li>${getI18n('unknownTaskType', `${taskDes}(${link})`)}<font></font></li>` })
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
          } else {
            !fuc.isEmptyObjArr(this.taskInfo) ? this.remove(true) : fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('cannotRemove')}</font></li>` })
          }
        })
      }
    } catch (e) {
      throwError(e, 'keyhub.get_tasks')
    }
  },
  async do_task () {
    try {
      const pro = []
      pro.push(this.toggleActions('fuck'))
      const links = fuc.unique(this.currentTaskInfo.links)
      if (this.conf.fuck.visitLink) {
        for (const link of links) {
          pro.push(fuc.visitLink(link, { method: 'GET' }))
          await fuc.delay(1000)
        }
      }
      Promise.all(pro).finally(() => {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        if (this.conf.fuck.verifyTask) this.verify()
      })
    } catch (e) {
      throwError(e, 'keyhub.do_task')
    }
  },
  async verify () {
    try {
      fuc.echoLog({ type: 'custom', text: `<li>${getI18n('verifyingTask')}...<font></font></li>` })
      $.get(window.location.href, function (res) { VerifyTasks(res.match(/onclick="javascript:VerifyTasks\('(.*?)'\)"/)[1]) })
    } catch (e) {
      throwError(e, 'keyhub.verify')
    }
  },
  async toggleActions (action) {
    try {
      const fuck = action === 'fuck'
      const taskInfo = fuck ? this.currentTaskInfo : this.taskInfo
      await fuc.updateInfo(taskInfo)
      await fuc.assignment(taskInfo, this.conf[action], action, 'keyhub')
    } catch (e) {
      throwError(e, 'keyhub.toggleActions')
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
      throwError(e, 'keyhub.remove')
    }
  },
  get_giveawayId () {
    try {
      const id = window.location.href.match(/giveaway\/([\d]+)/)
      return id?.[1] || window.location.href
    } catch (e) {
      throwError(e, 'keyhub.get_giveawayId')
    }
  },
  checkLogin () {
    try {
      if ($('a[href="/connect/steam"]').length > 0) window.open('/connect/steam', '_self')
    } catch (e) {
      throwError(e, 'keyhub.checkLogin')
    }
  },
  checkLeft () {
    try {
      const leftKey = $('#keysleft').text().trim()
      if (leftKey === '0') {
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
      throwError(e, 'keyhub.checkLeft')
    }
  },
  currentTaskInfo: {
    links: [],
    groups: [],
    wGames: []
  },
  taskInfo: {
    groups: [],
    wGames: []
  },
  setting: {},
  conf: config?.keyhub?.enable ? config.keyhub : globalConf
}

export { keyhub }
