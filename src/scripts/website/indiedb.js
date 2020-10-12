/* global urlPath */
import { getI18n } from '../i18n'
import { fuc, throwError } from '../function/main'
import { config, globalConf, debug } from '../config'

const indiedb = {
  test () {
    try {
      return window.location.host.includes('indiedb')
    } catch (e) {
      throwError(e, 'indiedb.test')
    }
  },
  async fuck () {
    try {
      if ($('a.buttonenter:contains(Register to join)').length > 0) fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('needLogin')}</font></li>` })
      const currentoption = $('a.buttonenter.buttongiveaway')
      if (/join giveaway/gim.test(currentoption.text())) {
        const logStatus = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('joinGiveaway')}<font></font></li>` })
        const { result, statusText, status, data } = await fuc.httpRequest({
          url: currentoption.attr('href'),
          method: 'POST',
          data: 'ajax=t',
          dataType: 'json',
          headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            accept: 'application/json, text/javascript, */*; q=0.01'
          }
        })
        if (result === 'Success') {
          if (data.status === 200) {
            if (data.response?.success) {
              currentoption.addClass('buttonentered').text('Success - Giveaway joined')
              $('#giveawaysjoined').slideDown()
              $('#giveawaysrecommend').slideDown()
              logStatus.success('Success' + (data.response?.text ? (':' + data.response?.text) : ''))
              this.do_task()
            } else {
              logStatus.error('Error' + (data.response?.text ? (':' + data.response?.text) : ''))
            }
          } else {
            logStatus.error('Error:' + data.statusText + '(' + data.status + ')')
          }
        } else {
          logStatus.error(`${result}:${statusText}(${status})`)
        }
      } else if (/success/gim.test($('a.buttonenter.buttongiveaway').text())) {
        this.do_task()
      } else {
        fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('needJoinGiveaway')}</font></li>` })
      }
    } catch (e) {
      throwError(e, 'indiedb.fuck')
    }
  },
  do_task () {
    try {
      const id = $('script').map((i, e) => {
        if (/\$\(document\)/gim.test(e.innerHTML)) {
          return [
            e.innerHTML.match(/"\/[\d]+"/gim)[0].match(/[\d]+/)[0],
            e.innerHTML.match(/"\/newsletter\/ajax\/subscribeprofile\/optin\/[\d]+"/gim)[0].match(/[\d]+/)[0]
          ]
        }
      })
      if (id.length === 2) {
        const pro = []
        const tasks = $('#giveawaysjoined a[class*=promo]')
        for (const task of tasks) {
          const promo = $(task)
          if (!promo.hasClass('buttonentered')) {
            const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('doing')}:${promo.parents('p').text()}...<font></font></li>` })
            if (/facebookpromo|twitterpromo|visitpromo/gim.test(task.className)) {
              pro.push(new Promise(resolve => {
                $.ajax({
                  type: 'POST',
                  url: urlPath('/giveaways/ajax/' + (promo.hasClass('facebookpromo') ? 'facebookpromo' : (promo.hasClass('twitterpromo') ? 'twitterpromo' : 'visitpromo')) + '/' + id[0]),
                  timeout: 60000,
                  dataType: 'json',
                  data: { ajax: 't' },
                  error (response, error, exception) {
                    if (debug) console.log({ response, error, exception })
                    status.error('Error:An error has occurred performing the action requested. Please try again shortly.')
                    resolve()
                  },
                  success (response) {
                    if (debug) console.log(response)
                    if (response.success) {
                      status.success('Success:' + response.text)
                      promo.addClass('buttonentered').closest('p').html(promo.closest('p').find('span').html())
                      resolve()
                    } else {
                      status.error('Error:' + response.text)
                      resolve()
                    }
                  }
                })
              }))
            } else if (promo.hasClass('emailoptinpromo')) {
              pro.push(new Promise(resolve => {
                $.ajax({
                  type: 'POST',
                  url: urlPath('/newsletter/ajax/subscribeprofile/optin/' + id[1]),
                  timeout: 60000,
                  dataType: 'json',
                  data: { ajax: 't', emailsystoggle: 4 },
                  error (response, error, exception) {
                    if (debug) console.log({ response, error, exception })
                    status.error('Error:An error has occurred performing the action requested. Please try again shortly.')
                    resolve()
                  },
                  success (response) {
                    if (debug) console.log(response)
                    if (response.success) {
                      status.success('Success:' + response.text)
                      promo.toggleClass('buttonentered').closest('p').html(promo.closest('p').find('span').html())
                      resolve()
                    } else {
                      status.error('Error:' + response.text)
                      resolve()
                    }
                  }
                })
              }))
            } else if (promo.hasClass('watchingpromo')) {
              pro.push(new Promise(resolve => {
                const data = fuc.getUrlQuery(promo.attr('href'))
                data.ajax = 't'
                $.ajax({
                  type: 'POST',
                  url: urlPath(promo.attr('href').split(/[?#]/)[0]),
                  timeout: 60000,
                  dataType: 'json',
                  data: data,
                  error (response, error, exception) {
                    if (debug) console.log({ response, error, exception })
                    status.error('Error:An error has occurred performing the action requested. Please try again shortly.')
                    resolve()
                  },
                  success (response) {
                    if (debug) console.log(response)
                    if (response.success) {
                      status.success('Success:' + response.text)
                      promo.toggleClass('buttonentered').closest('p').html(promo.closest('p').find('span').html())
                      resolve()
                    } else {
                      status.error('Error:' + response.text)
                      resolve()
                    }
                  }
                })
              }))
            } else if (!/the-challenge-of-adblock/gim.test(promo.attr('href'))) {
              pro.push(new Promise(resolve => {
                $.ajax({
                  type: 'POST',
                  url: urlPath(promo.attr('href')),
                  timeout: 60000,
                  dataType: 'json',
                  data: { ajax: 't' },
                  error (response, error, exception) {
                    if (debug) console.log({ response, error, exception })
                    status.error('Error:An error has occurred performing the action requested. Please try again shortly.')
                    resolve()
                  },
                  success (response) {
                    if (debug) console.log(response)
                    if (response.success) {
                      status.success('Success:' + response.text)
                      promo.toggleClass('buttonentered').closest('p').html(promo.closest('p').find('span').html())
                      resolve()
                    } else {
                      status.error('Error:' + response.text)
                      resolve()
                    }
                  }
                })
              }))
            } else {
              status.error('Error:' + getI18n('unknowntype'))
            }
          }
        }
        Promise.all(pro).finally(() => {
          fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('allTasksComplete')}</font></li>` })
        })
      } else {
        fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('getIdFailed')}</font></li>` })
      }
    } catch (e) {
      throwError(e, 'indiedb.do_task')
    }
  },
  checkLogin () {
    try {
      if ($('a.buttonenter:contains(Register to join)').length > 0) window.open('/members/login', '_self')
    } catch (e) {
      throwError(e, 'indiedb.checkLogin')
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
  conf: config?.indiedb?.enable ? config.indiedb : globalConf
}

export { indiedb }
