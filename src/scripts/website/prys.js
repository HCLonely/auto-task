/* global showAlert, checkClick, getURLParameter, captchaCheck */
import { getI18n } from '../i18n'
import { fuc, throwError } from '../function/main'
import { config, globalConf, debug } from '../config'

const prys = {
  test () {
    try {
      return window.location.host.includes('prys.revadike')
    } catch (e) {
      throwError(e, 'prys.test')
    }
  },
  fuck () {
    try {
      this.get_tasks('do_task')
    } catch (e) {
      throwError(e, 'prys.fuck')
    }
  },
  get_tasks (callback = 'do_task') {
    try {
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
        this.currentTaskInfo = fuc.clearTaskInfo(this.currentTaskInfo)
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
              const curatorId = link.match(/curator\/([\d]+)/)?.[1]
              if (curatorId) {
                this.currentTaskInfo.curators.push(curatorId)
                this.taskInfo.curators.push(curatorId)
              }
            } else if ($(step).find("a[href*='steampowered.com/groups/']").length > 0) {
              const link = $(step).find("a[href*='steampowered.com/groups/']").attr('href')
              const groupName = link.match(/groups\/(.+)\/?/)?.[1]
              if (groupName) {
                this.currentTaskInfo.groups.push(groupName)
                this.taskInfo.groups.push(groupName)
              }
            } else if ($(step).find("a[href*='steamcommunity.com/gid']").length > 0) {
              const link = $(step).find("a[href*='steamcommunity.com/gid']").attr('href')
              pro.push(new Promise(resolve => {
                new Promise(resolve => {
                  fuc.getFinalUrl(resolve, link)
                }).then(data => {
                  if (data.result === 'success') {
                    const groupName = data.finalUrl.match(/groups\/(.+)\/?/)?.[1]
                    if (groupName) {
                      this.currentTaskInfo.groups.push(groupName)
                      this.taskInfo.groups.push(groupName)
                    }
                  }
                  resolve(1)
                }).catch(() => {
                  resolve(1)
                })
              }))
            }
          }
        }
        if (pro.length > 0) {
          Promise.all(pro).finally(() => {
            this.currentTaskInfo = fuc.uniqueTaskInfo(this.currentTaskInfo)
            this.taskInfo = fuc.uniqueTaskInfo(this.taskInfo)
            GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
            if (this.currentTaskInfo.groups.length > 0 || this.currentTaskInfo.curators.length > 0) {
              this.do_task()
            } else {
              fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
              if (this.conf.fuck.verifyTask) this.verify()
            }
          })
        } else {
          this.currentTaskInfo = fuc.uniqueTaskInfo(this.currentTaskInfo)
          this.taskInfo = fuc.uniqueTaskInfo(this.taskInfo)
          GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
          if (this.currentTaskInfo.groups.length > 0 || this.currentTaskInfo.curators.length > 0) {
            this.do_task()
          } else {
            fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
            if (this.conf.fuck.verifyTask) this.verify()
          }
        }
      } else if (callback === 'verify') {
        this.currentTaskInfo.tasks = []
        const checks = $('#steps tbody a[id^=check]')
        if (checks.length > 0) {
          for (const check of checks) {
            const id = $(check).attr('id').match(/[\d]+/)?.[0]
            if (id) this.currentTaskInfo.tasks.push({ id, taskDes: $(check).parent().prev().html().trim() })
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
              const curatorId = link.match(/curator\/([\d]+)/)?.[1]
              if (curatorId) this.taskInfo.curators.push(curatorId)
            } else if ($(step).find("a[href*='steampowered.com/groups/']").length > 0) {
              const link = $(step).find("a[href*='steampowered.com/groups/']").attr('href')
              const groupName = link.match(/groups\/(.+)\/?/)?.[1]
              if (groupName) this.taskInfo.groups.push(groupName)
            } else if ($(step).find("a[href*='steamcommunity.com/gid']").length > 0) {
              const link = $(step).find("a[href*='steamcommunity.com/gid']").attr('href')
              pro.push(new Promise(resolve => { // eslint-disable-line promise/param-names
                new Promise(resolve => {
                  fuc.getFinalUrl(resolve, link)
                }).then(data => {
                  if (data.result === 'success') {
                    const groupName = data.finalUrl.match(/groups\/(.+)\/?/)?.[1]
                    if (groupName) {
                      this.taskInfo.groups.push(groupName)
                    }
                  }
                  resolve(1)
                }).catch(error => {
                  if (debug) console.error(error)
                  resolve(0)
                })
              }))
            }
          }
          if (pro.length > 0) {
            Promise.all(pro).finally(() => {
              this.taskInfo = fuc.uniqueTaskInfo(this.taskInfo)
              GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
              if (this.taskInfo.groups.length > 0 || this.taskInfo.curators.length > 0) {
                this.remove(true)
              } else {
                fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('cannotRemove')}</font></li>` })
              }
            })
          } else {
            this.taskInfo = fuc.uniqueTaskInfo(this.taskInfo)
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
    } catch (e) {
      throwError(e, 'prys.get_tasks')
    }
  },
  async do_task () {
    try {
      const pro = await this.toggleActions('fuck')
      Promise.all(pro).finally(() => {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        if (this.conf.fuck.verifyTask) this.verify()
      })
    } catch (e) {
      throwError(e, 'prys.do_task')
    }
  },
  verify (verify = false) {
    try {
      if (verify) {
        const pro = []
        for (const task of fuc.unique(this.currentTaskInfo.tasks)) {
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
    } catch (e) {
      throwError(e, 'prys.verify')
    }
  },
  checkStep (step, r, status, captcha) {
    try {
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
    } catch (e) {
      throwError(e, 'prys.checkStep')
    }
  },
  async remove (remove = false) {
    try {
      if (remove) {
        const pro = await this.toggleActions('remove')
        Promise.all(pro).finally(() => {
          fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        })
      } else {
        this.get_tasks('remove')
      }
    } catch (e) {
      throwError(e, 'prys.remove')
    }
  },
  async toggleActions (action) {
    try {
      const pro = []
      const fuck = action === 'fuck'
      const taskInfo = fuck ? this.currentTaskInfo : this.taskInfo
      await fuc.updateInfo(taskInfo)
      const { groups, curators } = taskInfo
      if (this.conf[action][fuck ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
        pro.push(new Promise(resolve => {
          fuc.toggleActions({ website: 'prys', type: 'group', elements: groups, resolve, action })
        }))
      }
      if (this.conf[action][fuck ? 'followCurator' : 'unfollowCurator'] && curators.length > 0) {
        pro.push(new Promise(resolve => {
          fuc.toggleActions({ website: 'prys', type: 'curator', elements: curators, resolve, action })
        }))
      }
      return pro
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
    } catch (e) {
      throwError(e, 'prys.toggleActions')
    }
  },
  get_giveawayId () {
    try {
      return window.location.search.match(/id=([\d]+)/)?.[1] || window.location.href
    } catch (e) {
      throwError(e, 'prys.get_giveawayId')
    }
  },
  checkLeft () {
    try {
      const left = $('#header').text().match(/([\d]+).*?prize.*?left/)
      if (!(left.length > 0 && left[1] !== '0')) {
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
      throwError(e, 'prys.checkLeft')
    }
  },
  currentTaskInfo: {
    groups: [],
    curators: [],
    tasks: []
  },
  taskInfo: {
    groups: [],
    curators: []
  },
  setting: {},
  conf: config?.prys?.enable.valueOf() ? config.prys : globalConf
}

export { prys }
