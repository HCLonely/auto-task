import { getI18n } from '../i18n'
import { fuc } from '../function/main'
import { config, globalConf, debug } from '../config'

const banana = {
  test () { return (window.location.host.includes('grabfreegame') || window.location.host.includes('bananagiveaway')) },
  fuck () {
    const [needBanana, needPoints] = [$("p:contains('Collect'):contains('banana')"), $("p:contains('Collect'):contains('point')")]
    let msg = ''
    if (needBanana.length > 0) msg = getI18n('needBanana', needBanana.text().match(/[\d]+/gim)[0])
    if (needPoints.length > 0) msg = getI18n('needPoints', needPoints.text().replace(/Collect/gi, ''))
    if (needPoints.length > 0 || needBanana.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: getI18n('notice'),
        text: msg,
        confirmButtonText: getI18n('confirm'),
        cancelButtonText: getI18n('cancel'),
        showCancelButton: true
      }).then(({ value }) => {
        if (value) {
          this.get_tasks('do_task')
        }
      })
    } else {
      this.get_tasks('do_task')
    }
  },
  get_tasks (callback = 'do_task') {
    const taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
    if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory
    if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
      this.remove(true)
    } else {
      this.currentTaskInfo = fuc.clearTaskInfo(this.currentTaskInfo)

      const [
        status,
        tasksUl,
        pro
      ] = [
        fuc.echoLog({ type: 'custom', text: `<li>${getI18n('processTasksInfo')}<font></font></li>` }),
        $('ul.tasks li:not(:contains(Completed))'),
        []
      ]

      for (const task of tasksUl) { // 遍历任务信息
        const [taskDes, verifyBtn] = [$(task).find('p'), $(task).find('button:contains(Verify)')]
        const taskId = verifyBtn.attr('onclick')?.match(/\?verify=([\d]+)/)?.[1]
        if (taskId) {
          this.currentTaskInfo.tasks.push({ taskId, taskDes: taskDes.text() })
          if (/join.*?steam.*?group/gim.test(taskDes.text())) {
            pro.push(new Promise(resolve => {
              new Promise(resolve => {
                fuc.getFinalUrl(resolve, window.location.origin + window.location.pathname + '?q=' + taskId)
              }).then(({ result, finalUrl }) => {
                if (result === 'success') {
                  const groupName = finalUrl.match(/groups\/(.+)\/?/)?.[1]
                  if (groupName) {
                    this.currentTaskInfo.groups.push(groupName)
                    this.taskInfo.groups.push(groupName)
                  } else {
                    this.currentTaskInfo.taskIds.push(taskId)
                  }
                } else {
                  this.currentTaskInfo.taskIds.push(taskId)
                }
                resolve(1)
              }).catch(error => {
                if (debug) console.error(error)
                resolve(0)
              })
            }))
          } else if (/follow.*?curator/gim.test(taskDes.text())) {
            pro.push(new Promise(resolve => {
              new Promise(resolve => {
                fuc.getFinalUrl(resolve, window.location.origin + window.location.pathname + '?q=' + taskId)
              }).then(({ result, finalUrl }) => {
                if (result === 'success') {
                  const curatorId = finalUrl.match(/curator\/([\d]+)/)?.[1]
                  if (curatorId) {
                    this.currentTaskInfo.curators.push(curatorId)
                    this.taskInfo.curators.push(curatorId)
                  } else {
                    this.currentTaskInfo.taskIds.push(taskId)
                  }
                } else {
                  this.currentTaskInfo.taskIds.push(taskId)
                }
                resolve(1)
              }).catch(error => {
                if (debug) console.error(error)
                resolve(0)
              })
            }))
          } else if (/wishlist/gim.test(taskDes.text())) {
            pro.push(new Promise(resolve => {
              new Promise(resolve => {
                fuc.getFinalUrl(resolve, window.location.origin + window.location.pathname + '?q=' + taskId)
              }).then(({ result, finalUrl }) => {
                if (result === 'success') {
                  const appId = finalUrl.match(/store.steampowered.com\/app\/([\d]+)/)?.[1]
                  if (appId) {
                    this.currentTaskInfo.wishlists.push(appId)
                    this.taskInfo.wishlists.push(appId)
                  } else {
                    this.currentTaskInfo.taskIds.push(taskId)
                  }
                } else {
                  this.currentTaskInfo.taskIds.push(taskId)
                }
                resolve(1)
              }).catch(error => {
                if (debug) console.error(error)
                resolve(0)
              })
            }))
          } else if (/Retweet/gim.test(taskDes.text())) {
            pro.push(new Promise(resolve => {
              new Promise(resolve => {
                fuc.getFinalUrl(resolve, window.location.origin + window.location.pathname + '?q=' + taskId)
              }).then(({ result, finalUrl }) => {
                if (result === 'success') {
                  const appId = finalUrl.match(/status\/([\d]+)/)?.[1]
                  if (appId) {
                    this.currentTaskInfo.retweets.push(appId)
                    this.taskInfo.retweets.push(appId)
                  } else {
                    this.currentTaskInfo.taskIds.push(taskId)
                  }
                } else {
                  this.currentTaskInfo.taskIds.push(taskId)
                }
                resolve(1)
              }).catch(error => {
                if (debug) console.error(error)
                resolve(0)
              })
            }))
          } else {
            if (/(Subscribe.*channel)|(Twitter)|(Retweet)/gim.test(taskDes.text())) {
              if (!this.verifyBtn) this.verifyBtn = taskDes.parent().find('button:contains(Verify)')
              if (callback === 'do_task' && globalConf.other.autoOpen) {
                taskDes.parent().find('button')[0].click()
              }
            }
            pro.push(new Promise(resolve => {
              this.currentTaskInfo.links.push(window.location.origin + window.location.pathname + '?q=' + taskId)
              this.currentTaskInfo.taskIds.push(taskId)
              resolve(1)
            }))
          }
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
        } else if (callback === 'verify') {
          this.currentTaskInfo.tasks.length > 0 ? this.verify(true) : fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        } else {
          !fuc.isEmptyObjArr(this.taskInfo) ? this.remove(true) : fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('cannotRemove')}</font></li>` })
        }
      })
    }
  },
  async do_task () {
    const pro = await this.toggleActions('fuck')
    const links = fuc.unique(this.currentTaskInfo.links)
    if (this.conf.fuck.visitLink) {
      for (const link of links) {
        pro.push(new Promise(resolve => {
          fuc.visitLink(resolve, link)
        }))
      }
    }
    Promise.all(pro).finally(() => {
      fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
      if (this.conf.fuck.verifyTask) this.verify()
    })
  },
  verify (verify = false) {
    if (verify) {
      const pro = []
      for (const task of fuc.unique(this.currentTaskInfo.tasks)) {
        const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('verifyingTask')}${task.taskDes}...<font></font></li>` })
        pro.push(new Promise(resolve => {
          fuc.httpRequest({
            url: window.location.origin + window.location.pathname + '?verify=' + task.taskId,
            method: 'GET',
            onload (response) {
              if (debug) console.log(response)
              status.warning('Complete')
              resolve({ result: 'success', statusText: response.statusText, status: response.status })
            },
            r: resolve,
            status
          })
        }))
      }
      Promise.all(pro).finally(() => {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('verifyTasksComplete')}</font></li>` })
        this.verifyBtn.length > 0 ? this.verifyBtn.removeAttr('disabled')[0].click() : window.location.reload(true)
      })
    } else {
      this.get_tasks('verify')
    }
  },
  async remove (remove = false) {
    if (remove) {
      const pro = await this.toggleActions('remove')
      Promise.all(pro).finally(() => {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
      })
    } else {
      this.get_tasks('remove')
    }
  },
  toggleActions (action) {
    const pro = []
    const fuck = action === 'fuck'
    const { groups, curators, wishlists, fGames, retweets } = fuck
      ? this.currentTaskInfo
      : this.taskInfo
    if (this.conf[action][fuck ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'banana', type: 'group', elements: groups, resolve, action })
      }))
    }
    if (this.conf[action][fuck ? 'followCurator' : 'unfollowCurator'] && curators.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'banana', type: 'curator', elements: curators, resolve, action })
      }))
    }
    if (this.conf[action][fuck ? 'addToWishlist' : 'removeFromWishlist'] && wishlists.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'banana', type: 'wishlist', elements: wishlists, resolve, action })
      }))
    }
    if (this.conf[action][fuck ? 'followGame' : 'unfollowGame'] && fGames.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'banana', type: 'game', elements: fGames, resolve, action })
      }))
    }
    if (this.conf[action][fuck ? 'retweet' : 'unretweet'] && retweets.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'banana', social: 'twitter', type: 'retweet', elements: retweets, resolve, action })
      }))
    }
    return pro
  },
  get_giveawayId () {
    return window.location.href.match(/\/giveaway\/([\w\d-]+)/)?.[1] || window.location.href
  },
  checkLogin () {
    if ($('a.steam[title*=team]').length > 0) window.open('/giveaway/steam/', '_self')
  },
  checkLeft () {
    if ($('.left b').text() === '0') {
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
  },
  verifyBtn: 0,
  currentTaskInfo: {
    links: [],
    groups: [],
    curators: [],
    wishlists: [],
    fGames: [],
    retweets: [],
    taskIds: [],
    tasks: []
  },
  taskInfo: {
    groups: [],
    curators: [],
    wishlists: [],
    fGames: [],
    retweets: []
  },
  setting: {},
  conf: config?.banana?.enable ? config.banana : globalConf
}

export { banana }
