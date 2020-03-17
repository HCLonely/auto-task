/* global fuc, defaultConf */
const chubkeys = { // eslint-disable-line no-unused-vars
  test: () => { return (window.location.host.includes('chubkeys') || window.location.host.includes('giveawayhopper')) },
  fuck: function () {
    fuc.echoLog({ type: 'custom', text: '<li><font class="warning">因为做新版脚本时此网站没有赠key,所以暂时不支持此网站，如果此网站有赠key,请联系作者！</font></li>' })
  },
  verify: function () {
    fuc.echoLog({ type: 'custom', text: '<li><font class="warning">因为做新版脚本时此网站没有赠key,所以暂时不支持此网站，如果此网站有赠key,请联系作者！</font></li>' })
  },
  remove: function () {
    fuc.echoLog({ type: 'custom', text: '<li><font class="warning">因为做新版脚本时此网站没有赠key,所以暂时不支持此网站，如果此网站有赠key,请联系作者！</font></li>' })
  },
  get_giveawayId: function () {
    const id = window.location.href.match(/giveaway\/([\d]+)/)
    if (id) {
      return id[1]
    } else {
      return window.location.href
    }
  },
  checkLogin: function () {
    if ($('a.nav-link[href*=login]').length > 0) window.open('/login', '_self')
  },
  checkLeft: function (ui) {
    if ($('div.card-body h5:contains(There are no more keys left)').length > 0) {
      ui.$confirm('此页面已经没有剩余key了, 是否关闭?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        window.close()
      })
    }
  },
  setting: {
    fuck: true,
    verify: true,
    join: false,
    remove: true
  },
  conf: GM_getValue('conf') ? ((GM_getValue('conf').chubkeys && GM_getValue('conf').chubkeys.load) ? GM_getValue('conf').chubkeys : (GM_getValue('conf').global || defaultConf)) : defaultConf
}
