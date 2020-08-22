import { getI18n, language } from '../i18n'
import { fuc } from '../function/main'
import { config, globalConf, debug } from '../config'

const gleam = {
  test () { return window.location.host.includes('gleam.io') },
  fuck () { this.get_tasks('do_task') },
  get_tasks (callback = 'do_task') {
    const taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
    if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory
    if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
      this.remove(true)
    } else {
      this.currentTaskInfo = fuc.clearTaskInfo(this.currentTaskInfo)

      const [
        status,
        tasksContainer
      ] = [
        fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` }),
        $('div.entry-content .entry-method')
      ]

      for (const task of tasksContainer) { // 遍历任务信息
        if ($(task).find('i.fa-question').length > 0) {
          if ($(task).hasClass('visit') || $(task).find('span:contains(Visit):contains(seconds)').length > 0) {
            this.currentTaskInfo.links.push(task)
          } else {
            const icon = $(task).find('.icon-wrapper i')
            if (icon.hasClass('fa-twitter')) {
              const twitterTaskInfo = $(task).find('.user-links')
              if (/follow/gim.test(twitterTaskInfo.text())) {
                const name = twitterTaskInfo.find('a[href^="https://twitter.com/"]').attr('href')?.match(/https:\/\/twitter.com\/(.+)/)?.[1]
                if (name) {
                  this.currentTaskInfo.twitterUsers.push(name)
                  this.taskInfo.twitterUsers.push(name)
                }
              } else if (/retweet/gim.test(twitterTaskInfo.text())) {
                const id = twitterTaskInfo.find('a[href^="https://twitter.com/"]').attr('href')?.match(/https:\/\/twitter.com\/.*?\/status\/([\d]+)/)?.[1]
                if (id) {
                  this.currentTaskInfo.retweets.push(id)
                  this.taskInfo.retweets.push(id)
                }
              }
            } else if (icon.hasClass('fa-facebook')) {
              this.currentTaskInfo.facebooks.push(task)
            } else if (icon.hasClass('fa-youtube')) {
              this.currentTaskInfo.youtubes.push(task)
            } else if (icon.hasClass('fa-discord')) {
              this.currentTaskInfo.discords.push(task)
            } else if (icon.hasClass('fa-steam') || icon.hasClass('fa-steam-symbol')) {
              const title = $(task).find('.entry-method-title')
              if (/join.*group/gim.test(title.text())) {
                const groupA = $(task).find("a[href*='steamcommunity.com/groups']:first").attr('href')
                if (groupA) {
                  const groupName = groupA.match(/steamcommunity.com\/groups\/([\w\d\-_]*)/)[1]
                  this.currentTaskInfo.groups.push(groupName)
                  this.taskInfo.groups.push(groupName)
                } else {
                  fuc.echoLog({
                    type: 'custom',
                    text: `<li><font class="error">${getI18n('getGroupFailed')}</font></li>`
                  })
                }
              } else {
                this.currentTaskInfo.others.push(task)
              }
            } else {
              this.currentTaskInfo.others.push(task)
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

      this.currentTaskInfo = fuc.uniqueTaskInfo(this.currentTaskInfo)
      this.taskInfo = fuc.uniqueTaskInfo(this.taskInfo)

      GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
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
  do_task () {
    this.updateSteamInfo(() => {
      const pro = []
      const { groups, twitterUsers, retweets, discords, facebooks, youtubes, others, links } = this.currentTaskInfo
      const socals = [...discords, ...facebooks, ...youtubes]
      if (this.conf.fuck.joinSteamGroup && groups.length > 0) {
        pro.push(new Promise(resolve => {
          fuc.toggleActions({ website: 'gleam', type: 'group', elements: groups, resolve, action: 'fuck' })
        }))
      }
      if (this.conf.fuck.followTwitterUser && twitterUsers.length > 0) {
        pro.push(new Promise(resolve => {
          fuc.toggleActions({ website: 'gleam', social: 'twitter', type: 'follow', elements: twitterUsers, resolve, action: 'fuck' })
        }))
      }
      if (this.conf.fuck.retweet && retweets.length > 0) {
        pro.push(new Promise(resolve => {
          fuc.toggleActions({ website: 'gleam', social: 'twitter', type: 'retweet', elements: retweets, resolve, action: 'fuck' })
        }))
      }
      if (globalConf.other.autoOpen) {
        if (socals.length > 0) {
          for (const task of socals) {
            const title = $(task).find('.entry-method-title').text().trim()
            const [
              status,
              button
            ] = [
              fuc.echoLog({ type: 'custom', text: `<li>${getI18n('doing')}:${title}...<font></font></li>` }),
              $(task).find('a.btn-info:first').attr('href')
            ]
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
        pro.push(new Promise(resolve => {
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
      Promise.all(pro).finally(() => {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        if (this.conf.fuck.verifyTask) this.verify(0)
      })
    })
  },
  verify (i = 0) {
    if ($('.ng-scope[ng-include*=challenge]').is(':visible')) {
      fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('notRobot')}</font></li>` })
      return
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
  remove (remove = false) {
    const pro = []
    if (remove) {
      const { groups, twitterUsers, retweets } = this.taskInfo
      this.updateSteamInfo(() => {
        if (this.conf.remove.leaveSteamGroup && groups.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'gleam', type: 'group', elements: groups, resolve, action: 'remove' })
          }))
        }
        if (this.conf.remove.unfollowTwitterUser && twitterUsers.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'gleam', social: 'twitter', type: 'follow', elements: twitterUsers, resolve, action: 'remove' })
          }))
        }
        if (this.conf.remove.unretweet && retweets.length > 0) {
          pro.push(new Promise(resolve => {
            fuc.toggleActions({ website: 'gleam', social: 'twitter', type: 'retweet', elements: retweets, resolve, action: 'remove' })
          }))
        }
        Promise.all(pro).finally(() => {
          fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        })
      })
    } else {
      this.get_tasks('remove')
    }
  },
  visit_link (links, i, r) {
    if (i < links.length) {
      const title = $(links[i]).find('.entry-method-title').text().trim()
      const [
        status,
        taskTime
      ] = [
        fuc.echoLog({ type: 'custom', text: `<li>${getI18n('doing')}:${title}...<font></font></li>` }),
        $(links[i]).find('.form-actions.center span:contains(Visit):contains(seconds)').text()
      ]
      if (taskTime) {
        const taskBtn = $(links[i]).find('a.btn-info')
        const href = taskBtn.attr('href')
        taskBtn.removeAttr('href')[0].click()
        const time = taskTime.match(/[\d]+/)
        if (time) {
          const url = language === 'en' ? 'https://userjs.hclonely.com/time_en.html?time=' : 'https://userjs.hclonely.com/time.html?time='
          GM_openInTab(url + time[0], { active: 1, setParent: 1 }).onclose = () => {
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
  get_giveawayId () {
    return window.location.pathname.replace(/\?.*/, '') || window.location.href
  },
  updateSteamInfo (callback) {
    new Promise(resolve => {
      if (this.taskInfo.groups.length > 0) {
        fuc.updateSteamInfo(resolve, 'community')
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
    if ($('.massive-message:contains(ended)').is(':visible')) {
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
  currentTaskInfo: {
    groups: [],
    links: [],
    twitterUsers: [],
    retweets: [],
    discords: [],
    facebooks: [],
    youtubes: [],
    others: [],
    tasks: []
  },
  taskInfo: {
    groups: [],
    twitterUsers: [],
    retweets: [],
    discords: []
  },
  setting: {},
  conf: config?.gleam?.enable ? config.gleam : globalConf
}

export { gleam }
