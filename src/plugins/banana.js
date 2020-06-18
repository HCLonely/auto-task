/* global getI18n, fuc, globalConf, config, debug, Swal */
const banana = { // eslint-disable-line no-unused-vars
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
      }).then((result) => {
        if (result.value) {
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
      [this.tasks, this.links, this.groups, this.curators, this.wishlists, this.fGames, this.taskIds] = [[], [], [], [], [], [], []]

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
        const taskId = verifyBtn.length > 0 ? verifyBtn.attr('onclick').match(/\?verify=([\d]+)/) : ''
        if (taskId) {
          this.tasks.push({ taskId: taskId[1], taskDes: taskDes.text() })
          if (/join.*?steam.*?group/gim.test(taskDes.text())) {
            pro.push(new Promise(res => { // eslint-disable-line promise/param-names
              new Promise(resolve => {
                fuc.getFinalUrl(resolve, window.location.origin + window.location.pathname + '?q=' + taskId[1])
              }).then(r => {
                if (r.result === 'success') {
                  const groupName = r.finalUrl.match(/groups\/(.+)\/?/)
                  if (groupName) {
                    this.groups.push(groupName[1])
                    this.taskInfo.groups.push(groupName[1])
                  } else {
                    this.taskIds.push(taskId[1])
                  }
                } else {
                  this.taskIds.push(taskId[1])
                }
                res(1)
              })
            }))
          } else if (/follow.*?curator/gim.test(taskDes.text())) {
            pro.push(new Promise(res => { // eslint-disable-line promise/param-names
              new Promise(resolve => {
                fuc.getFinalUrl(resolve, window.location.origin + window.location.pathname + '?q=' + taskId[1])
              }).then(r => {
                if (r.result === 'success') {
                  const curatorId = r.finalUrl.match(/curator\/([\d]+)/)
                  if (curatorId) {
                    this.curators.push(curatorId[1])
                    this.taskInfo.curators.push(curatorId[1])
                  } else {
                    this.taskIds.push(taskId[1])
                  }
                } else {
                  this.taskIds.push(taskId[1])
                }
                res(1)
              })
            }))
          } else if (/wishlist/gim.test(taskDes.text())) {
            pro.push(new Promise(res => { // eslint-disable-line promise/param-names
              new Promise(resolve => {
                fuc.getFinalUrl(resolve, window.location.origin + window.location.pathname + '?q=' + taskId[1])
              }).then(r => {
                if (r.result === 'success') {
                  const appId = r.finalUrl.match(/store.steampowered.com\/app\/([\d]+)/)
                  if (appId) {
                    this.wishlists.push(appId[1])
                    this.taskInfo.wishlists.push(appId[1])
                  } else {
                    this.taskIds.push(taskId[1])
                  }
                } else {
                  this.taskIds.push(taskId[1])
                }
                res(1)
              })
            }))
          } else {
            if (/(Subscribe.*channel)|(Retweet)|(Twitter)/gim.test(taskDes.text())) {
              if (!this.verifyBtn) this.verifyBtn = taskDes.parent().find('button:contains(Verify)')
              if (callback === 'do_task' && globalConf.other.autoOpen) {
                taskDes.parent().find('button')[0].click()
              }
            }
            pro.push(new Promise(resolve => {
              this.links.push(window.location.origin + window.location.pathname + '?q=' + taskId[1])
              this.taskIds.push(taskId[1])
              resolve(1)
            }))
          }
        }
      }
      Promise.all(pro).finally(() => {
        [
          this.links,
          this.groups,
          this.curators,
          this.wishlists,
          this.fGames,
          this.taskInfo.groups,
          this.taskInfo.curators,
          this.taskInfo.wishlists,
          this.taskInfo.fGames,
          this.taskIds,
          this.tasks
        ] = [
          fuc.unique(this.links),
          fuc.unique(this.groups),
          fuc.unique(this.curators),
          fuc.unique(this.wishlists),
          fuc.unique(this.fGames),
          fuc.unique(this.taskInfo.groups),
          fuc.unique(this.taskInfo.curators),
          fuc.unique(this.taskInfo.wishlists),
          fuc.unique(this.taskInfo.fGames),
          fuc.unique(this.taskIds),
          fuc.unique(this.tasks)
        ]
        GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
        status.success()
        if (debug) console.log(this)
        if (callback === 'do_task') {
          this.do_task()
        } else if (callback === 'verify') {
          this.tasks.length > 0 ? this.verify(true) : fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        } else {
          !fuc.isEmptyObjArr(this.taskInfo) ? this.remove(true) : fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('cannotRemove')}</font></li>` })
        }
      })
    }
  },
  do_task () {
    this.updateSteamInfo(async () => {
      const [pro, links] = [[], fuc.unique(this.links)]
      await this.toggleActions('fuck', pro)
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
    })
  },
  verify (verify = false) {
    if (verify) {
      const pro = []
      for (const task of fuc.unique(this.tasks)) {
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
    const [groups, curators, wishlists, fGames] = action === 'fuck'
      ? [this.groups, this.curators, this.wishlists, this.fGames]
      : [this.taskInfo.groups, this.taskInfo.curators, this.taskInfo.wishlists, this.taskInfo.fGames]
    if (this.conf[action][action === 'fuck' ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'banana', type: 'group', elements: groups, resolve, action })
      }))
    }
    if (this.conf[action][action === 'fuck' ? 'followCurator' : 'unfollowCurator'] && curators.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'banana', type: 'curator', elements: curators, resolve, action })
      }))
    }
    if (this.conf[action][action === 'fuck' ? 'addToWishlist' : 'removeFromWishlist'] && wishlists.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'banana', type: 'wishlist', elements: wishlists, resolve, action })
      }))
    }
    if (this.conf[action][action === 'fuck' ? 'followGame' : 'unfollowGame'] && fGames.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'banana', type: 'game', elements: fGames, resolve, action })
      }))
    }
  },
  get_giveawayId () {
    const id = window.location.href.match(/\/giveaway\/([\w\d-]+)/)
    return id?.[1] || window.location.href
  },
  updateSteamInfo (callback) {
    new Promise(resolve => {
      if (this.taskInfo.groups.length > 0) {
        if (this.taskInfo.curators.length > 0 || this.taskInfo.fGames.length > 0 || this.taskInfo.wishlists.length > 0) {
          fuc.updateSteamInfo(resolve, 'all')
        } else {
          fuc.updateSteamInfo(resolve, 'community')
        }
      } else if (this.taskInfo.curators.length > 0 || this.taskInfo.fGames.length > 0 || this.taskInfo.wishlists.length > 0) {
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
      }).then((result) => {
        if (result.value) {
          window.close()
        }
      })
    }
  },
  verifyBtn: 0,
  links: [], // 需要浏览的页面链接
  groups: [], // 所有任务需要加的组
  curators: [], // 所有任务需要关注的鉴赏家
  wishlists: [], // 所有务需要添加愿望单的游戏
  fGames: [], // 所有任务需要关注的的游戏
  taskIds: [], // 处理失败的任务
  taskInfo: {
    groups: [], // 任务需要加的组
    curators: [], // 任务需要关注的鉴赏家
    wishlists: [], // 任务需要添加愿望单的游戏
    fGames: []// 任务需要关注的的游戏
  },
  tasks: [], // 所有任务ID
  setting: {},
  conf: config?.banana?.load ? config.banana : globalConf
}
