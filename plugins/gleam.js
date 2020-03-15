/* global getI18n, fuc, globalConf, defaultConf, debug */
const gleam = { // eslint-disable-line no-unused-vars
  fuck: function () {
    this.get_tasks('do_task')
  },
  get_tasks: function (callback = 'do_task') {
    const taskInfoHistory = GM_getValue('taskInfo[' + location.host + this.get_giveawayId() + ']')
    if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory
    if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
      this.remove(true)
    } else {
      this.twitters = []
      this.facebooks = []
      this.youtubes = []
      this.discords = []
      this.others = []
      this.groups = []
      this.links = []
      const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` })

      const tasksContainer = $('div.entry-content .entry-method')
      for (const task of tasksContainer) { // 遍历任务信息
        if ($(task).find('i.fa-question').length > 0) {
          if ($(task).hasClass('visit')) {
            this.links.push(task)
          } else {
            const icon = $(task).find('.icon-wrapper i')
            if (icon.hasClass('fa-twitter')) {
              this.twitters.push(task)
            } else if (icon.hasClass('fa-facebook')) {
              this.facebooks.push(task)
            } else if (icon.hasClass('fa-youtube')) {
              this.youtubes.push(task)
            } else if (icon.hasClass('fa-discord')) {
              this.discords.push(task)
            } else if (icon.hasClass('fa-steam') || icon.hasClass('fa-steam-symbol')) {
              const title = $(task).find('.entry-method-title')
              if (/join.*group/gim.test(title.text())) {
                const groupA = $(task).find("a[href*='steamcommunity.com/groups']:first").attr('href')
                if (groupA) {
                  const groupName = groupA.match(/steamcommunity.com\/groups\/([\w\d\-_]*)/)[1]
                  this.groups.push(groupName)
                  this.taskInfo.groups.push(groupName)
                } else {
                  fuc.echoLog({
                    type: 'custom',
                    text: `<li><font class="error">${getI18n('getGroupFailed')}</font></li>`
                  })
                }
              } else {
                this.others.push(task)
              }
            } else {
              this.others.push(task)
            }
          }
        } else if (callback === 'remove') {
          const icon = $(task).find('.icon-wrapper i')
          if (icon.hasClass('fa-steam')) {
            const title = $(task).find('.entry-method-title')
            if (/join.*group/gim.test(title.text())) {
              const groupA = $(task).find("a[href*='steamcommunity.com/groups']:first").attr('href')
              if (groupA) {
                const groupName = groupA.match(/steamcommunity.com\/groups\/([\w\d\-_]*)/)[1]
                this.taskInfo.groups.push(groupName)
              } else {
                fuc.echoLog({
                  type: 'custom',
                  text: `<li><font class="error">${getI18n('getGroupFailed')}</font></li>`
                })
              }
            }
          }
        }
      }
      this.groups = fuc.unique(this.groups)
      this.twitters = fuc.unique(this.twitters)
      this.facebooks = fuc.unique(this.facebooks)
      this.youtubes = fuc.unique(this.youtubes)
      this.discords = fuc.unique(this.discords)
      this.groups = fuc.unique(this.groups)
      this.others = fuc.unique(this.others)
      this.taskInfo.groups = fuc.unique(this.taskInfo.groups)
      GM_setValue('taskInfo[' + location.host + this.get_giveawayId() + ']', this.taskInfo)
      status.success()
      if (debug) console.log(this)
      if (callback === 'do_task') {
        this.do_task()
      } else if (callback === 'verify') {
        this.verify(true)
      } else {
        !fuc.isEmptyObjArr(this.taskInfo) ? this.remove(true) : fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('cannotRemove')}</font></li>` })
      }
    }
  },
  do_task: function () {
    this.updateSteamInfo(() => {
      const pro = []
      const groups = fuc.unique(this.groups)
      const twitters = fuc.unique(this.twitters)
      const discords = fuc.unique(this.discords)
      const facebooks = fuc.unique(this.facebooks)
      const youtubes = fuc.unique(this.youtubes)
      const others = fuc.unique(this.others)
      const links = fuc.unique(this.links)
      const disc_fb_ytb = [...discords, ...facebooks, ...youtubes] // eslint-disable-line camelcase
      if (this.conf.fuck.group && groups.length > 0) {
        for (const group of groups) {
          pro.push(new Promise((resolve) => {
            fuc.joinSteamGroup(resolve, group)
          }))
        }
      }
      if (globalConf.other.autoOpen) {
        if (twitters.length > 0) {
          for (const twitter of twitters) {
            const title = $(twitter).find('.entry-method-title').text().trim()
            const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('doing')}:${title}...<font></font></li>` })
            const followButton = $(twitter).find('a.twitter-button:contains(Follow)').attr('href')
            const retweetButton = $(twitter).find('a.twitter-button:contains(Retweet)').attr('href')
            const button = followButton || retweetButton
            if (button) {
              window.open(button, '_blank')
              status.warning(getI18n('openPage'))
            } else {
              status.error(getI18n('getTaskUrlFailed'))
            }
          }
        }
        if (disc_fb_ytb.length > 0) {
          for (const task of disc_fb_ytb) { // eslint-disable-line camelcase
            const title = $(task).find('.entry-method-title').text().trim()
            const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('doing')}:${title}...<font></font></li>` })
            const button = $(task).find('a.btn-info:first').attr('href')
            if (button) {
              window.open(button, '_blank')
              status.warning(getI18n('openPage'))
            } else {
              status.error(getI18n('getTaskUrlFailed'))
            }
          }
        }
      }
      if ((globalConf.other.autoOpen || this.conf.fuck.visit) && links.length > 0) {
        pro.push(new Promise((resolve) => {
          this.visit_link(links, 0, resolve)
        }))
      }
      for (const other of others) {
        const icon = $(other).find('.icon-wrapper i')
        if (icon.hasClass('fa-steam')) {
          const title = $(other).find('.entry-method-title').text().trim()
          fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('unknowntype')}:${title}</font></li>` })
        } else {
          const taskType = icon.attr('class').match(/fa-([\w]+)/) ? icon.attr('class').match(/fa-([\w]+)/)[1] : icon.attr('class')
          fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('unknowntype')}:${taskType}</font></li>` })
        }
      }
      Promise.all(pro).finally(resolve => {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        if (this.conf.fuck.verify) this.verify(0)
      })
    })
  },
  verify: function (i = 0) {
    if ($('.ng-scope[ng-include*=challenge]').is(':visible')) {
      fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('notRobot')}</font></li>` })
      return 0
    }
    const tasks = $('div.entry-content .entry-method')
    if (i < tasks.length) {
      if (tasks.eq(i).find('i.fa-question').length > 0) {
        const title = tasks.eq(i).find('.entry-method-title').text().trim()
        const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('verifyingTask')}:${title}...<font></font></li>` })
        tasks.eq(i).find('a.enter-link')[0].click()
        const enterBtn = tasks.eq(i).find('.form-actions.center .btn-primary:contains(Continue)').removeAttr('disabled')
        if (enterBtn.length > 0) {
          setTimeout(() => {
            enterBtn[0].click()
            status.warning('Complete')
            setTimeout(() => { gleam.verify(++i) }, 1000)
          }, 1000)
        } else {
          setTimeout(() => { gleam.verify(++i) }, 1000)
        }
      } else {
        this.verify(++i)
      }
    } else {
      fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font><font class="warning">${getI18n('finishSelf')}</font></li>` })
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
  visit_link: function (links, i, r) {
    if (i < links.length) {
      const title = $(links[i]).find('.entry-method-title').text().trim()
      const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('doing')}:${title}...<font></font></li>` })
      const taskTime = $(links[i]).find('.form-actions.center span:contains(Visit):contains(seconds)').text()
      if (taskTime) {
        const taskBtn = $(links[i]).find('a.btn-info')
        const href = taskBtn.attr('href')
        taskBtn.removeAttr('href')[0].click()
        const time = taskTime.match(/[\d]+/)
        if (time) {
          GM_openInTab('https://userjs.hclonely.com/time.html?time=' + time[0], { active: 1, setParent: 1 }).onclose = () => {
            status.warning('Complete')
            taskBtn.attr('target', '_blank').attr('href', href)
            gleam.visit_link(links, ++i, r)
          }
        } else {
          GM_openInTab('javascript:setTimeout(()=>{window.close()},1000)', { active: 1, setParent: 1 }).onclose = () => {
            status.warning('Complete')
            taskBtn.attr('target', '_blank').attr('href', href)
            gleam.visit_link(links, ++i, r)
          }
        }
      } else {
        status.error(getI18n('getVisitTimeFailed'))
      }
    } else {
      r(1)
    }
  },
  get_giveawayId: function () {
    const id = location.pathname.replace(/\?.*/, '') || location.href
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
  checkLogin: function () { },
  checkLeft: function (ui) {
    if ($('.massive-message:contains(ended)').is(':visible')) {
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
  links: [], // 需要浏览的页面链接
  twitters: [], // twitter任务
  discords: [], // discord任务
  facebooks: [], // facebook任务
  youtubes: [], // youtube任务
  others: [], // 位置类型任务
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
  conf: GM_getValue('conf') ? ((GM_getValue('conf').gleam && GM_getValue('conf').gleam.load) ? GM_getValue('conf').gleam : (GM_getValue('conf').global || defaultConf)) : defaultConf
}
