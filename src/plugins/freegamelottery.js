/* global getI18n, fuc, defaultConf, DashboardApp */
const freegamelottery = { // eslint-disable-line no-unused-vars
  test () { return window.location.host.includes('freegamelottery') },
  after (website) {
    if (window.location.host === 'd.freegamelottery.com' && GM_getValue('lottery') === 1) website.draw()
  },
  fuck (vue) {
    GM_setValue('lottery', 1)
    if ($('a.registration-button').length > 0) {
      if (this.conf.fuck.autoLogin) {
        const userInfo = GM_getValue('conf').lotteryUserInfo
        if (userInfo) {
          const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('logining')}<font></font></li>` })
          fuc.httpRequest({
            url: 'https://freegamelottery.com/user/login',
            method: 'POST',
            data: `username=${userInfo.username}&password=${userInfo.password}&rememberMe=1`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            onload (data) {
              if (data.status === 200) {
                status.success()
                window.location.reload(true)
              } else {
                status.error('Error:' + (data.statusText || data.status))
              }
            },
            status
          })
        } else {
          vue.$message({ type: 'warning', message: getI18n('needLogin') })
          $('a.registration-button')[0].click()
          $('button[value=Login]').click(() => {
            const conf = GM_getValue('conf')
            conf.lotteryUserInfo = { username: $('#modal_login').val(), password: $('#modal_password').val() }
            GM_setValue('conf', conf)
          })
        }
      } else {
        vue.$message({ type: 'warning', message: getI18n('needLogin') })
        $('a.registration-button')[0].click()
      }
    } else {
      this.draw()
    }
  },
  draw () {
    GM_setValue('lottery', 0)
    if (this.conf.fuck.doTask) {
      const main = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('fglTimeout', 'Visit MAIN DRAW')}<font></font></li>` })
      $.post('/draw/register-visit', { drawId: DashboardApp.draws.main.actual.id })
        .done(() => {
          DashboardApp.draws.main.actual.haveVisited = true
          main.success()
          const survey = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('fglTimeout', 'Visit SURVEY DRAW')}<font></font></li>` })
          $.post('/draw/register-visit', { type: 'survey', drawId: DashboardApp.draws.survey.actual.id })
            .done(() => {
              DashboardApp.draws.survey.actual.haveVisited = 1
              survey.success()
              const video = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('fglTimeout', 'Visit VIDEO DRAW')}<font></font></li>` })
              $.post('/draw/register-visit', { drawId: DashboardApp.draws.video.actual.id })
                .done(() => {
                  DashboardApp.draws.video.actual.haveVisited = true
                  video.success()
                  const stackpot = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('fglTimeout', 'Visit STACKPOT')}<font></font></li>` })
                  $.post('/draw/register-visit', { type: 'stackpot', drawId: DashboardApp.draws.stackpot.actual.id })
                    .done(() => {
                      DashboardApp.draws.stackpot.actual.haveVisited = 1
                      stackpot.success()
                      fuc.echoLog({ type: 'custom', text: `<li>${getI18n('fglComplete')}<font></font></li>` })
                      window.location.href = '/#/draw/stackpot'
                      window.location.reload(true)
                    })
                })
            })
        })
    }
  },
  setting: {
    fuck: true,
    verify: false,
    join: false,
    remove: false
  },
  conf: GM_getValue('conf')?.freegamelottery?.load ? GM_getValue('conf').freegamelottery : (GM_getValue('conf')?.global || defaultConf)
}