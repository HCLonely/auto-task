/* global getI18n, fuc, plugins, config, globalConf, defaultConf, getLanguage, language, Swal, loadSetting, loadAnnouncement */
if (window.location.host.includes('hclonely')) {
  if (window.location.pathname.includes('setting')) {
    loadSetting(config)
  } else if (window.location.pathname.includes('announcement')) {
    loadAnnouncement()
  }
} else if ((window.location.host.includes('marvelousga') || window.location.host.includes('dupedornot') || window.location.host.includes('gamecode.win')) && (!window.location.pathname.includes('giveaway'))) {
  fuc.newTabBlock()
} else {
  let website = {}
  plugins.map((e, i) => {
    if (e.test()) {
      website = e
      if (website.before) website.before(website)
    }
  })

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
  for (const [k, v] of Object.entries(website.setting)) {
    if (v.show) buttons += `<button id="${k}" type="button" class="btn btn-primary" title="${v.title || defaultBtn[k].title}">${v.text || defaultBtn[k].text}</button>`
  }
  if (showLogs) buttons += `<button id="show-logs" type="button" class="btn btn-primary" title="${!showLogs ? getI18n('showLog') : getI18n('hideLog')}">${!showLogs ? 'ShowLogs' : 'HideLogs'}</button>`

  const buttonGroup = `<div class="btn-group" role="group" aria-label="button">${buttons}</div>`
  $('body').append(`<div id="fuck-task-app">${buttonGroup}</div>`)

  for (const [k, v] of Object.keys(website.setting)) {
    if (v.show) {
      $('#' + k).click(() => {
        website[k]()
      })
    }
  }
  $('#show-logs').click(() => {
    const btn = $('#show-logs')
    const taskInfoDiv = $('#fuck-task-info')
    if (taskInfoDiv.is(':hidden')) {
      btn.text('HideLogs').attr('title', getI18n('hideLog'))
      taskInfoDiv.animate({ right: '16px' }, 'fast')
    } else {
      btn.text('ShowLogs').attr('title', getI18n('showLog'))
      taskInfoDiv.animate({ right: '-100%' }, 'fast')
    }
  })

  const btnArea = new Vue({
    el: '#fuck-task-btn',
    data: {
      icon: 'el-icon-arrow-right',
      title: getI18n('hide'),
      show: true,
      style: `position:absolute;left:-20px;width:20px;border:0px;border-top-right-radius:0px;border-bottom-right-radius:0px;padding:0;height:${btnNum * 40}px;opacity:80%;`,
      buttons: [
        {
          id: 'fuck-task',
          text: website.setting.fuckText || 'FuckTask',
          title: website.setting.fuckTitle || getI18n('fuckBtnTitle'),
          show: website.setting.fuck,
          click: () => { website.fuck(btnArea) }
        },
        {
          id: 'verify-task',
          text: website.setting.verifyText || 'Verify',
          title: website.setting.verifyTitle || getI18n('verifyBtnTitle'),
          show: website.setting.verify,
          click: () => { website.verify() }
        },
        {
          id: 'join-task',
          text: website.setting.joinText || 'Join',
          title: website.setting.joinDes || getI18n('joinBtnTitle'),
          show: website.setting.join,
          click: () => { website.join() }
        },
        {
          id: 'remove-task',
          text: website.setting.removeText || 'Remove',
          title: website.setting.removeTitle || getI18n('removeBtnTitle'),
          show: website.setting.remove,
          click: () => { website.remove() }
        }
      ],
      drawerBtn: {
        id: 'show-logs',
        text: !showLogs ? 'ShowLogs' : 'HideLogs',
        title: !showLogs ? getI18n('showLog') : getI18n('hideLog'),
        show: !!showLogs
      }
    },
    methods: {
      toggleThisDiv () {
        if (this.show) {
          this.icon = 'el-icon-arrow-left'
          this.title = getI18n('show')
          $('#fuck-task-btn').animate({ width: '0' })
        } else {
          this.icon = 'el-icon-arrow-right'
          this.title = getI18n('hide')
          $('#fuck-task-btn').animate({ width: '110' })
        }
        this.show = !this.show
      },
      toggle () {
        if (this.drawerBtn.show) {
          this.drawerBtn.text = 'ShowLogs'
          this.drawerBtn.title = getI18n('showLog')
          $('.fuck-task-logs').animate({ right: '-100%' }, 'fast')
        } else {
          this.drawerBtn.text = 'HideLogs'
          this.drawerBtn.title = getI18n('hideLog')
          $('.fuck-task-logs').animate({ right: '16px' }, 'fast')
        }
        this.drawerBtn.show = !this.drawerBtn.show
      }
    }
  })
  new Vue({
    el: '#fuck-task-info'
  }).$notify({
    title: getI18n('taskLog'),
    iconClass: '',
    duration: 0,
    position: 'bottom-right',
    showClose: false,
    customClass: 'fuck-task-logs',
    dangerouslyUseHTMLString: true,
    message: ''
  })
  $('.fuck-task-logs .el-notification__title').before(`
<h2 v-cloak id="extraBtn" class="el-notification__title">
<el-badge is-dot class="item" :hidden="hidden">
  <el-button :icon="icon" :title="title" @click="checkUpdate" circle></el-button>
</el-badge>
<el-badge is-dot class="item" :hidden="settingHidden">
  <el-button icon="el-icon-setting" title="${getI18n('setting')}" @click="setting" circle></el-button>
</el-badge>
<el-badge is-dot class="item" :hidden="announcementHidden">
  <el-button :icon="announcementIcon" title="${getI18n('visitUpdateText')}" @click="updateText" circle></el-button>
</el-badge>
<el-badge is-dot class="item" :hidden="otherHidden">
  <el-button icon="el-icon-brush" title="${getI18n('cleanCache')}" @click="clearTemp" circle></el-button>
</el-badge>
<el-badge is-dot class="item" :hidden="otherHidden">
  <el-button icon="el-icon-s-promotion" title="${getI18n('feedback')}" @click="updateBug" circle></el-button>
</el-badge>
</h2>
`)
  const extraBtn = new Vue({
    el: '#extraBtn',
    data: {
      title: getI18n('checkUpdate'),
      icon: 'el-icon-refresh',
      hidden: true,
      settingHidden: !!GM_getValue('conf'),
      otherHidden: true,
      announcementHidden: true,
      announcementIcon: 'el-icon-document'
    },
    methods: {
      setting () {
        language === 'en' ? window.open('https://userjs.hclonely.com/setting_en.html', '_blank') : window.open('https://userjs.hclonely.com/setting.html', '_blank')
      },
      updateText () {
        fuc.getAnnouncement(this)
      },
      updateBug () {
        window.open('https://github.com/HCLonely/auto-task/issues/new/choose', '_blank')
      },
      checkUpdate () {
        fuc.checkUpdate(this, true)
      },
      clearTemp () {
        const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('cleaning')}<font></font></li>` })
        const listValues = GM_listValues()
        for (const value of listValues) {
          if (value !== 'conf' && value !== 'language') GM_deleteValue(value)
        }
        status.success()
      }
    }
  })

  // if (globalConf.other.checkUpdate) fuc.checkUpdate(extraBtn)

  $('.fuck-task-logs .el-notification__content').show()
  if (!showLogs) {
    $('#fuck-task-logs').animate({
      right: '-100%',
      display: '-webkit-box',
      display: '-ms-flexbox', // eslint-disable-line no-dupe-keys
      display: 'flex' // eslint-disable-line no-dupe-keys
    }, 0)
  }
  if (website.after) website.after(website)
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
      'zh-cn': '简体中文',
      en: 'English'
    },
    confirmButtonText: getI18n('confirm'),
    cancelButtonText: getI18n('cancel'),
    type: 'info'
  }).then((result) => {
    if (result.value) {
      GM_setValue('language', result.value)
      language = getLanguage() // eslint-disable-line no-global-assign
    }
  })
})
