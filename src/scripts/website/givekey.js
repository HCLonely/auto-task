import { getI18n } from '../i18n'
import { fuc, throwError } from '../function/main'
import { config, globalConf, debug } from '../config'

const givekey = {
  test () {
    try {
      return window.location.host === 'givekey.ru'
    } catch (e) {
      throwError(e, 'givekey.test')
    }
  },
  fuck () {
    try {
      this.get_tasks('do_task')
    } catch (e) {
      throwError(e, 'givekey.fuck')
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
        const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font class="warning"></font></li>` })
        const tasks = $('a[id^=task_]:not(.btn-success)')
        for (const task of tasks) {
          const taskEle = $(task)
          const href = taskEle.attr('href')
          const text = taskEle.text().trim()
          if (/^https?:\/\/vk\.com\//.test(href) && /Subscribe|Repost/gi.test(text)) {
            const name = href.match(/vk\.com\/([^/]*)/)?.[1]
            if (name) {
              this.currentTaskInfo.vks.push(name)
              this.taskInfo.vks.push(name)
            }
          } else if (href.includes('steamcommunity.com/groups')) {
            const name = href.match(/groups\/([^/]*)/)?.[1]
            if (name) {
              this.currentTaskInfo.groups.push(name)
              this.taskInfo.groups.push(name)
            }
          } else if (/add to wishlist/gim.test(text)) {
            const id = await fuc.getFinalUrl(href)
              .then(({ result, finalUrl }) => {
                if (result === 'Success') {
                  return finalUrl?.match(/app\/([\d]+)/)?.[1]
                }
              })

            if (id) {
              this.currentTaskInfo.wGames.push(id)
              this.taskInfo.wGames.push(id)
            }
          } else if (/https?:\/\/givekey\.ru\/giveaway\/away\/[\d]+/.test(href)) {
            this.currentTaskInfo.links.push(href)
          } else {
            fuc.echoLog({ type: 'custom', text: `<li>${getI18n('unknownTaskType', `${text}(${href})`)}<font></font></li>` })
          }
          this.currentTaskInfo = fuc.uniqueTaskInfo(this.currentTaskInfo)
          this.taskInfo = fuc.uniqueTaskInfo(this.taskInfo)
          GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
          status.success()
        }
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
      }
    } catch (e) {
      throwError(e, 'givekey.get_tasks')
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
      throwError(e, 'givekey.do_task')
    }
  },
  // TODO: 未完成
  verify (verify = false) {
    try {
      $('#btngo').click()
    } catch (e) {
      throwError(e, 'givekey.verify')
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
      throwError(e, 'givekey.remove')
    }
  },
  async toggleActions (action) {
    try {
      const fuck = action === 'fuck'
      const taskInfo = fuck ? this.currentTaskInfo : this.taskInfo
      await fuc.updateInfo(taskInfo)
      await fuc.assignment(taskInfo, this.conf[action], action, 'givekey')
    } catch (e) {
      throwError(e, 'givekey.toggleActions')
    }
  },
  get_giveawayId () {
    try {
      return window.location.href.match(/\/giveaway\/([\d]+)/)?.[1] || window.location.href
    } catch (e) {
      throwError(e, 'givekey.get_giveawayId')
    }
  },
  checkLogin () {
    try {
      if ($('a[href="/auth/steam"]').length > 0) window.open('/auth/steam', '_self')
    } catch (e) {
      throwError(e, 'givekey.checkLogin')
    }
  },
  checkLeft () {
    try {
      if (!$('#keys_count').text()) {
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
      throwError(e, 'givekey.checkLeft')
    }
  },
  currentTaskInfo: {
    links: [],
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
  conf: config?.givekay?.enable ? config.givekay : globalConf
}

export { givekey }

/* disable
var atApp = {
    loading: false,
    centrifuge: new Centrifuge('wss://app.givekey.ru/connection/websocket'),
    uid: $('meta[name="uid"]').attr("content"),
    init: function () {
        this.centrifuge.setToken($('meta[name="cent_token"]').attr("content")), this.centrifuge.connect(), this
            .centrifuge.on("connect", function (e) {
                console.log(`Connected!`);
            }), this.centrifuge.on("disconnect", function (e) {
                console.log(`DisConnected!\n${e.reason}`)
            });
        if (this.uid) this.centrifuge.subscribe(`usr#${this.uid}`, (data) => this.parse(data.data));
    },
    parse: (e, link, page) => {
      console.log(e)
    }
};
$(() => atApp.init());
*/
