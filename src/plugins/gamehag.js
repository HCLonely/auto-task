/* global getI18n, fuc, globalConf, config, debug, Swal */
const gamehag = { // eslint-disable-line no-unused-vars
  test () { return window.location.host.includes('gamehag') },
  before () {
    $('#getkey').removeAttr('disabled')
    if (globalConf.other.reCaptcha) $('body').append('<script>window.bannedCountries = ["en"];window.geo ="en";window.respCaptch="";</script>')
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
    if (callback === 'do_task') {
      [this.groups, this.tasks] = [[], []]
      const taskInfo = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
      if (taskInfo && !fuc.isEmptyObjArr(taskInfo)) this.taskInfo = taskInfo
      for (const btn of verifyBtns) {
        const [taskId, taskDes] = [$(btn).attr('data-id'), $(btn).parent().prev().text()]
        if ($(btn).parents('.task-content').next().text().includes('+1')) this.tasks.push({ taskId, taskDes })
      }
      if ($('a.giveaway-survey').length > 0) {
        const [taskId, taskDes] = [$('a.giveaway-survey').attr('data-task_id'), 'Complete the survey']
        this.tasks.push({ taskId, taskDes })
      }
      [
        this.groups,
        this.taskInfo.groups,
        this.tasks
      ] = [
        fuc.unique(this.groups),
        fuc.unique(this.taskInfo.groups),
        fuc.unique(this.tasks)
      ]
      GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
      if (this.tasks.length > 0) {
        this.do_task()
      } else {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        if (this.conf.fuck.verify) this.verify()
      }
    } else if (callback === 'verify') {
      this.tasks = []
      for (const btn of verifyBtns) {
        const [taskId, taskDes] = [$(btn).attr('data-id'), $(btn).parent().prev().text()]
        if ($(btn).parents('.task-content').next().text().includes('+1')) this.tasks.push({ taskId, taskDes })
      }
      this.tasks = fuc.unique(this.tasks)
      if (this.tasks.length > 0) {
        this.verify(true)
      } else {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('verifyTasksComplete')}</font></li>` })
      }
    } else if (callback === 'remove') {
      fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('cannotRemove')}</font></li>` })
    } else {
      fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('unknown')}！</font></li>` })
    }
    status.success()
    if (debug) console.log(this)
  },
  async do_task () {
    const [pro, tasks] = [[], fuc.unique(this.tasks)]
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
    Promise.all(pro).finally(() => {
      fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
      if (this.conf.fuck.verify) this.verify()
    })
  },
  async verify (verify = false) {
    if (verify) {
      const [pro, tasks] = [[], fuc.unique(this.tasks)]
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
  remove (remove = false) {
    fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('cannotRemove')}</font></li>` })
  },
  get_giveawayId () {
    const id = window.location.href.match(/\/giveaway\/([\d]+)/)
    return id ? id[1] : window.location.href
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
      }).then((result) => {
        if (result.value) {
          window.close()
        }
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
    remove: true
  },
  conf: config?.gamehag?.load ? config.gamehag : globalConf
}
