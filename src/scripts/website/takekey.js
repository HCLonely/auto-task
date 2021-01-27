import { getI18n } from '../i18n'
import { fuc, throwError } from '../function/main'
import { config, globalConf, debug } from '../config'

const takekey = {
  test () {
    try {
      return window.location.host === 'takekey.ru'
    } catch (e) {
      throwError(e, 'takekey.test')
    }
  },
  fuck () {
    try {
      this.get_tasks('do_task')
    } catch (e) {
      throwError(e, 'takekey.fuck')
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
        const tasksContainer = $('#usl>div')
        const pro = []

        for (const task of tasksContainer) {
          this.currentTaskInfo.tasks.push(task)
          const icon = $(task).find('i')
          const a = $(task).children('a[id]').attr('onclick', 'return false;')
          const link = a.attr('href')
          // const id = a.attr('id')
          // const taskDes = a.text().trim()
          a[0].click()
          a.removeAttr('onclick')
          if (icon.hasClass('fa-steam')) {
            if (link && /gid\/[\d]+/.test(link)) {
              pro.push(fuc.getFinalUrl(link)
                .then(({ result, finalUrl }) => {
                  if (result === 'Success') {
                    const groupName = finalUrl.match(/steamcommunity.com\/groups\/([\w\d\-_]*)/)?.[1]
                    if (groupName) {
                      this.currentTaskInfo.groups.push(groupName)
                      this.taskInfo.groups.push(groupName)
                    }
                  }
                }))
            }
          } else if (icon.hasClass('fa-link')) {
            /* disable
            pro.push(fuc.getFinalUrl(link)
              .then(({ result, finalUrl }) => {
                if (result === 'Success') {
                  if (finalUrl.includes('www.youtube.com/channel')) {
                    this.currentTaskInfo.youtubeChannels.push(finalUrl)
                    this.taskInfo.youtubeChannels.push(finalUrl)
                  } else if (finalUrl.includes('store.steampowered.com/app')) {
                    const gameId = finalUrl.match(/app\/([\d]+)/)?.[1]
                    if (gameId) {
                      if (/add to Wishlist/gim.test(taskDes)) {
                        this.currentTaskInfo.wGames.push(gameId)
                        this.taskInfo.wGames.push(gameId)
                      }
                    }
                  } else if (finalUrl.includes('twitter.com')) {
                    /*
                    const twitterUser = finalUrl.match(/https:\/\/twitter.com\/(.+)/)?.[1]
                    if (twitterUser) {
                      if (/follow/gim.test(taskDes)) {
                        this.currentTaskInfo.twitterUsers.push(twitterUser)
                        this.taskInfo.twitterUsers.push(twitterUser)
                      }
                    }
                  }
                }
              }))
            await fuc.delay(500)
                    */
            this.currentTaskInfo.links.push(link)
          } else if (icon.hasClass('fa-vk')) {
            const path = link.match(/https:\/\/vk.com\/([^/]+)/)?.[1]
            if (path) {
              this.currentTaskInfo.vks.push(path)
              this.taskInfo.vks.push(path)
            }
          } else {
            fuc.echoLog({ type: 'custom', text: `<li>${getI18n('unknownTaskType', `${icon}(${link})`)}<font></font></li>` })
          }
        }
        Promise.all(pro).finally(() => {
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
          } else {
            !fuc.isEmptyObjArr(this.taskInfo) ? this.remove(true) : fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('cannotRemove')}</font></li>` })
          }
        })
      }
    } catch (e) {
      throwError(e, 'takekey.get_tasks')
    }
  },
  async do_task () {
    try {
      /* disable
      await this.toggleActions('fuck')
      fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
      if (this.conf.fuck.verifyTask) this.verify()
      */
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
      throwError(e, 'takekey.do_task')
    }
  },
  async verify () {
    try {
      const logStatus = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('verifyingTask')}...<font></font></li>` })
      const { result, statusText, status, data } = await fuc.httpRequest({
        url: window.location.href,
        method: 'POST',
        dataType: 'json'
      })
      if (result === 'Success') {
        if (data.status === 200 && data?.response?.status === 'success') {
          logStatus.success(data?.response?.msg, true)
        } else {
          logStatus.error('Error:' + (JSON.stringify(data?.response?.msg) || data.statusText + '(' + data.status + ')'), true)
        }
      } else {
        logStatus.error(`${result}:${statusText}(${status})`)
      }
      logStatus.scrollIntoView()
      // setTimeout(() => { $('.fa-check').click() }, 1000)
    } catch (e) {
      throwError(e, 'takekey.verify')
    }
  },
  async toggleActions (action) {
    try {
      const fuck = action === 'fuck'
      const taskInfo = fuck ? this.currentTaskInfo : this.taskInfo
      await fuc.updateInfo(taskInfo)
      await fuc.assignment(taskInfo, this.conf[action], action, 'takekey')
    } catch (e) {
      throwError(e, 'takekey.toggleActions')
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
      throwError(e, 'takekey.remove')
    }
  },
  get_giveawayId () {
    try {
      const id = window.location.href.match(/distribution\/([\d]+)/)
      return id?.[1] || window.location.href
    } catch (e) {
      throwError(e, 'takekey.get_giveawayId')
    }
  },
  checkLogin () {
    try {
      if ($('i.fa-sign-in').length > 0) window.open('/auth/steam', '_self')
    } catch (e) {
      throwError(e, 'takekey.checkLogin')
    }
  },
  checkLeft () {
    try {
      const leftKey = $('span:contains(Осталось ключей),span:contains(Keys Left)').text().match(/[\d]+/)?.[0]
      if (!(leftKey && parseInt(leftKey[0]) > 0)) {
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
      throwError(e, 'takekey.checkLeft')
    }
  },
  currentTaskInfo: {
    links: [],
    groups: [],
    // wGames: [],
    vks: [],
    // youtubeChannels: [],
    // twitterUsers: [],
    tasks: []
  },
  taskInfo: {
    groups: [],
    // wGames: [],
    // youtubeChannels: [],
    // twitterUsers: [],
    vks: []
  },
  setting: {},
  conf: config?.takekey?.enable ? config.takekey : globalConf
}

export { takekey }
