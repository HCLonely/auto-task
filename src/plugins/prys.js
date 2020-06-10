/* global getI18n, fuc, globalConf, config, debug, Swal */
const prys = { // eslint-disable-line no-unused-vars
  test () { return window.location.host.includes('prys.revadike') },
  fuck () { this.get_tasks('do_task') },
  get_tasks (callback = 'do_task') {
    const [
      status,
      steps
    ] = [
      fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` }),
      $('#steps tbody tr')
    ]
    for (let i = 0; i < steps.length; i++) {
      if (steps.eq(i).find('span:contains(Success)').length === 0) checkClick(i)
    }
    if (callback === 'do_task') {
      [this.groups, this.curators] = [[], []]
      const [
        taskInfoHistory,
        pro
      ] = [
        GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']'),
        []
      ]
      if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory

      for (const step of steps) {
        if ($(step).find('span:contains(Success)').length === 0) {
          if ($(step).find("a[href*='store.steampowered.com/curator/']").length > 0) {
            const link = $(step).find("a[href*='store.steampowered.com/curator/']").attr('href')
            const curatorId = link.match(/curator\/([\d]+)/)
            if (curatorId) {
              this.curators.push(curatorId[1])
              this.taskInfo.curators.push(curatorId[1])
            }
          } else if ($(step).find("a[href*='steampowered.com/groups/']").length > 0) {
            const link = $(step).find("a[href*='steampowered.com/groups/']").attr('href')
            const groupName = link.match(/groups\/(.+)\/?/)
            if (groupName) {
              this.groups.push(groupName[1])
              this.taskInfo.groups.push(groupName[1])
            }
          } else if ($(step).find("a[href*='steamcommunity.com/gid']").length > 0) {
            const link = $(step).find("a[href*='steamcommunity.com/gid']").attr('href')
            pro.push(new Promise(r => { // eslint-disable-line promise/param-names
              new Promise(resolve => {
                fuc.getFinalUrl(resolve, link)
              }).then(data => {
                if (data.result === 'success') {
                  const groupName = data.finalUrl.match(/groups\/(.+)\/?/)
                  if (groupName) {
                    this.groups.push(groupName[1])
                    this.taskInfo.groups.push(groupName[1])
                  }
                }
                r(1)
              })
            }))
          }
        }
      }
      if (pro.length > 0) {
        Promise.all(pro).finally(() => {
          [
            this.groups,
            this.curators,
            this.taskInfo.groups,
            this.taskInfo.curators
          ] = [
            fuc.unique(this.groups),
            fuc.unique(this.curators),
            fuc.unique(this.taskInfo.groups),
            fuc.unique(this.taskInfo.curators)
          ]
          GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
          if (this.groups.length > 0 || this.curators.length > 0) {
            this.do_task()
          } else {
            fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
            if (this.conf.fuck.verify) this.verify()
          }
        })
      } else {
        [
          this.groups,
          this.curators,
          this.taskInfo.groups,
          this.taskInfo.curators
        ] = [
          fuc.unique(this.groups),
          fuc.unique(this.curators),
          fuc.unique(this.taskInfo.groups),
          fuc.unique(this.taskInfo.curators)
        ]
        GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
        if (this.groups.length > 0 || this.curators.length > 0) {
          this.do_task()
        } else {
          fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
          if (this.conf.fuck.verify) this.verify()
        }
      }
    } else if (callback === 'verify') {
      this.tasks = []
      const checks = $('#steps tbody a[id^=check]')
      if (checks.length > 0) {
        for (const check of checks) {
          const id = $(check).attr('id').match(/[\d]+/)
          if (id) this.tasks.push({ id: id[0], taskDes: $(check).parent().prev().html().trim() })
        }
        this.verify(true)
      } else {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('prysAllTasksComplete')}</font></li>` })
      }
    } else if (callback === 'remove') {
      const taskInfo = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
      if (taskInfo && !fuc.isEmptyObjArr(taskInfo)) {
        this.taskInfo = taskInfo
        this.remove(true)
      } else {
        const pro = []
        for (const step of steps) {
          if ($(step).find("a[href*='store.steampowered.com/curator/']").length > 0) {
            const link = $(step).find("a[href*='store.steampowered.com/curator/']").attr('href')
            const curatorId = link.match(/curator\/([\d]+)/)
            if (curatorId) this.taskInfo.curators.push(curatorId[1])
          } else if ($(step).find("a[href*='steampowered.com/groups/']").length > 0) {
            const link = $(step).find("a[href*='steampowered.com/groups/']").attr('href')
            const groupName = link.match(/groups\/(.+)\/?/)
            if (groupName) this.taskInfo.groups.push(groupName[1])
          } else if ($(step).find("a[href*='steamcommunity.com/gid']").length > 0) {
            const link = $(step).find("a[href*='steamcommunity.com/gid']").attr('href')
            pro.push(new Promise(r => { // eslint-disable-line promise/param-names
              new Promise(resolve => {
                fuc.getFinalUrl(resolve, link)
              }).then(data => {
                if (data.result === 'success') {
                  const groupName = data.finalUrl.match(/groups\/(.+)\/?/)
                  if (groupName) {
                    this.taskInfo.groups.push(groupName[1])
                  }
                }
                r(1)
              })
            }))
          }
        }
        if (pro.length > 0) {
          Promise.all(pro).finally(() => {
            [this.taskInfo.groups, this.taskInfo.curators] = [fuc.unique(this.taskInfo.groups), fuc.unique(this.taskInfo.curators)]
            GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
            if (this.taskInfo.groups.length > 0 || this.taskInfo.curators.length > 0) {
              this.remove(true)
            } else {
              fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('cannotRemove')}</font></li>` })
            }
          })
        } else {
          [this.taskInfo.groups, this.taskInfo.curators] = [fuc.unique(this.taskInfo.groups), fuc.unique(this.taskInfo.curators)]
          GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
          if (this.taskInfo.groups.length > 0 || this.taskInfo.curators.length > 0) {
            this.remove(true)
          } else {
            fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('cannotRemove')}</font></li>` })
          }
        }
      }
    } else {
      fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('unknown')}！</font></li>` })
    }
    status.success()
    if (debug) console.log(this)
  },
  do_task () {
    this.updateSteamInfo(async () => {
      const pro = []
      await this.toggleActions('fuck', pro)
      Promise.all(pro).finally(() => {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        if (this.conf.fuck.verify) this.verify()
      })
    })
  },
  verify (verify = false) {
    if (verify) {
      const pro = []
      for (const task of fuc.unique(this.tasks)) {
        const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('verifyingTask')}${task.taskDes}...<font></font></li>` })
        pro.push(new Promise(resolve => {
          this.checkStep(task.id, resolve, status)
        }))
      }
      Promise.all(pro).finally(() => {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('prysAllTasksComplete')}</font></li>` })
      })
    } else {
      this.get_tasks('verify')
    }
  },
  checkStep (step, r, status, captcha) {
    if (!captcha) captcha = null
    if (step !== 'captcha') {
      $('#check' + step).replaceWith('<span id="check' + step + '"><i class="fa fa-refresh fa-spin fa-fw"></i> Checking...</span>')
    }
    $.post('/api/check_step', {
      step: step,
      id: getURLParameter('id'),
      'g-recaptcha-response': captcha
    }, json => {
      r(1)
      if (json.success && step !== 'captcha') {
        $('#check' + step).replaceWith('<span class="text-success" id="check' + step + '"><i class="fa fa-check"></i> Success</span>')
        status.success()
      } else if (step !== 'captcha') {
        $('#check' + step).replaceWith('<a id="check' + step + '" href="javascript:checkStep(' + step + ')"><i class="fa fa-question"></i> Check</a>')
        status.error((json.response ? json.response.error ? json.response.error : 'Error' : 'Error'))
      }
      if (json.response) {
        if (json.response.captcha && json.success) {
          showAlert('info', json.response.captcha)
          captchaCheck()
        } else if (json.response.captcha) {
          showAlert('warning', json.response.captcha)
          captchaCheck()
        }
        if (json.response.prize) {
          showAlert('success', 'Here is your prize:<h1 role="button" align="middle" style="word-wrap: break-word;">' + json.response.prize + '</h2>')
        }
      }
    }).fail(() => {
      r(1)
      $('#check' + step).replaceWith('<a id="check' + step + '" href="javascript:checkStep(' + step + ')"><i class="fa fa-question"></i> Check</a>')
      status.error('Error:0')
    })
  },
  remove (remove = false) {
    const pro = []
    if (remove) {
      this.updateSteamInfo(async () => {
        await this.toggleActions('remove', pro)
        Promise.all(pro).finally(() => {
          fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        })
      })
    } else {
      this.get_tasks('remove')
    }
  },
  toggleActions (action, pro) {
    const groups = action === 'fuck' ? this.groups : this.taskInfo.groups
    const curators = action === 'fuck' ? this.curators : this.taskInfo.curators
    if (this.conf[action][action === 'fuck' ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'prys', type: 'group', elements: groups, resolve, action })
      }))
    }
    if (this.conf[action][action === 'fuck' ? 'followCurator' : 'unfollowCurator'] && curators.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'prys', type: 'curator', elements: curators, resolve, action })
      }))
    }
    /* disable
    const wishlists = action === 'fuck' ? this.wishlists : this.taskInfo.wishlists
    const fGames = action === 'fuck' ? this.fGames : this.taskInfo.fGames
    if (this.conf[action][action === 'fuck' ? 'addToWishlist' : 'removeFromWishlist'] && wishlists.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'prys', type: 'wishlist', elements: wishlists, resolve, action })
      }))
    }
    if (this.conf[action][action === 'fuck' ? 'followGame' : 'unfollowGame'] && fGames.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'prys', type: 'game', elements: fGames, resolve, action })
      }))
    }
    */
  },
  get_giveawayId () {
    const id = window.location.search.match(/id=([\d]+)/)
    return id?.[1] || window.location.href
  },
  updateSteamInfo (callback) {
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
  checkLeft () {
    const left = $('#header').text().match(/([\d]+).*?prize.*?left/)
    if (!(left.length > 0 && left[1] !== '0')) {
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
  curators: [], // 任务需要关注的鉴赏家
  taskInfo: {
    groups: [], // 所有任务需要加的组
    curators: []// 所有任务需要关注的鉴赏家
  },
  tasks: [], // 任务信息
  setting: {},
  conf: config?.prys?.load ? config.prys : globalConf
}
