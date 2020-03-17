/* global getI18n, fuc, globalConf, defaultConf, debug */
const gamecode = { // eslint-disable-line no-unused-vars
  test: () => { return window.location.host.includes('gamecode.win') },
  before: () => { fuc.newTabBlock() },
  fuck: function () {
    this.get_tasks('do_task')
  },
  get_tasks: function (callback = 'do_task') {
    const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` })
    const verifyBtns = $('[id^=listOfTasks_btnVerify]:not(:contains(VERIFIED))')
    const allVerifyBtns = $('[id^=listOfTasks_btnVerify]')
    if (callback === 'do_task') {
      const taskInfo = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
      if (taskInfo && !fuc.isEmptyObjArr(taskInfo)) this.taskInfo = taskInfo
      this.groups = []
      for (const btn of verifyBtns) {
        if ($(btn).attr('id').split('_')[4] === 'joinGroup') {
          const link = $(btn).parent().find("a[href*='steamcommunity.com/groups/']").attr('href')
          const groupName = link.match(/groups\/(.+)\/?/)
          if (groupName) {
            this.groups.push(groupName[1])
          }
        }
      }
      for (const btn of allVerifyBtns) {
        if ($(btn).attr('id').split('_')[4] === 'joinGroup') {
          const link = $(btn).parent().find("a[href*='steamcommunity.com/groups/']").attr('href')
          const groupName = link.match(/groups\/(.+)\/?/)
          if (groupName) {
            this.taskInfo.groups.push(groupName[1])
          }
        }
      }
      this.groups = fuc.unique(this.groups)
      this.taskInfo.groups = fuc.unique(this.taskInfo.groups)
      GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
      if (this.groups.length > 0) {
        this.do_task()
      } else {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        if (this.conf.fuck.verify) this.verify()
      }
    } else if (callback === 'verify') {
      this.tasks = []
      for (const btn of verifyBtns) {
        const id = $(btn).attr('id')
        const index = id.split('_')[2]
        switch (id.split('_')[3]) {
          case 't':
            if (id.split('_')[4] === 'followUser') {
              this.tasks.push({ url: '/ajax/social/twitter/followUser', id: $('#task_id_' + index).val(), taskDes: $(btn).parent().find('.card-title').html() })
            } else if (id.split('_')[4] === 'post') {
              this.tasks.push({ url: '/ajax/social/twitter/postCheck', id: $('#task_id_' + index).val(), taskDes: $(btn).parent().find('.card-title').html() })
            } else {
              this.tasks.push({ url: getUrlTwitter($(btn)).replace('..', ''), id: $('#task_id_' + index).val(), taskDes: $(btn).parent().find('.card-title').html() })
            }
            break
          case 'others':
            this.tasks.push({ url: '/ajax/social/others/clicked', id: $('#task_id_' + index).val(), taskDes: $(btn).parent().find('.card-title').html() })
            break
          case 'w':
            if (id.split('_')[4] === 'followChannel') {
              this.tasks.push({ url: '/ajax/social/twitch/followCheck', id: $('#task_id_' + index).val(), taskDes: $(btn).parent().find('.card-title').html() })
            } else {
              this.tasks.push({ url: getUrlTwitch($(btn)).replace('..', ''), id: $('#task_id_' + index).val(), taskDes: $(btn).parent().find('.card-title').html() })
            }
            break
          case 'f':
            if (id.split('_')[4] === 'like') {
              this.tasks.push({ url: '/ajax/social/facebook/likePage', id: $('#task_id_' + index).val(), taskDes: $(btn).parent().find('.card-title').html() })
            } else if (id.split('_')[4] === 'share') {
              this.tasks.push({ url: '/ajax/social/facebook/shareContent', id: $('#task_id_' + index).val(), taskDes: $(btn).parent().find('.card-title').html() })
            } else if (id.split('_')[4] === 'shareGiveaway') {
              this.tasks.push({ url: '/ajax/social/facebook/shareThisGiveaway', id: $('#task_id_' + index).val(), taskDes: $(btn).parent().find('.card-title').html() })
            } else {
              this.tasks.push({ url: getUrlFacebook($(btn)).replace('..', ''), id: $('#task_id_' + index).val(), taskDes: $(btn).parent().find('.card-title').html() })
            }
            break
          case 's':
            if (id.split('_')[4] === 'joinGroup') {
              this.tasks.push({ url: '/ajax/social/steam/followGroup', id: $('#task_id_' + index).val(), taskDes: $(btn).parent().find('.card-title').html() })
            } else if (id.split('_')[4] === 'playGame') {
              this.tasks.push({ url: '/ajax/social/steam/playGame', id: $('#task_id_' + index).val(), taskDes: $(btn).parent().find('.card-title').html() })
            } else if (id.split('_')[4] === 'gameLibrary') {
              this.tasks.push({ url: '/ajax/social/steam/gameLibrary', id: $('#task_id_' + index).val(), taskDes: $(btn).parent().find('.card-title').html() })
            } else {
              this.tasks.push({ url: getUrlSteam($(btn)).replace('..', ''), id: $('#task_id_' + index).val(), taskDes: $(btn).parent().find('.card-title').html() })
            }
            break
          case 'y':
            if (id.split('_')[4] === 'subscribeChannel') {
              this.tasks.push({ url: '/ajax/social/youtube/subscribeChannel', id: $('#task_id_' + index).val(), taskDes: $(btn).parent().find('.card-title').html() })
            } else if (id.split('_')[4] === 'likeVideo') {
              this.tasks.push({ url: '/ajax/social/youtube/likeVideo', id: $('#task_id_' + index).val(), taskDes: $(btn).parent().find('.card-title').html() })
            } else {
              this.tasks.push({ url: getUrlYoutube($(btn)).replace('..', ''), id: $('#task_id_' + index).val(), taskDes: $(btn).parent().find('.card-title').html() })
            }
            break
          default:
            this.tasks.push({ url: 'unknown', id: $('#task_id_' + index).val(), taskDes: $(btn).parent().find('.card-title').html() })
        }
      }
      this.tasks = fuc.unique(this.tasks)
      if (this.tasks.length > 0) {
        this.verify(true)
      } else {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('verifyTasksComplete')}</font></li>` })
      }
    } else if (callback === 'remove') {
      const taskInfo = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
      if (taskInfo && !fuc.isEmptyObjArr(taskInfo)) {
        this.taskInfo = taskInfo
        this.remove(true)
      } else {
        for (const btn of allVerifyBtns) {
          if ($(btn).attr('id').split('_')[4] === 'joinGroup') {
            const link = $(btn).parent().find("a[href*='steamcommunity.com/groups/']").attr('href')
            const groupName = link.match(/groups\/(.+)\/?/)
            if (groupName) {
              this.taskInfo.groups.push(groupName[1])
            }
          }
        }
        this.taskInfo.groups = fuc.unique(this.taskInfo.groups)
        GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
        if (this.taskInfo.groups.length > 0) {
          this.remove(true)
        } else {
          fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('cannotRemove')}</font></li>` })
        }
      }
    } else {
      fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('unknown')}！</font></li>` })
    }
    status.success()
    if (debug) console.log(this)
  },
  do_task: function () {
    this.updateSteamInfo(() => {
      const pro = []
      const groups = fuc.unique(this.groups)
      if (this.conf.fuck.group) {
        for (const group of groups) {
          pro.push(new Promise((resolve) => {
            fuc.joinSteamGroup(resolve, group)
          }))
        }
      }
      Promise.all(pro).finally(resolve => {
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
        pro.push(new Promise((resolve) => {
          fuc.httpRequest({
            url: task.url,
            method: 'POST',
            dataType: 'json',
            headers: {
              'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'x-csrf-token': $('meta[name="csrf-token"]').attr('content')
            },
            data: $.param({
              giveawayID: this.get_giveawayId(),
              taskID: task.id
            }),
            onload: function (response) {
              if (debug) console.log(response)
              if (response.status === 200) {
                if (response.response.status === 1) {
                  $(`input[value=${task.id}]`).parent().find('button[id^=listOfTasks_btnVerify_]').text('VERIFIED')
                  status.success((parseInt(response.response.nDoneTasks) / parseInt(totalTasks) * 100).toFixed(2) + '%')
                  resolve({ result: 'success', statusText: response.statusText, status: response.status })
                } else {
                  status.error('Error:' + (response.response.message || 'error'))
                  if (globalConf.other.autoOpen) window.open(task.url, '_blank')
                  resolve({ result: 'error', statusText: response.statusText, status: response.status })
                }
              } else {
                status.error('Error:' + (response.response.message || response.statusText || response.status))
                if (globalConf.other.autoOpen) window.open(task.url, '_blank')
                resolve({ result: 'error', statusText: response.statusText, status: response.status })
              }
            },
            r: resolve,
            status
          })
        }))
      }
      Promise.all(pro).finally(resolve => {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('verifyTasksComplete')}</font><font class="warning">${getI18n('doYourself')}<a class="hclonely-google" href="javascript:void(0)" target="_self">${getI18n('googleVerify')}</a>${getI18n('getKey')}!</font></li>` })
        $('.hclonely-google').unbind()
        $('.hclonely-google').click(() => { $('#captcha')[0].scrollIntoView() })
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
            pro.push(new Promise((resolve) => {
              fuc.leaveSteamGroup(resolve, group)
            }))
          }
        }
        Promise.all(pro).finally(data => {
          fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        })
      })
    } else {
      this.get_tasks('remove')
    }
  },
  get_giveawayId: function () {
    const id = $('#giveawayID').val() || window.location.href
    return id
  },
  updateSteamInfo: function (callback) {
    new Promise(resolve => {
      if (this.taskInfo.groups.length > 0) {
        fuc.updateSteamInfo(resolve, 'community')
      } else {
        resolve(1)
      }
    }).then(s => {
      if (s === 1) {
        callback()
      }
    })
  },
  checkLogin: function () {
    if ($('a.steam[title*=team]').length > 0) window.open('/login', '_self')
  },
  checkLeft: function (ui) {
    if ($('.text-danger:contains(this giveaway is closed)').length > 0) {
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
  taskInfo: {
    groups: []// 所有任务需要加的组
  },
  tasks: [], // 任务信息
  setting: {
    fuck: true,
    verify: true,
    join: false,
    remove: true
  },
  conf: GM_getValue('conf') ? ((GM_getValue('conf').gamecode && GM_getValue('conf').gamecode.load) ? GM_getValue('conf').gamecode : (GM_getValue('conf').global || defaultConf)) : defaultConf
}
