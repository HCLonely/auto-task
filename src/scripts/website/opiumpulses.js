/* global checkUser */
import { getI18n } from '../i18n'
import { fuc, throwError } from '../function/main'
import { config, globalConf, debug } from '../config'

const opiumpulses = {
  test () {
    try {
      return window.location.host.includes('opiumpulses')
    } catch (e) {
      throwError(e, 'opiumpulses.test')
    }
  },
  fuck () {
    try {
      this.get_tasks('FREE')
    } catch (e) {
      throwError(e, 'opiumpulses.fuck')
    }
  },
  async get_tasks (type = 'FREE') {
    try {
      const [
        items,
        maxPoint
      ] = [
        $(`.giveaways-page-item:contains('${type}'):not(:contains('ENTERED'))`),
        this.maxPoint()
      ]
      let myPoint = this.myPoints
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const needPoints = $(item).find('.giveaways-page-item-header-points').text().match(/[\d]+/gim)
        if (type === 'points' && needPoints && parseInt(needPoints[0]) > myPoint) {
          fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('noPoints')}</font></li>` })
        } else if (type === 'points' && !needPoints) {
          fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('getNeedPointsFailed')}</font></li>` })
        } else if (!(type === 'points' && parseInt(needPoints[0]) > maxPoint)) {
          const [
            status,
            a
          ] = [
            fuc.echoLog({ type: 'custom', text: `<li>${getI18n('joinLottery')}<a href="${$(item).find('a.giveaways-page-item-img-btn-more').attr('href')}" target="_blank">${$(item).find('.giveaways-page-item-footer-name').text().trim()}</a>...<font></font></li>` }),
            $(item).find("a.giveaways-page-item-img-btn-enter:contains('enter')")
          ]
          if (a.attr('onclick') && a.attr('onclick').includes('checkUser')) {
            const giveawayId = a.attr('onclick').match(/[\d]+/)?.[0]
            if (giveawayId) checkUser(giveawayId)
          }
          await new Promise(resolve => {
            fuc.httpRequest({
              url: a.attr('href'),
              method: 'GET',
              onload (response) {
                if (debug) console.log(response)
                if (response.responseText && /You've entered this giveaway/gim.test(response.responseText)) {
                  status.success()
                  const points = response.responseText.match(/Points:[\s]*?([\d]+)/)?.[1]
                  if (type === 'points' && points) {
                    if (debug) console.log(getI18n('pointsLeft') + points)
                    myPoint = parseInt(points)
                  }
                } else {
                  status.error('Error:' + (response.status || response.statusText))
                }
                resolve(1)
              },
              status,
              r: resolve
            })
          }).then(data => {
            return true
          }).catch(() => {
            return false
          })
        }
      }
      fuc.echoLog({ type: 'custom', text: '<li>-----END-----</li>' })
    } catch (e) {
      throwError(e, 'opiumpulses.get_tasks')
    }
  },
  verify () {
    try {
      const myPoints = $('.page-header__nav-func-user-nav-items.points-items').text().match(/[\d]+/gim)?.[0]
      if (myPoints) {
        this.myPoints = Number(myPoints)
        this.get_tasks('points')
      } else {
        fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('getPointsFailed')}</font></li>` })
      }
    } catch (e) {
      throwError(e, 'opiumpulses.verify')
    }
  },
  myPoints: 0,
  setting: {
    fuck: {
      show: true,
      text: 'Free',
      title: getI18n('joinFreeLottery')
    },
    verify: {
      show: true,
      text: 'Point',
      title: getI18n('joinPointLottery')
    },
    remove: {
      show: false
    }
  },
  conf: config?.opiumpulses?.enable.valueOf() ? config.opiumpulses : globalConf,
  maxPoint () {
    try {
      return this.conf?.other?.limitPoint ? Number(this.conf.other.limitPoint) : Infinity
    } catch (e) {
      throwError(e, 'opiumpulses.maxPoint')
    }
  }
}

export { opiumpulses }
