import { getI18n } from '../i18n'
import { fuc, throwError } from '../function/main'
import { config, globalConf, debug } from '../config'

unsafeWindow.test = async function () {
  const logStatus = fuc.echoLog({ type: 'custom', text: '<li>restore page<font></font></li>' })
  const { result, statusText, status, data } = await fuc.httpRequest({
    method: 'GET',
    url: window.location.href
  })
  if (result === 'Success') {
    const html = $(data.responseText.replace(/<(head|body)>/g, '<div class="$1">').replace('<html', '<div class="html"').replace(/<\/(head|body|html)>/g, '</div>'))
    const headEles = html.find('div.head').children()
    const bodyEle = html.find('div.body')
    $('head').children().remove()
    $('head').append(headEles)
    const mainEleIndex = $('body').children('.wrapper-outer').index()
    const mainRawEleIndex = bodyEle.children('.wrapper-outer').index()
    const beforeRawEles = $('body').children(':lt(' + mainRawEleIndex + ')')
    const afterRawEles = $('body').children(':gt(' + mainRawEleIndex + ')')
    $('body').children(':lt(' + mainEleIndex + ')').remove()
    $('body').prepend(beforeRawEles)
    $('body').children(':gt(' + mainEleIndex + ')').remove()
    $('body').append(afterRawEles)
    $('html').children().not('head,body').remove()
    $('#getKey').show()
  } else {
    logStatus.error(`${result}:${statusText}(${status})`)
  }
}
const giveawaysu = {
  test () {
    try {
      return window.location.host === 'giveaway.su'
    } catch (e) {
      throwError(e, 'giveawaysu.test')
    }
  },
  after () {
    try {
      GM_addStyle('#getKey{display:none!important;}')
      fuc.echoLog({ type: 'custom', text: `<li style="color:blue !important;">${getI18n('gsNotice')}<font></font></li>` })
    } catch (e) {
      throwError(e, 'giveawaysu.after')
    }
  },
  get_tasks (e) {
    try {
      const taskInfo = GM_getValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']')
      if (taskInfo && !fuc.isEmptyObjArr(taskInfo) && e === 'remove') {
        this.taskInfo = taskInfo
        this.do_task('remove')
      } else {
        if (taskInfo && !fuc.isEmptyObjArr(taskInfo)) this.taskInfo = taskInfo
        const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` })
        const tasks = $('#actions tr')
        if ($('div.bind-discord').is(':visible')) $('div.bind-discord a')[0].click()
        if ($('div.bind-twitch').is(':visible')) $('div.bind-twitch a')[0].click()
        for (const task of tasks) {
          const td = $(task).find('td:not(".hidden")')
          const colorfulTask = td.eq(1).find('a:not([data-trigger="link"])')
          const colorlessTask = td.eq(2).find('a:not([data-trigger="link"])')
          const taskDes = colorfulTask.length > 0 ? colorfulTask : colorlessTask
          const taskIcon = td.eq(0).find('i').attr('class')
          const taskInfo = this.which_task(taskDes, taskIcon)
          for (const info of taskInfo) {
            if (info.name !== 'nonSteam' && this.taskInfo[info.name + 's']) {
              this.taskInfo[info.name + 's'].push(info.link)
              this.taskInfo.links.push(info.link)
            }
          }
        }
        status.success()
        this.getFinalUrl(e)
      }
    } catch (e) {
      throwError(e, 'giveawaysu.get_tasks')
    }
  },
  which_task (taskDes, taskIcon = '') {
    try {
      const [taskInfo, taskName, link] = [[], taskDes.text().trim(), taskDes.attr('href')]
      if (taskIcon.includes('ban') || /disable adblock/gim.test(taskName)) {
        return [{ name: 'nonSteam' }]
      } else if (/join.*steam.*group/gim.test(taskName)) {
        taskInfo.push({ name: 'group', link })
      } else if (/like.*announcement/gim.test(taskName)) {
        taskInfo.push({ name: 'announcement', link })
      } else if (/(follow|subscribe).*publisher/gim.test(taskName)) {
        taskInfo.push({ name: 'publisher', link })
      } else if (/(follow|subscribe).*franchise/gim.test(taskName)) {
        taskInfo.push({ name: 'franchise', link })
      } else if (/(follow|subscribe).*developer/gim.test(taskName)) {
        taskInfo.push({ name: 'developer', link })
      } else if (/(follow|subscribe).*curator/gim.test(taskName)) {
        taskInfo.push({ name: 'curator', link })
      } else if (/subscribe.*steam.*forum/gim.test(taskName)) {
        taskInfo.push({ name: 'forum', link })
      } else if (taskIcon.includes('discord') || /join.*discord/gim.test(taskName)) {
        taskInfo.push({ name: 'discord', link })
      } else if (taskIcon.includes('instagram') || /follow.*instagram/gim.test(taskName)) {
        taskInfo.push({ name: 'instagram', link })
      } else if (taskIcon.includes('twitch') || /follow.*twitch.*channel/gim.test(taskName)) {
        taskInfo.push({ name: 'twitch', link })
      } else if (taskIcon.includes('reddit') || /subscribe.*subreddit/gim.test(taskName) || /follow.*reddit/gim.test(taskName)) {
        taskInfo.push({ name: 'reddit', link })
      } else if (/subscribe.*youtube.*channel/gim.test(taskName)) {
        taskInfo.push({ name: 'youtubeChannel', link })
      } else if (/(watch|like).*youtube.*video/gim.test(taskName) || ((taskIcon.includes('youtube') || taskIcon.includes('thumbs-up')) && /(watch|like).*video/gim.test(taskName))) {
        taskInfo.push({ name: 'youtubeVideo', link })
      } else if (taskIcon.includes('vk') || /join.*vk.*group/gim.test(taskName)) {
        taskInfo.push({ name: 'vk', link })
      } else {
        if (/(on twitter)|(Follow.*on.*Facebook)/gim.test(taskName)) {
          // this.taskInfo.links.push(link)
        } else {
          if (/wishlist.*game|add.*wishlist/gim.test(taskName)) {
            taskInfo.push({ name: 'wGame', link })
          }
          if (/follow.*button/gim.test(taskName)) {
            taskInfo.push({ name: 'fGame', link })
          }
        }
        if (taskInfo.length === 0) return [{ name: 'nonSteam' }]
      }
      return taskInfo
    } catch (e) {
      throwError(e, 'giveawaysu.which_task')
    }
  },
  getFinalUrl (e) {
    try {
      const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('processTasksUrl')}<font></font></li>` })
      const pro = []

      for (const link of this.taskInfo.links) {
        if (this.taskInfo.toFinalUrl[link]) continue
        pro.push(fuc.httpRequest({
          url: link,
          method: 'GET'
        })
          .then(({ result, statusText, status, data }) => {
            if (data?.finalUrl?.includes('newshub/app')) {
              const div = data.responseText.match(/<div id="application_config"[\w\W]*?>/)?.[0]
              if (!div) {
                return { finalUrl: data.finalUrl, url: link }
              }
              const appConfig = $(div)
              const { authwgtoken } = JSON.parse(appConfig.attr('data-userinfo'))
              const { clanAccountID } = JSON.parse(appConfig.attr('data-groupvanityinfo'))[0]
              return { finalUrl: `${data.finalUrl}?authwgtoken=${authwgtoken}&clanid=${clanAccountID}`, url: link }
            } else {
              return { finalUrl: data.finalUrl, url: link }
            }
          }))
      }
      Promise.all(pro).then(data => {
        for (const r of data) {
          if (r.finalUrl) {
            this.taskInfo.toFinalUrl[r.url] = r.finalUrl
          }
        }
        this.links = fuc.unique(this.links)
        this.taskInfo = fuc.uniqueTaskInfo(this.taskInfo)
        GM_setValue('taskInfo[' + window.location.host + this.get_giveawayId() + ']', this.taskInfo)
        status.success()
        if (debug) console.log(this)
        e === 'doTask' ? this.do_task('fuck') : this.do_task('remove')
      }).catch(error => {
        status.error()
        if (debug) console.log(error)
      })
    } catch (e) {
      throwError(e, 'giveawaysu.getFinalUrl')
    }
  },
  async do_task (action) {
    try {
      await fuc.updateInfo(this.taskInfo)
      await fuc.assignment(this.taskInfo, this.conf[action], action, 'giveawaysu')
      fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
      if (action === 'fuck') {
        fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('closeExtensions')}</font></li>` })
        if (globalConf.other.delayNotice) fuc.addDelayNotice(this.taskInfo, fuc.echoLog, globalConf.other.delayNoticeTime)
      }
    } catch (e) {
      throwError(e, 'giveawaysu.do_task')
    }
  },
  fuck () {
    try {
      this.get_tasks('doTask')
    } catch (e) {
      throwError(e, 'giveawaysu.fuck')
    }
  },
  async verify () {
    const { isConfirmed } = await Swal.fire({
      title: getI18n('RePageNotice'),
      showCancelButton: true
    })
    if (!isConfirmed) return
    const logStatus = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('resettingPage')}...<font></font></li>` })
    const { result, statusText, status, data } = await fuc.httpRequest({
      method: 'GET',
      url: window.location.href
    })
    if (result === 'Success') {
      const html = $(data.responseText.replace(/<(head|body)>/g, '<div class="$1">').replace('<html', '<div class="html"').replace(/<\/(head|body|html)>/g, '</div>'))
      const headEles = html.find('div.head').children()
      const bodyEle = html.find('div.body')
      $('head').children().remove()
      $('head').append(headEles)
      const mainEleIndex = $('body').children('.wrapper-outer').index()
      const mainRawEleIndex = bodyEle.children('.wrapper-outer').index()
      const beforeRawEles = bodyEle.children(':lt(' + mainRawEleIndex + ')')
      const afterRawEles = bodyEle.children(':gt(' + mainRawEleIndex + ')')
      $('body').children(':lt(' + mainEleIndex + ')').remove()
      $('body').prepend(beforeRawEles)
      $('body').children(':gt(' + mainEleIndex + ')').remove()
      $('body').append(afterRawEles)
      $('html').children().not('head,body').remove()
      $('#getKey').show()
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
    }
  },
  remove () {
    try {
      this.get_tasks('remove')
    } catch (e) {
      throwError(e, 'giveawaysu.remove')
    }
  },
  get_giveawayId () {
    try {
      return window.location.href.match(/view\/([\d]+)/)?.[1] || window.location.href
    } catch (e) {
      throwError(e, 'giveawaysu.get_giveawayId')
    }
  },
  checkLogin () {
    try {
      if ($('a.steam-login').length > 0) window.open('/steam/redirect', '_self')
    } catch (e) {
      throwError(e, 'giveawaysu.checkLogin')
    }
  },
  checkLeft () {
    try {
      if ($('.giveaway-ended').length > 0) {
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
      throwError(e, 'giveawaysu.checkLeft')
    }
  },
  taskInfo: {
    groups: [],
    forums: [],
    curators: [],
    publishers: [],
    developers: [],
    franchises: [],
    fGames: [],
    wGames: [],
    announcements: [],
    discords: [],
    instagrams: [],
    twitchs: [],
    reddits: [],
    youtubeChannels: [],
    youtubeVideos: [],
    vks: [],
    links: [],
    toFinalUrl: {}
  },
  setting: {
    verify: {
      show: true,
      text: 'RePage',
      title: getI18n('RePage')
    }
  },
  conf: config?.giveawaysu?.enable ? config.giveawaysu : globalConf
}

export { giveawaysu }
