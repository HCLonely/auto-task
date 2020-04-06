/* global getI18n, fuc, globalConf, defaultConf, debug */
const marvelousga = { // eslint-disable-line no-unused-vars
  test: () => { return (window.location.host.includes('marvelousga') || window.location.host.includes('dupedornot')) },
  before: () => { fuc.newTabBlock() },
  fuck: function () { this.get_tasks('do_task') },
  get_tasks: function (callback = 'do_task') {
    const taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
    if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory
    if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
      this.remove(true)
    } else {
      this.tasks = []
      this.groups = []
      this.curators = []
      this.links = []
      const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` })

      const tasksContainer = $('.container_task')
      for (const task of tasksContainer) { // 遍历任务信息
        const taskDes = $(task).find('.card-body p.card-text.monospace')
        const verifyBtn = $(task).find('button[id^=task_]:not(:contains(VERIFIED))')
        if (/join[\w\W]*?steamcommunity.com\/groups/gim.test(taskDes.html())) { // 加组任务
          const groupName = taskDes.find('a[href*="steamcommunity.com/groups"]').attr('href').match(/steamcommunity.com\/groups\/([\w\d\-_]*)/)[1]
          if (verifyBtn.length > 0) {
            this.groups.push(groupName)
          }
          this.taskInfo.groups.push(groupName)
        }
        if (/follow[\w\W]*?store.steampowered.com\/curator/gim.test(taskDes.html())) { // 关注鉴赏家任务
          const curatorName = taskDes.find('a[href*="store.steampowered.com/curator"]').attr('href').match(/store.steampowered.com\/curator\/([\d]*)/)[1]
          if (verifyBtn.length > 0) {
            this.curators.push(curatorName)
          }
          this.taskInfo.curators.push(curatorName)
        }
        if (/visit.*?this.*?page/gim.test(taskDes.text()) && verifyBtn.length > 0) { // 浏览页面任务
          const pageUrl = taskDes.find('a[id^="task_webpage_clickedLink"]').attr('href')
          this.links.push({ pageUrl: pageUrl, taskId: verifyBtn.attr('id').split('_')[3] })
        }
        if (verifyBtn.length > 0) { // 任务验证信息
          const provider = verifyBtn.attr('id').split('_')[1]
          const taskRoute = verifyBtn.attr('id').split('_')[2]
          const taskId = verifyBtn.attr('id').split('_')[3]
          this.tasks.push({ provider, taskRoute, taskId, taskDes: taskDes.html() })
        }
      }
      this.groups = fuc.unique(this.groups)
      this.curators = fuc.unique(this.curators)
      this.links = fuc.unique(this.links)
      this.taskInfo.groups = fuc.unique(this.taskInfo.groups)
      this.taskInfo.curators = fuc.unique(this.taskInfo.curators)
      this.tasks = fuc.unique(this.tasks)
      GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
      status.success()
      if (debug) console.log(this)
      if (callback === 'do_task') {
        if (this.tasks.length === 0) {
          fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
          if (this.conf.fuck.verify) this.verify()
        } else {
          this.do_task()
        }
      } else if (callback === 'verify') {
        this.tasks.length > 0 ? this.verify(true) : fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('verifyTasksComplete')}</font></li>` })
      } else {
        !fuc.isEmptyObjArr(this.taskInfo) ? this.remove(true) : fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('cannotRemove')}</font></li>` })
      }
    }
  },
  do_task: function () {
    this.updateSteamInfo(() => {
      const pro = []
      const groups = fuc.unique(this.groups)
      const curators = fuc.unique(this.curators)
      const links = fuc.unique(this.links)
      if (this.conf.fuck.group) {
        for (const group of groups) {
          pro.push(new Promise(resolve => {
            fuc.joinSteamGroup(resolve, group)
          }))
        }
      }
      if (this.conf.fuck.curator) {
        for (const curator of curators) {
          pro.push(new Promise(resolve => {
            fuc.followCurator(resolve, curator)
          }))
        }
      }
      if (this.conf.fuck.visit) {
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
        if (this.conf.fuck.verify) this.verify()
      })
    })
  },
  verify: function (verify = false) {
    if (verify) {
      const pro = []
      for (const task of fuc.unique(this.tasks)) {
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
            onload: function (response) {
              if (debug) console.log(response)
              if (response.status === 200) {
                if (response.response.status === 1) {
                  $(`#task_${task.provider}_${task.taskRoute}_${task.taskId}`).text('VERIFIED')
                  status.success(response.response.percentageNanoBar.toFixed(2) + '%')
                  resolve({ result: 'success', statusText: response.statusText, status: response.status })
                } else {
                  status.error('Error:' + (response.response.message || 'error'))
                  if (globalConf.other.autoOpen) window.open($(`<div>${task.taskDes}</div>`).find('a').attr('href'), '_blank')
                  resolve({ result: 'error', statusText: response.statusText, status: response.status })
                }
              } else {
                status.error('Error:' + (response.response.message || response.statusText || response.status))
                if (globalConf.other.autoOpen) window.open($(`<div>${task.taskDes}</div>`).find('a').attr('href'), '_blank')
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
        $('.hclonely-google').unbind()
        $('.hclonely-google').click(() => { $('#get_key_container')[0].scrollIntoView() })
      })
    } else {
      this.get_tasks('verify')
    }
  },
  remove: function (remove = false) {
    const pro = []
    if (remove) {
      this.updateSteamInfo(() => {
        if (this.conf.remove.group) {
          for (const group of fuc.unique(this.taskInfo.groups)) {
            pro.push(new Promise(resolve => {
              fuc.leaveSteamGroup(resolve, group)
            }))
          }
        }
        if (this.conf.remove.curator) {
          for (const curator of fuc.unique(this.taskInfo.curators)) {
            pro.push(new Promise(resolve => {
              fuc.unfollowCurator(resolve, curator)
            }))
          }
        }
        Promise.all(pro).finally(() => {
          fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        })
      })
    } else {
      this.get_tasks('remove')
    }
  },
  get_giveawayId: function () {
    return $('#giveawaySlug').val() || window.location.href
  },
  updateSteamInfo: function (callback) {
    new Promise(resolve => {
      if (this.taskInfo.groups.length > 0) {
        if (this.taskInfo.curators.length > 0) {
          fuc.updateSteamInfo(resolve, 'all')
        } else {
          fuc.updateSteamInfo(resolve, 'community')
        }
      } else if (this.taskInfo.curators.length > 0) {
        fuc.updateSteamInfo(resolve, 'store')
      } else {
        resolve(1)
      }
    }).then(s => {
      if (s === 1) callback()
    }).catch(err => {
      console.error(err)
    })
  },
  checkLogin: function () {
    if ($('a[href*=login]').length > 0) window.open('/login', '_self')
  },
  checkLeft: function (ui) {
    if ($('h3.text-danger:contains(this giveaway is closed)').length > 0) {
      $('#link_to_click').remove()
      ui.$confirm(getI18n('noKeysLeft'), getI18n('notice'), {
        confirmButtonText: getI18n('confirm'),
        cancelButtonText: getI18n('cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        window.close()
      })
    }
  },
  groups: [], // 任务需要加的组
  curators: [], // 任务需要关注的鉴赏家
  links: [], // 需要浏览的页面链接
  taskInfo: {
    groups: [], // 所有任务需要加的组
    curators: []// 所有任务需要关注的鉴赏家
  },
  tasks: [], // 任务信息
  setting: {
    fuck: true,
    verify: true,
    join: false,
    remove: true
  },
  conf: GM_getValue('conf') ? ((GM_getValue('conf').marvelousga && GM_getValue('conf').marvelousga.load) ? GM_getValue('conf').marvelousga : (GM_getValue('conf').global || defaultConf)) : defaultConf
}
