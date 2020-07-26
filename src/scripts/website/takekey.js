import { getI18n } from '../i18n'
import { fuc } from '../function/main'
import { config, globalConf, debug } from '../config'

const takekey = {
  test () { return window.location.host.includes('takekey') },
  fuck () { this.get_tasks('do_task') },
  get_tasks (callback = 'do_task') {
    const taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
    if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory
    if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
      this.remove(true)
    } else {
      [this.tasks, this.groups, this.curators, this.links] = [[], [], [], []]
      const [
        pro,
        status,
        tasksContainer
      ] = [
        [],
        fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` }),
        $('#usl>div')
      ]

      for (const task of tasksContainer) { // 遍历任务信息
        this.tasks.push(task)
        const [
          icon,
          link,
          id
        ] = [
          $(task).find('i'),
          $(task).children('a[id]').attr('href'),
          $(task).children('a[id]').attr('id')
        ]
        if (icon.hasClass('fa-steam')) {
          if (link && /gid\/[\d]+/.test(link)) {
            pro.push(new Promise(r => { // eslint-disable-line promise/param-names
              new Promise(resolve => {
                fuc.getFinalUrl(resolve, link)
              }).then(data => {
                if (data.result === 'success') {
                  const groupName = data.finalUrl.match(/steamcommunity.com\/groups\/([\w\d\-_]*)/)[1]
                  if (groupName) {
                    this.groups.push(groupName)
                    this.taskInfo.groups.push(groupName)
                    r(1)
                  } else {
                    r(0)
                  }
                } else {
                  r(0)
                }
              }).catch(() => {
                r(0)
              })
            }))
          }
        } else if (icon.hasClass('fa-link')) {
          this.links.push(id)
        } else if (icon.hasClass('fa-vk')) {
          this.vks.push(link)
        } else {
          this.others.push(icon)
        }
      }
      Promise.all(pro).finally(() => {
        [
          this.groups,
          this.curators,
          this.links,
          this.others,
          this.taskInfo.groups,
          this.taskInfo.curators,
          this.tasks
        ] = [
          fuc.unique(this.groups),
          fuc.unique(this.curators),
          fuc.unique(this.links),
          fuc.unique(this.others),
          fuc.unique(this.taskInfo.groups),
          fuc.unique(this.taskInfo.curators),
          fuc.unique(this.tasks)
        ]
        GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
        status.success()
        if (debug) console.log(this)
        if (callback === 'do_task') {
          if (this.tasks.length === 0) {
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
  },
  do_task () {
    this.updateSteamInfo(async () => {
      const [
        pro,
        links,
        others,
        vks
      ] = [
        [],
        fuc.unique(this.links),
        fuc.unique(this.others),
        fuc.unique(this.vks)
      ]
      await this.toggleActions('fuck', pro)
      if (this.conf.fuck.visit) {
        for (const link of links) {
          const a = $(`a[id='${link}']`).attr('onclick', 'return false;')
          a[0].click()
          a.removeAttr('onclick')
          pro.push(new Promise(resolve => {
            fuc.visitLink(resolve, $(`a[id='${link}']`).attr('href'))
          }))
        }
      }
      if (globalConf.other.autoOpen) {
        for (const vk of vks) {
          window.open(vk, '_blank')
        }
      }
      for (const other of others) {
        fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('unknowntype')}:${$(other).attr('class')}</font></li>` })
      }
      Promise.all(pro).finally(() => {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        if (this.conf.fuck.verifyTask) this.verify()
      })
    })
  },
  verify () {
    setTimeout(() => { $('.fa-check').click() }, 1000)
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
    if (this.conf[action][action === 'fuck' ? 'joinSteamGroup' : 'leaveSteamGroup'] && groups.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'takekey', type: 'group', elements: groups, resolve, action })
      }))
    }
    /* disable
    const wishlists = action === 'fuck' ? this.wishlists : this.taskInfo.wishlists
    const fGames = action === 'fuck' ? this.fGames : this.taskInfo.fGames
    const curators = action === 'fuck' ? this.curators : this.taskInfo.curators
    if (this.conf[action][action === 'fuck' ? 'addToWishlist' : 'removeFromWishlist'] && wishlists.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'takekey', type: 'wishlist', elements: wishlists, resolve, action })
      }))
    }
    if (this.conf[action][action === 'fuck' ? 'followGame' : 'unfollowGame'] && fGames.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'takekey', type: 'game', elements: fGames, resolve, action })
      }))
    }
    if (this.conf[action][action === 'fuck' ? 'followCurator' : 'unfollowCurator'] && curators.length > 0) {
      pro.push(new Promise(resolve => {
        fuc.toggleActions({ website: 'takekey', type: 'curator', elements: curators, resolve, action })
      }))
    }
    */
  },
  get_giveawayId () {
    const id = window.location.href.match(/distribution\/([\d]+)/)
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
  checkLogin () {
    if ($('i.fa-sign-in').length > 0) window.open('/auth/steam', '_self')
  },
  checkLeft () {
    const leftKey = $('span:contains(Осталось ключей),span:contains(Keys Left)').text().match(/[\d]+/)
    if (!(leftKey && parseInt(leftKey[0]) > 0)) {
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
  links: [], // 需要浏览的页面链接
  others: [],
  vks: [],
  taskInfo: {
    groups: [], // 所有任务需要加的组
    curators: []// 所有任务需要关注的鉴赏家
  },
  tasks: [], // 任务信息
  setting: {},
  conf: config?.takekey?.enable ? config.takekey : globalConf
}

export { takekey }
