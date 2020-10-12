import { getI18n, language } from '../i18n'
import { fuc, throwError } from '../function/main'
import { config, globalConf, debug } from '../config'

const gleam = {
  test () {
    try {
      return window.location.host.includes('gleam.io')
    } catch (e) {
      throwError(e, 'gleam.test')
    }
  },
  fuck () {
    try {
      this.get_tasks('do_task')
    } catch (e) {
      throwError(e, 'gleam.fuck')
    }
  },
  get_tasks (callback = 'do_task') {
    try {
      const taskInfoHistory = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
      if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory
      if (callback === 'remove' && taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
        this.remove(true)
      } else {
        this.currentTaskInfo = fuc.clearTaskInfo(this.currentTaskInfo)
        const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` })
        const tasksContainer = $('div.entry-content .entry-method')
        for (const task of tasksContainer) {
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
          this.verify()
        } else {
          !fuc.isEmptyObjArr(this.taskInfo) ? this.remove(true) : fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('cannotRemove')}</font></li>` })
        }
      }
    } catch (e) {
      throwError(e, 'gleam.get_tasks')
    }
  },
  async do_task () {
    try {
      const pro = []
      await fuc.updateInfo(this.currentTaskInfo)
      pro.push(fuc.assignment(this.currentTaskInfo, this.conf.fuck, 'fuck', 'gleam'))
      const { discords, facebooks, youtubes, others, links } = this.currentTaskInfo
      const socialPlatforms = [...discords, ...facebooks, ...youtubes]
      if (globalConf.other.autoOpen) {
        if (socialPlatforms.length > 0) {
          for (const task of socialPlatforms) {
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
        pro.push(this.visit_link(links))
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
        if (this.conf.fuck.verifyTask) this.verify()
      })
    } catch (e) {
      throwError(e, 'gleam.do_task')
    }
  },
  async verify () {
    try {
      if ($('.ng-scope[ng-include*=challenge]').is(':visible')) {
        return fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('notRobot')}</font></li>` })
      }
      const tasks = $('div.entry-content .entry-method')
      for (const task of tasks) {
        if ($(task).find('i.fa-question').length > 0) {
          const title = $(task).find('.entry-method-title').text().trim()
          const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('verifyingTask')}:${title}...<font></font></li>` })
          $(task).find('a.enter-link')[0].click()
          const enterBtn = $(task).find('.form-actions.center .btn-primary:contains(Continue)').removeAttr('disabled')
          if (enterBtn.length > 0) {
            await fuc.delay(1000)
            enterBtn[0].click()
            status.warning('Complete')
          }
        }
        await fuc.delay(1000)
      }
      fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font><font class="warning">${getI18n('finishSelf')}</font></li>` })
      /* disable
      if (i < tasks.length) {
        if (tasks.eq(i).find('i.fa-question').length > 0) {
          const title = tasks.eq(i).find('.entry-method-title').text().trim()
          const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('verifyingTask')}:${title}...<font></font></li>` })
          tasks.eq(i).find('a.enter-link')[0].click()
          const enterBtn = tasks.eq(i).find('.form-actions.center .btn-primary:contains(Continue)').removeAttr('disabled')
          if (enterBtn.length > 0) {
            await fuc.delay(1000)
            enterBtn[0].click()
            status.warning('Complete')
            await fuc.delay(1000)
            gleam.verify(++i)
          } else {
            setTimeout(() => { gleam.verify(++i) }, 1000)
          }
        } else {
          this.verify(++i)
        }
      } else {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font><font class="warning">${getI18n('finishSelf')}</font></li>` })
      }
      */
    } catch (e) {
      throwError(e, 'gleam.verify')
    }
  },
  async remove (remove = false) {
    try {
      if (remove) {
        await fuc.updateInfo(this.taskInfo)
        await fuc.assignment(this.taskInfo, this.conf.remove, 'remove', 'gleam')
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
      } else {
        this.get_tasks('remove')
      }
    } catch (e) {
      throwError(e, 'gleam.remove')
    }
  },
  async visit_link (links) {
    try {
      for (const link of links) {
        const title = $(link).find('.entry-method-title').text().trim()
        const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('doing')}:${title}...<font></font></li>` })
        const taskTime = $(link).find('.form-actions.center span:contains(Visit):contains(seconds)').text()
        const url = language === 'en' ? 'https://__SITEURL__/time_en.html?time=' : 'https://__SITEURL__/time.html?time='
        let timer = null

        if (taskTime) {
          timer = taskTime.match(/[\d]+/)?.[0]
        }
        const taskBtn = $(link).find('a.btn-info')
        const href = taskBtn.attr('href')
        taskBtn.removeAttr('href')[0].click()
        await new Promise(resolve => {
          GM_openInTab(timer ? (url + timer) : 'javascript:setTimeout(()=>{window.close()},1000)', { active: 1, setParent: 1 }).onclose = () => {
            status.warning('Complete')
            taskBtn.attr('target', '_blank').attr('href', href)
            resolve()
          }
        })
      }
    } catch (e) {
      throwError(e, 'gleam.visit_link')
    }
  },
  get_giveawayId () {
    try {
      return window.location.pathname.replace(/\?.*/, '') || window.location.href
    } catch (e) {
      throwError(e, 'gleam.get_giveawayId')
    }
  },
  checkLeft () {
    try {
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
    } catch (e) {
      throwError(e, 'gleam.checkLeft')
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
