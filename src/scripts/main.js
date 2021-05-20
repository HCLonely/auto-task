/* global loadSettings, loadAnnouncement */
import { fuc, throwError } from './function/main'
import { language, getI18n } from './i18n'
import { config, defaultConf, globalConf } from './config'
import { website } from './website/main'
import { getId } from './function/getId'
import { notice } from './function/tool'

const pageHref = window.location.href
const pageHost = window.location.host
if (website || pageHost.includes('hclonely')) {
  GM_addStyle(GM_getResourceText('CSS'))
  $(document).ajaxError(function (event, xhr, options, exc) {
    Swal.fire({
      icon: 'error',
      text: getI18n('jsError')
    })
    console.log('%c%s', 'color:white;background:red', getI18n('ajaxError') + '：')
    console.log('Event:', event)
    console.log('XMLHttpRequest :', xhr)
    console.log('Options:', options)
    console.log('JavaScript exception:', exc)
  })
  if (pageHost !== 'auto-task.hclonely.com' && pageHost !== 'auto-task-test.hclonely.com') {
    const delayNoticeList = GM_getValue('noticeList')
    if (delayNoticeList) {
      for (const time of delayNoticeList) {
        const taskInfo = GM_getValue('delayNotice-' + time)
        const banNotice = globalConf.other.delayNoticeOnce && taskInfo.noticed
        if (((new Date().getTime() - time) / (24 * 3600 * 1000)) >= parseInt(globalConf.other.delayNoticeTime) && taskInfo && !banNotice) {
          notice({
            title: getI18n('delayNoticeTitle'),
            text: getI18n('delayNoticeText'),
            onclick: () => {
              window.open('https://__SITEURL__/notice-list.html', '_blank')
            }
          })
          if (globalConf.other.delayNoticeOnce) {
            taskInfo.noticed = true
            GM_setValue('delayNotice-' + time, taskInfo)
          }
        }
      }
    }
  }
  if (pageHost === 'auto-task.hclonely.com' || pageHost === 'auto-task-test.hclonely.com') {
    if (window.location.pathname.includes('setting')) {
      unsafeWindow.GM_info = GM_info // eslint-disable-line camelcase
      unsafeWindow.GM_setValue = GM_setValue // eslint-disable-line camelcase
      unsafeWindow.language = language
      unsafeWindow.getId = getId
      typeof GM_getValue('conf')?.global?.fuck?.joinSteamGroup !== 'boolean' ? loadSettings(defaultConf) : loadSettings(config)
    } else if (window.location.pathname.includes('announcement')) {
      loadAnnouncement()
    } else if (window.location.pathname.includes('notice-list')) {
      $('.non-js').hide()
      unsafeWindow.delayNoticeTime = globalConf.other.delayNoticeTime
      const delayNoticeList = GM_getValue('noticeList') || []
      for (const item of delayNoticeList) {
        $('body').append(addCard(GM_getValue('delayNotice-' + item)))
      }
      addLogElement()
      unsafeWindow.remove = async function remove (item) {
        try {
          const taskInfo = GM_getValue('delayNotice-' + item)?.taskInfo
          if (!taskInfo) return fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('noData')}</font></li>` })
          const conf = config?.giveawaysu?.enable ? config.giveawaysu : globalConf
          await fuc.updateInfo(taskInfo)
          await fuc.assignment(taskInfo, conf.remove, 'remove', 'giveawaysu')
          fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font></li>` })
        } catch (e) {
          throwError(e, 'remove')
        }
      }
      unsafeWindow.deleteNotice = async function deleteNotice (time) {
        fuc.deleteDelayNotice(time, fuc.echoLog)
      }
      unsafeWindow.neverNotice = async function neverNotice (time) {
        fuc.neverNotice(time)
      }
    }
  } else if (pageHost === 'marvelousga.com' && (!window.location.pathname.includes('giveaway'))) {
    fuc.newTabBlock()
  } else {
    if (website.before) website.before()

    if (globalConf.other.checkLogin && website.checkLogin) website.checkLogin()
    if (globalConf.other.checkLeft && website.checkLeft) website.checkLeft()

    let buttons = ''
    const defaultBtn = {
      fuck: {
        show: true,
        title: getI18n('fuckBtnTitle'),
        text: 'FuckTask'
      },
      verify: {
        show: true,
        title: getI18n('verifyBtnTitle'),
        text: 'Verify'
      },
      remove: {
        show: true,
        title: getI18n('removeBtnTitle'),
        text: 'Remove'
      }
    }
    const showLogs = globalConf?.other?.showLogs
    const websiteSettings = Object.assign(defaultBtn, website.setting)
    for (const [k, v] of Object.entries(websiteSettings)) {
      if (v.show) buttons += `<button id="${k}" type="button" class="btn btn-primary" title="${v.title}">${v.text}</button>`
    }
    if (showLogs) buttons += `<button id="toggle-logs" type="button" class="btn btn-primary" title="${!showLogs ? getI18n('showLog') : getI18n('hideLog')}">${!showLogs ? 'ShowLogs' : 'HideLogs'}</button>`

    const buttonGroup = `<div class="btn-group-vertical" role="group" aria-label="button">${buttons}</div>`
    $('body').append(`<div id="fuck-task-btn"><button id="toggle-btn-group" type="button" class="btn btn-outline-primary">&gt;</button>${buttonGroup}</div>`)

    for (const [k, v] of Object.entries(websiteSettings)) {
      if (v.show) {
        $('#' + k).click(() => {
          website[k]()
        })
      }
    }
    $('#toggle-logs').click(fuc.toggleLogs)
    $('#toggle-btn-group').click(() => {
      try {
        const btnGroup = $('#fuck-task-btn .btn-group-vertical')
        if (btnGroup.css('width') === '0px') {
          btnGroup.css('width', '')
          $('#toggle-btn-group').attr('title', getI18n('hide')).text('>')
        } else {
          btnGroup.css('width', '0')
          $('#toggle-btn-group').attr('title', getI18n('show')).text('<')
        }
      } catch (e) {
        throwError(e, '$(\'#toggle-btn-group\').click')
      }
    })

    // INFO: 快捷键功能
    $(document).keydown(e => {
      try {
        const hotKey = globalConf.hotKey || {}
        for (const [k, v] of Object.entries(hotKey)) {
          if (!k || !v) break
          const keys = v.split('+')
          const functionKey = keys.length === 2 ? e[keys[0].toLowerCase().trim() + 'Key'] : true
          if (functionKey && keys[1].toLowerCase().trim() === e.key) {
            switch (k) {
              case 'fuckKey':
                website.fuck()
                break
              case 'verifyKey':
                website.verify()
                break
              case 'removeKey':
                website.remove()
                break
              case 'toggleLogKey':
                fuc.toggleLogs()
                break
            }
          }
        }
      } catch (e) {
        throwError(e, '$(document).keydown')
      }
    })
    addLogElement()
    // $('.fuck-task-logs .el-notification__content').show()
    if (!showLogs) {
      $('#fuck-task-logs').animate({
        right: '-100%',
        display: '-webkit-box',
        display: '-ms-flexbox', // eslint-disable-line no-dupe-keys
        display: 'flex' // eslint-disable-line no-dupe-keys
      }, 0)
    }
    if (website.after) website.after()

    GM_addValueChangeListener('steamInfo', (name, oldValue, newValue, remote) => {
      window.steamInfo = Object.assign(steamInfo, newValue)
    })
    GM_addValueChangeListener('discordInfo', (name, oldValue, newValue, remote) => {
      window.discordInfo = Object.assign(discordInfo, newValue)
    })
    GM_addValueChangeListener('twitchInfo', (name, oldValue, newValue, remote) => {
      window.twitchInfo = Object.assign(twitchInfo, newValue)
    })
    GM_addValueChangeListener('twitterInfo', (name, oldValue, newValue, remote) => {
      window.twitterInfo = Object.assign(twitterInfo, newValue)
    })
    GM_addValueChangeListener('redditInfo', (name, oldValue, newValue, remote) => {
      window.redditInfo = Object.assign(redditInfo, newValue)
    })
    GM_addValueChangeListener('youtubeInfo', (name, oldValue, newValue, remote) => {
      window.youtubeInfo = Object.assign(youtubeInfo, newValue)
    })

    GM_registerMenuCommand('FuckTask', website.fuck)
    GM_registerMenuCommand('Verify', website.verify)
    GM_registerMenuCommand('Remove', website.remove)
    GM_registerMenuCommand('toggleLogs', fuc.toggleLogs)
  }

  GM_registerMenuCommand(getI18n('readme'), () => {
    try {
      window.open('https://auto-task-doc.js.org', '_blank')
    } catch (e) {
      throwError(e, 'GM_registerMenuCommand(\'readme\')')
    }
  })
  GM_registerMenuCommand(getI18n('updateSteamInfo'), async () => {
    try {
      if (await fuc.updateSteamInfo('all', true)) {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('updateSteamInfoComplete')}</font></li>` })
      } else {
        fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('updateSteamInfoFailed')}</font></li>` })
      }
    } catch (e) {
      throwError(e, 'GM_registerMenuCommand(\'updateSteamInfo\')')
    }
  })
  GM_registerMenuCommand('Language', () => {
    try {
      const inputOptions = {
        auto: getI18n('auto')
      }
      for (const lang of Object.values(i18n)) {
        const { ISO, languageName } = lang
        if (ISO && languageName) inputOptions[ISO] = languageName
      }
      Swal.fire({
        title: getI18n('language') + ' : ' + language,
        input: 'select',
        inputOptions,
        confirmButtonText: getI18n('confirm'),
        cancelButtonText: getI18n('cancel'),
        showCancelButton: true
      }).then((result) => {
        if (result.value) {
          GM_setValue('language', result.value)
        }
      })
    } catch (e) {
      throwError(e, 'GM_registerMenuCommand(\'Language\')')
    }
  })
} else if (pageHost === 'discord.com') {
  fuc.getDiscordAuth()
} else if (pageHost === 'www.twitch.tv') {
  if (pageHref.includes('#updateTwitchInfo')) {
    fuc.updateTwitchInfo(true)
  } else if (!pageHref.includes('/login')) {
    fuc.updateTwitchInfo(false)
  }
} else if (pageHost === 'www.youtube.com') {
  if (pageHref.includes('#updateYtbInfo')) {
    fuc.updateYtbInfo(true)
  } else {
    fuc.updateYtbInfo(false)
  }
}

function addLogElement () {
  $('body').append(`<div id="fuck-task-info" class="card">
  <div class="card-body">
    <h3 class="card-title">${getI18n('taskLog')}</h3>
    <h4 class="card-subtitle">
      <a id="check-update" href="javascript:void(0)" terget="_self" class="card-link iconfont icon-update_1" title="${getI18n('checkUpdate')}"></a>
      <a id="auto-task-setting" href="javascript:void(0)" data-href="https://__SITEURL__/setting.html" terget="_self" class="card-link iconfont icon-setting" title="${getI18n('setting')}"></a>
      <a id="delay-notice-list" href="javascript:void(0)" data-href="https://__SITEURL__/notice-list.html" terget="_self" class="card-link" title="${getI18n('noticeList')}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-list" viewBox="0 0 16 16">
          <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
          <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
        </svg>
      </a>
      <a id="clean-cache" href="javascript:void(0)" terget="_self" class="card-link iconfont icon-clean" title="${getI18n('cleanCache')}"></a>
      <a id="auto-task-feedback" href="javascript:void(0)" data-href="https://github.com/HCLonely/auto-task/issues/new/choose" terget="_blank" class="card-link iconfont icon-feedback" title="${getI18n('feedback')}"></a>
    </h4>
    <div class="card-textarea">
    </div>
  </div>
</div>`)
  $('#clean-cache').click(() => {
    try {
      const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('cleaning')}<font></font></li>` })
      const listValues = GM_listValues()
      for (const value of listValues) {
        if (!['conf', 'language', 'steamInfo', 'discordInfo', 'insInfo', 'twitchInfo', 'twitterInfo', 'redditInfo', 'youtubeInfo', 'noticeList'].includes(value) && !value.includes('delayNotice-') && !value.includes('-cache')) GM_deleteValue(value)
      }
      status.success()
    } catch (e) {
      throwError(e, '$(\'#clean-cache\').click')
    }
  })
  $('#check-update').click(() => {
    try {
      fuc.checkUpdate(true)
    } catch (e) {
      throwError(e, '$(\'#check-update\').click')
    }
  })
  $('#auto-task-setting,#auto-task-feedback,#delay-notice-list').click(function () {
    try {
      window.open($(this).attr('data-href'), '_blank')
    } catch (e) {
      throwError(e, '$(\'#auto-task-setting,#auto-task-feedback\').click')
    }
  })
  fuc.checkUpdate()
}
