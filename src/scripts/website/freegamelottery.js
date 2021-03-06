/* global DashboardApp */
import { getI18n } from '../i18n'
import { fuc, throwError } from '../function/main'
import { config, globalConf } from '../config'

const freegamelottery = {
  test () {
    try {
      return window.location.host.includes('freegamelottery')
    } catch (e) {
      throwError(e, 'freegamelottery.test')
    }
  },
  after () {
    try {
      if (window.location.host === 'd.freegamelottery.com' && GM_getValue('lottery') === 1) this.draw()
    } catch (e) {
      throwError(e, 'freegamelottery.after')
    }
  },
  async fuck () {
    try {
      GM_setValue('lottery', 1)
      if ($('a.registration-button').length > 0) {
        if (this.conf.fuck.autoLogin) {
          const userInfo = GM_getValue('conf').freegamelottery.userInfo
          if (userInfo) {
            const logStatus = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('logining')}<font></font></li>` })
            const { result, statusText, status, data } = await fuc.httpRequest({
              url: 'https://freegamelottery.com/user/login',
              method: 'POST',
              data: `username=${userInfo.username}&password=${userInfo.password}&rememberMe=1`,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
              }
            })
            if (result === 'Success') {
              if (data.status === 200) {
                logStatus.success()
                window.location.reload(true)
              } else {
                logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
              }
            } else {
              logStatus.error(`${result}:${statusText}(${status})`)
            }
          } else {
            $('body').overhang({
              type: 'warn',
              activity: 'notification',
              message: getI18n('needLogin')
            })
            $('a.registration-button')[0].click()
            $('button[value=Login]').click(() => {
              const conf = GM_getValue('conf')
              conf.freegamelottery.userInfo = { username: $('#modal_login').val(), password: $('#modal_password').val() }
              GM_setValue('conf', conf)
            })
          }
        } else {
          $('body').overhang({
            type: 'warn',
            activity: 'notification',
            message: getI18n('needLogin')
          })
          $('a.registration-button')[0].click()
        }
      } else {
        this.draw()
      }
    } catch (e) {
      throwError(e, 'freegamelottery.fuck')
    }
  },
  draw () {
    try {
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
    } catch (e) {
      throwError(e, 'freegamelottery.draw')
    }
  },
  setting: {
    verify: {
      show: false
    },
    remove: {
      show: false
    }
  },
  conf: config?.freegamelottery?.enable ? config.freegamelottery : globalConf
}

export { freegamelottery }
