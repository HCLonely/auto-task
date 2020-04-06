/* global getI18n, fuc, globalConf, defaultConf, debug */
const takekey = { // eslint-disable-line no-unused-vars
  test: () => { return window.location.host.includes('takekey') },
  fuck: function () { this.get_tasks('do_task') },
  get_tasks: function (callback = 'do_task') {
    const taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
    if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory
    if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
      this.remove(true)
    } else {
      this.tasks = []
      this.groups = []
      // this.curators=[];
      this.links = []
      const pro = []
      const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` })

      const tasksContainer = $('#usl>div')
      for (const task of tasksContainer) { // 遍历任务信息
        this.tasks.push(task)
        const icon = $(task).find('i')
        const link = $(task).children('a[id]').attr('href')
        const id = $(task).children('a[id]').attr('id')
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
        this.groups = fuc.unique(this.groups)
        // this.curators=fuc.unique(this.curators);
        this.links = fuc.unique(this.links)
        this.others = fuc.unique(this.others)
        this.taskInfo.groups = fuc.unique(this.taskInfo.groups)
        // this.taskInfo.curators=fuc.unique(this.taskInfo.curators);
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
        } else {
          !fuc.isEmptyObjArr(this.taskInfo) ? this.remove(true) : fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('cannotRemove')}</font></li>` })
        }
      })
    }
  },
  do_task: function () {
    this.updateSteamInfo(() => {
      const pro = []
      const groups = fuc.unique(this.groups)
      // let curators = fuc.unique(this.curators);
      const links = fuc.unique(this.links)
      const others = fuc.unique(this.others)
      const vks = fuc.unique(this.vks)
      if (this.conf.fuck.group) {
        for (const group of groups) {
          pro.push(new Promise(resolve => {
            fuc.joinSteamGroup(resolve, group)
          }))
        }
      }
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
        if (this.conf.fuck.verify) this.verify()
      })
    })
  },
  verify: function () {
    setTimeout(() => { $('.fa-check').click() }, 1000)
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
        Promise.all(pro).finally(() => {
          fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        })
      })
    } else {
      this.get_tasks('remove')
    }
  },
  get_giveawayId: function () {
    const id = window.location.href.match(/distribution\/([\d]+)/)
    return id ? id[1] : window.location.href
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
    if ($('i.fa-sign-in').length > 0) window.open('/auth/steam', '_self')
  },
  checkLeft: function (ui) {
    const leftKey = $('span:contains(Осталось ключей)').text().match(/[\d]+/)
    if (!(leftKey && parseInt(leftKey[0]) > 0)) {
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
  others: [],
  vks: [],
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
  conf: GM_getValue('conf') ? ((GM_getValue('conf').takekey && GM_getValue('conf').takekey.load) ? GM_getValue('conf').takekey : (GM_getValue('conf').global || defaultConf)) : defaultConf
}
