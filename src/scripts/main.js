/* global loadSettings, loadAnnouncement */
import { fuc } from './function/main'
import { language, getI18n } from './i18n'
import { config, defaultConf, globalConf } from './config'
import { website } from './website/main'

try {
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
  if (window.location.host.includes('hclonely')) {
    if (window.location.pathname.includes('setting')) {
      unsafeWindow.GM_info = GM_info // eslint-disable-line camelcase
      unsafeWindow.GM_setValue = GM_setValue // eslint-disable-line camelcase
      unsafeWindow.language = language
      typeof GM_getValue('conf')?.global?.fuck?.joinSteamGroup !== 'boolean' ? loadSettings(defaultConf) : loadSettings(config)
    } else if (window.location.pathname.includes('announcement')) {
      loadAnnouncement()
    }
  } else if (window.location.host.includes('marvelousga') && (!window.location.pathname.includes('giveaway'))) {
    fuc.newTabBlock()
  } else if (window.location.href.includes('discord.com/app')) {
    fuc.getDiscordAuth()
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
      const btnGroup = $('#fuck-task-btn .btn-group-vertical')
      if (btnGroup.css('width') === '0px') {
        btnGroup.css('width', '')
        $('#toggle-btn-group').attr('title', getI18n('hide')).text('>')
      } else {
        btnGroup.css('width', '0')
        $('#toggle-btn-group').attr('title', getI18n('show')).text('<')
      }
    })

    // 快捷键功能
    $(document).keydown(e => {
      const hotKey = globalConf.hotKey || {}
      for (const [k, v] of Object.entries(hotKey)) {
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
    })

    $('body').append(`<div id="fuck-task-info" class="card">
  <div class="card-body">
    <h3 class="card-title">${getI18n('taskLog')}</h3>
    <h4 class="card-subtitle">
      <a id="check-update" href="javascript:void(0)" targrt="_self" class="card-link iconfont icon-update_1" title="${getI18n('checkUpdate')}"></a>
      <a id="auto-task-setting" href="javascript:void(0)" data-href="https://__SITEURL__/setting${language === 'en' ? '_en' : ''}.html" targrt="_self" class="card-link iconfont icon-setting" title="${getI18n('setting')}"></a>
      <a id="auto-task-announcement" href="javascript:void(0)" data-href="https://__SITEURL__/announcement.html" targrt="_blank" class="card-link iconfont icon-announcement" title="${getI18n('visitUpdateText')}"></a>
      <a id="clean-cache" href="javascript:void(0)" targrt="_self" class="card-link iconfont icon-clean" title="${getI18n('cleanCache')}"></a>
      <a id="auto-task-feedback" href="javascript:void(0)" data-href="https://github.com/HCLonely/auto-task/issues/new/choose" targrt="_blank" class="card-link iconfont icon-feedback" title="${getI18n('feedback')}"></a>
    </h4>
    <div class="card-textarea">
    </div>
  </div>
</div>`)
    $('#clean-cache').click(() => {
      const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('cleaning')}<font></font></li>` })
      const listValues = GM_listValues()
      for (const value of listValues) {
        if (!['conf', 'language', 'steamInfo', 'discordInfo'].includes(value)) GM_deleteValue(value)
      }
      status.success()
    })
    $('#check-update').click(() => {
      fuc.checkUpdate(true)
    })
    $('#auto-task-setting,#auto-task-feedback,#auto-task-announcement').click(function () {
      window.open($(this).attr('data-href'), '_blank')
    })
    fuc.checkUpdate()

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
  }

  GM_registerMenuCommand(getI18n('readme'), () => { window.open('https://blog.hclonely.com/posts/777c60d5/', '_blank') })
  GM_registerMenuCommand(getI18n('updateSteamInfo'), () => {
    new Promise(resolve => {
      fuc.updateSteamInfo(resolve, 'all', true)
    }).then(r => {
      fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('updateSteamInfoComplete')}</font></li>` })
    })
  })
  GM_registerMenuCommand('Language', () => {
    Swal.fire({
      title: getI18n('language') + ' : ' + language,
      input: 'select',
      inputOptions: {
        auto: getI18n('auto'),
        'zh-CN': '简体中文',
        en: 'English'
      },
      confirmButtonText: getI18n('confirm'),
      cancelButtonText: getI18n('cancel'),
      showCancelButton: true
    }).then((result) => {
      if (result.value) {
        GM_setValue('language', result.value)
      }
    })
  })
} catch (e) {
  Swal.fire({
    icon: 'error',
    text: getI18n('jsError')
  })
  console.log('%c%s', 'color:white;background:red', e.stack)
}
