import { getI18n } from '../i18n'
import { fuc, throwError } from '../function/main'
import { config, globalConf, debug } from '../config'
import { delay } from '../function/tool'

const marvelousga = {
  test () {
    try {
      return window.location.host === 'marvelousga.com'
    } catch (e) {
      throwError(e, 'marvelousga.test')
    }
  },
  before () {
    try {
      fuc.newTabBlock()
    } catch (e) {
      throwError(e, 'marvelousga.before')
    }
  },
  fuck () {
    try {
      this.get_tasks('do_task')
    } catch (e) {
      throwError(e, 'marvelousga.fuck')
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
        const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` })
        const tasksContainer = $('.container_task')
        for (const task of tasksContainer) {
          const taskDes = $(task).find('.card-body p.card-text.monospace')
          const verifyBtn = $(task).find('button[id^=task_]:not(:contains(VERIFIED))')
          if (/join[\w\W]*?steamcommunity\.com\/groups/gim.test(taskDes.html())) {
            const groupName = taskDes.find('a[href*="steamcommunity.com/groups"]').attr('href').match(/steamcommunity.com\/groups\/([\w\d\-_]*)/)[1]
            if (verifyBtn.length > 0) {
              this.currentTaskInfo.groups.push(groupName)
            }
            this.taskInfo.groups.push(groupName)
          }
          if (/follow[\w\W]*?store\.steampowered\.com\/curator/gim.test(taskDes.html())) {
            const curatorName = taskDes.find('a[href*="store.steampowered.com/curator"]').attr('href').match(/store\.steampowered\.com\/curator\/([\d]*)/)[1]
            if (verifyBtn.length > 0) {
              this.currentTaskInfo.curators.push(curatorName)
            }
            this.taskInfo.curators.push(curatorName)
          }
          if (/follow[\w\W]*?https?:\/\/twitter\.com\//gim.test(taskDes.html())) {
            const name = taskDes.find('a[href*="twitter.com"]').attr('href').match(/twitter\.com\/([^/]+)/)?.[1]
            if (name) {
              if (verifyBtn.length > 0) {
                this.currentTaskInfo.twitterUsers.push(name)
              }
              this.taskInfo.twitterUsers.push(name)
            }
          }
          if (/follow[\w\W]*?https?:\/\/twitch\.tv\//gim.test(taskDes.html())) {
            const name = taskDes.find('a[href*="twitch.tv"]').attr('href').match(/twitch\.tv\/([^/]+)/)?.[1]
            if (name) {
              if (verifyBtn.length > 0) {
                this.currentTaskInfo.twitchChannels.push(name)
              }
              this.taskInfo.twitchChannels.push(name)
            }
          }
          if (/visit.*?this.*?page/gim.test(taskDes.text()) && verifyBtn.length > 0) {
            const pageUrl = taskDes.find('a[id^="task_webpage_clickedLink"]').attr('href')
            this.currentTaskInfo.links.push({ pageUrl: pageUrl, taskId: verifyBtn.attr('id').split('_')[3] })
          }
          if (verifyBtn.length > 0) {
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
    } catch (e) {
      throwError(e, 'marvelousga.get_tasks')
    }
  },
  async do_task () {
    try {
      const pro = []
      pro.push(this.toggleActions('fuck'))
      const links = fuc.unique(this.currentTaskInfo.links)
      if (this.conf.fuck.visitLink) {
        for (const link of links) {
          pro.push(fuc.visitLink(link.pageUrl, {
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
          }))
          await delay(500)
        }
      }
      Promise.all(pro).finally(() => {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        if (this.conf.fuck.verifyTask) this.verify()
      })
    } catch (e) {
      throwError(e, 'marvelousga.do_task')
    }
  },
  async verifyTask (task) {
    const logStatus = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('verifyingTask')}${task.taskDes}...<font></font></li>` })
    const { result, statusText, status, data } = await fuc.httpRequest({
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
      })
    })
    if (result === 'Success') {
      if (data.status === 200) {
        if (data.response.status === 1) {
          $(`#task_${task.provider}_${task.taskRoute}_${task.taskId}`).text('VERIFIED')
          logStatus.success(data.response.percentageNanoBar.toFixed(2) + '%')
        } else {
          logStatus.error('Error:' + (data.response.message || 'error'))
          if (globalConf.other.autoOpen) {
            if (/Visit[\w\W]*?this[\w\W]*?webpage/gim.test(task.taskDes)) {
              $(`task_webpage_clickedLink_${task.taskId}`).click()
            } else {
              window.open($(`<div>${task.taskDes}</div>`).find('a').attr('href'), '_blank')
            }
          }
        }
      } else {
        logStatus.error('Error:' + (data.response.message || data.statusText || data.status))
        if (globalConf.other.autoOpen) {
          if (/Visit[\w\W]*?this[\w\W]*?webpage/gim.test(task.taskDes)) {
            $(`task_webpage_clickedLink_${task.taskId}`).click()
          } else {
            window.open($(`<div>${task.taskDes}</div>`).find('a').attr('href'), '_blank')
          }
        }
      }
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
          fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('verifyTasksComplete')}</font><font class="warning">${getI18n('doYourself')}<a class="hclonely-google" href="javascript:void(0)" target="_self">${getI18n('googleVerify')}</a>${getI18n('getKey')}!</font></li>` })
          $('#get_key_container').show()
          $('.hclonely-google').unbind().click(() => { $('#get_key_container')[0].scrollIntoView() })
        })
      } else {
        this.get_tasks('verify')
      }
    } catch (e) {
      throwError(e, 'marvelousga.verify')
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
      throwError(e, 'marvelousga.remove')
    }
  },
  async toggleActions (action) {
    try {
      const fuck = action === 'fuck'
      const taskInfo = fuck ? this.currentTaskInfo : this.taskInfo
      await fuc.updateInfo(taskInfo)
      await fuc.assignment(taskInfo, this.conf[action], action, 'marvelousga')
    } catch (e) {
      throwError(e, 'marvelousga.toggleActions')
    }
  },
  get_giveawayId () {
    try {
      return $('#giveawaySlug').val() || window.location.href
    } catch (e) {
      throwError(e, 'marvelousga.get_giveawayId')
    }
  },
  checkLogin () {
    try {
      if ($('a[href*=login]').length > 0) window.open('/login', '_self')
    } catch (e) {
      throwError(e, 'marvelousga.checkLogin')
    }
  },
  checkLeft () {
    try {
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
    } catch (e) {
      throwError(e, 'marvelousga.checkLeft')
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
