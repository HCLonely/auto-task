/* global getI18n, fuc, globalConf, config, debug */
const opiumpulses = { // eslint-disable-line no-unused-vars
  test () { return window.location.host.includes('opiumpulses') },
  fuck () { this.get_tasks('FREE') },
  async get_tasks (type = 'FREE') {
    const [
      items,
      myPoint,
      maxPoint
    ] = [
      $(`.giveaways-page-item:contains('${type}'):not(:contains('ENTERED'))`),
      this.myPoints,
      this.maxPoint()
    ]
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
          const giveawayId = a.attr('onclick').match(/[\d]+/)
          if (giveawayId) checkUser(giveawayId[0])
        }
        await new Promise(resolve => {
          fuc.httpRequest({
            url: a.attr('href'),
            method: 'GET',
            onload (response) {
              if (debug) console.log(response)
              if (response.responseText && /You've entered this giveaway/gim.test(response.responseText)) {
                status.success()
                const points = response.responseText.match(/Points:[\s]*?([\d]+)/)
                if (type === 'points' && points) {
                  if (debug) console.log(getI18n('pointsLeft') + points[1])
                  opiumpulses.myPoints = parseInt(points[1])
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
  },
  verify () {
    const myPoints = $('.page-header__nav-func-user-nav-items.points-items').text().match(/[\d]+/gim)
    if (myPoints) {
      this.myPoints = myPoints
      this.get_tasks('points')
    } else {
      fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('getPointsFailed')}</font></li>` })
    }
  },
  myPoints: 0,
  setting: {
    fuck: true,
    fuckText: 'Free',
    fuckTitle: getI18n('joinFreeLottery'),
    verify: true,
    verifyText: 'Point',
    verifyTitle: getI18n('joinPointLottery'),
    remove: false
  },
  conf: config?.opiumpulses?.load ? config.opiumpulses : globalConf,
  maxPoint () { return this.conf?.other?.limitPoint || Infinity }
}
