/* global getI18n, fuc, debug, vueUi */
const loadSetting = function () { // eslint-disable-line no-unused-vars
  const eNameToNameJoin = {
    group: getI18n('group'),
    curator: getI18n('curator'),
    developer: getI18n('developer'),
    publisher: getI18n('publisher'),
    announcement: getI18n('announcement'),
    wishlist: getI18n('wishlist'),
    followGame: getI18n('fGame'),
    visit: getI18n('visit'),
    verify: getI18n('verify'),
    autoLogin: getI18n('autoLogin'),
    doTask: getI18n('doTask')
  }
  const eNameToNameRemove = {
    group: getI18n('ungroup'),
    curator: getI18n('uncurator'),
    developer: getI18n('undeveloper'),
    publisher: getI18n('unpublisher'),
    wishlist: getI18n('unwishlist'),
    unfollowGame: getI18n('unfGame')
  }
  const eNameToNameOther = {
    showLogs: getI18n('showLogs'),
    showDetails: getI18n('showDetails'),
    checkLogin: getI18n('checkLogin'),
    checkLeft: getI18n('checkLeft'),
    autoOpen: getI18n('autoOpen'),
    autoCheckUpdate: getI18n('checkUpdate'),
    reCaptcha: getI18n('reCaptcha')
  }
  const Options = {
    fuckOptions: [
      { name: getI18n('group'), eName: 'group', des: 'Join XXX steam group' },
      { name: getI18n('curator'), eName: 'curator', des: 'Follow XXX curator' },
      { name: getI18n('developer'), eName: 'developer', des: 'Follow XXX developer' },
      { name: getI18n('publisher'), eName: 'publisher', des: 'Follow XXX publisher' },
      { name: getI18n('announcement'), eName: 'announcement', des: 'Like Steam announcement' },
      { name: getI18n('wishlist'), eName: 'wishlist', des: 'Add XXX to your wishlist' },
      { name: getI18n('fGame'), eName: 'followGame', des: 'Click "Follow" button' },
      { name: getI18n('visit'), eName: 'visit', des: 'Visit XXX page' },
      { name: getI18n('verify'), eName: 'verify', des: getI18n('verify') },
      { name: getI18n('autoLogin'), eName: 'autoLogin', des: getI18n('autoLoginDes') },
      { name: getI18n('doTask'), eName: 'doTask', des: getI18n('doTaskDes') }
    ],
    joinOptions: [
      { name: getI18n('group'), eName: 'group', des: 'Join XXX steam group' },
      { name: getI18n('curator'), eName: 'curator', des: 'Follow XXX curator' },
      { name: getI18n('developer'), eName: 'developer', des: 'Follow XXX developer' },
      { name: getI18n('publisher'), eName: 'publisher', des: 'Follow XXX publisher' },
      { name: getI18n('announcement'), eName: 'announcement', des: 'Like Steam announcement' },
      { name: getI18n('wishlist'), eName: 'wishlist', des: 'Add XXX to your wishlist' },
      { name: getI18n('fGame'), eName: 'followGame', des: 'Click "Follow" button' },
      { name: getI18n('visit'), eName: 'visit', des: 'Visit XXX page' }
    ],
    removeOptions: [
      { name: getI18n('ungroup'), eName: 'group', des: getI18n('ungroupDes') },
      { name: getI18n('uncurator'), eName: 'curator', des: getI18n('uncuratorDes') },
      { name: getI18n('undeveloper'), eName: 'developer', des: getI18n('undeveloperDes') },
      { name: getI18n('unpublisher'), eName: 'publisher', des: getI18n('unpublisherDes') },
      { name: getI18n('unwishlist'), eName: 'wishlist', des: getI18n('unwishlistDes') },
      { name: getI18n('unfGame'), eName: 'unfollowGame', des: getI18n('unfGameDes') }
    ],
    otherOptions: [
      { name: getI18n('checkLogin'), eName: 'checkLogin', des: getI18n('checkLoginDes') },
      { name: getI18n('checkLeft'), eName: 'checkLeft', des: getI18n('checkLeftDes') },
      { name: getI18n('autoOpen'), eName: 'autoOpen', des: getI18n('autoOpenDes') },
      { name: getI18n('showLogs'), eName: 'showLogs', des: getI18n('showLogsDes') },
      { name: getI18n('showDetails'), eName: 'showDetails', des: getI18n('showDetailsDes') },
      { name: getI18n('autoCheckUpdate'), eName: 'checkUpdate', des: getI18n('autoCheckUpdate') },
      { name: getI18n('reCaptcha'), eName: 'reCaptcha', des: getI18n('reCaptchaDes') }
    ],
    checkedFucks: [getI18n('group'), getI18n('curator'), getI18n('developer'), getI18n('publisher'), getI18n('announcement'), getI18n('wishlist'), getI18n('fGame'), getI18n('visit'), getI18n('verify'), getI18n('autoLogin'), getI18n('doTask')],
    checkedJoins: [getI18n('group'), getI18n('curator'), getI18n('developer'), getI18n('publisher'), getI18n('announcement'), getI18n('wishlist'), getI18n('fGame'), getI18n('visit')],
    checkedRemoves: [getI18n('ungroup'), getI18n('uncurator'), getI18n('undeveloper'), getI18n('unpublisher'), getI18n('unwishlist'), getI18n('unfGame')],
    checkedOthers: [getI18n('checkLogin'), getI18n('checkLeft'), getI18n('autoOpen'), getI18n('showLogs'), getI18n('showDetails'), getI18n('autoCheckUpdate'), getI18n('reCaptcha')]
  }
  function getOptions (type, options) {
    const opt = []
    const defaultOpt = Options[type]
    options.map(function (e, i) {
      opt.push(defaultOpt[e])
    })
    return opt
  }

  (function () {
    const fuckOptions = getOptions('fuckOptions', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    const checkedFucks = (GM_getValue('conf') && GM_getValue('conf').global) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').global.fuck)) {
        conf.push(eNameToNameJoin[eName])
      }
      return conf
    })() : getOptions('checkedFucks', [0, 1, 2, 3, 4, 5, 6, 7, 8, 10])

    const joinOptions = getOptions('joinOptions', [0, 1, 2, 3, 4, 5, 6, 7])
    const checkedJoins = (GM_getValue('conf') && GM_getValue('conf').global) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').global.join)) {
        conf.push(eNameToNameJoin[eName])
      }
      return conf
    })() : getOptions('checkedJoins', [0, 1, 2, 3, 4, 5, 6, 7])

    const removeOptions = getOptions('removeOptions', [0, 1, 2, 3, 4, 5])
    const checkedRemoves = (GM_getValue('conf') && GM_getValue('conf').global) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').global.remove)) {
        conf.push(eNameToNameRemove[eName])
      }
      return conf
    })() : getOptions('checkedRemoves', [0, 1, 2, 3, 4, 5])

    const otherOptions = getOptions('otherOptions', [0, 1, 2, 3, 4, 5, 6])
    const checkedOthers = (GM_getValue('conf') && GM_getValue('conf').global) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').global.other)) {
        conf.push(eNameToNameOther[eName])
      }
      return conf
    })() : getOptions('checkedOthers', [0, 1, 3])

    new Vue({ // eslint-disable-line no-new
      el: '#global',
      data: {
        header: getI18n('globalSettings'),
        fuck: {
          checkAll: fuckOptions.length === checkedFucks.length,
          checkedFucks: checkedFucks,
          fucks: fuckOptions,
          isIndeterminate: fuckOptions.length !== checkedFucks.length
        },
        join: {
          checkAll: joinOptions.length === checkedJoins.length,
          checkedJoins: checkedJoins,
          joins: joinOptions,
          isIndeterminate: joinOptions.length !== checkedJoins.length
        },
        remove: {
          checkAll: removeOptions.length === checkedRemoves.length,
          checkedRemoves: checkedRemoves,
          removes: removeOptions,
          isIndeterminate: removeOptions.length !== checkedRemoves.length
        },
        other: {
          checkAll: otherOptions.length === checkedOthers.length,
          checkedOthers: checkedOthers,
          others: otherOptions,
          isIndeterminate: otherOptions.length !== checkedOthers.length
        },
        openDelay: 100,
        rowType: 'flex',
        rowAlign: 'middle',
        verify: '1'
      },
      methods: {
        fuckHandleCheckAllChange (val) {
          this.fuck.checkedFucks = val ? fuckOptions.map(e => e.name) : []
          this.fuck.isIndeterminate = false
        },
        handleCheckedFucksChange (value) {
          const checkedCount = value.length
          this.fuck.checkAll = checkedCount === this.fuck.fucks.length
          this.fuck.isIndeterminate = checkedCount > 0 && checkedCount < this.fuck.fucks.length
        },
        joinHandleCheckAllChange (val) {
          this.join.checkedJoins = val ? joinOptions.map(e => e.name) : []
          this.join.isIndeterminate = false
        },
        handleCheckedJoinsChange (value) {
          const checkedCount = value.length
          this.join.checkAll = checkedCount === this.join.joins.length
          this.join.isIndeterminate = checkedCount > 0 && checkedCount < this.join.joins.length
        },
        removeHandleCheckAllChange (val) {
          this.remove.checkedRemoves = val ? removeOptions.map(e => e.name) : []
          this.remove.isIndeterminate = false
        },
        handleCheckedRemovesChange (value) {
          const checkedCount = value.length
          this.remove.checkAll = checkedCount === this.remove.removes.length
          this.remove.isIndeterminate = checkedCount > 0 && checkedCount < this.remove.removes.length
        },
        otherHandleCheckAllChange (val) {
          this.other.checkedOthers = val ? otherOptions.map(e => e.name) : []
          this.other.isIndeterminate = false
        },
        handleCheckedOthersChange (value) {
          const checkedCount = value.length
          this.other.checkAll = checkedCount === this.other.others.length
          this.other.isIndeterminate = checkedCount > 0 && checkedCount < this.other.others.length
        }
      }
    })
  })();
  (function () {
    const joinOptions = getOptions('joinOptions', [0, 1, 2, 3, 4, 5, 6])
    const checkedJoins = (GM_getValue('conf') && GM_getValue('conf').giveawaysu) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').giveawaysu.join)) {
        conf.push(eNameToNameJoin[eName])
      }
      return conf
    })() : getOptions('checkedJoins', [0, 1, 2, 3, 4, 5, 6])

    const removeOptions = getOptions('removeOptions', [0, 1, 2, 3, 4, 5])
    const checkedRemoves = (GM_getValue('conf') && GM_getValue('conf').giveawaysu) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').giveawaysu.remove)) {
        conf.push(eNameToNameRemove[eName])
      }
      return conf
    })() : getOptions('checkedRemoves', [0, 1, 2, 3, 4, 5])

    new Vue({ // eslint-disable-line no-new
      el: '#giveawaysu',
      data: {
        header: 'giveaway.su' + getI18n('websiteSetting'),
        checked: GM_getValue('conf') ? GM_getValue('conf').giveawaysu ? !!GM_getValue('conf').giveawaysu.load : false : false,
        remove: {
          checkAll: removeOptions.length === checkedRemoves.length,
          checkedRemoves: checkedRemoves,
          removes: removeOptions,
          isIndeterminate: removeOptions.length !== checkedRemoves.length
        },
        join: {
          checkAll: joinOptions.length === checkedJoins.length,
          checkedJoins: checkedJoins,
          joins: joinOptions,
          isIndeterminate: joinOptions.length !== checkedJoins.length
        },
        openDelay: 100,
        rowType: 'flex',
        rowAlign: 'middle',
        verify: '1'
      },
      methods: {
        removeHandleCheckAllChange (val) {
          this.remove.checkedRemoves = val ? removeOptions.map(e => e.name) : []
          this.remove.isIndeterminate = false
        },
        handleCheckedRemovesChange (value) {
          const checkedCount = value.length
          this.remove.checkAll = checkedCount === this.remove.removes.length
          this.remove.isIndeterminate = checkedCount > 0 && checkedCount < this.remove.removes.length
        },
        joinHandleCheckAllChange (val) {
          this.join.checkedJoins = val ? joinOptions.map(e => e.name) : []
          this.join.isIndeterminate = false
        },
        handleCheckedJoinsChange (value) {
          const checkedCount = value.length
          this.join.checkAll = checkedCount === this.join.joins.length
          this.join.isIndeterminate = checkedCount > 0 && checkedCount < this.join.joins.length
        }
      }
    })
  })();
  (function () {
    const fuckOptions = getOptions('fuckOptions', [0, 1, 2, 3, 5, 6, 7, 8])
    const checkedFucks = (GM_getValue('conf') && GM_getValue('conf').marvelousga) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').marvelousga.fuck)) {
        conf.push(eNameToNameJoin[eName])
      }
      return conf
    })() : getOptions('checkedFucks', [0, 1, 2, 3, 5, 6, 7, 8])

    const removeOptions = getOptions('removeOptions', [0, 1, 2, 3, 4, 5])
    const checkedRemoves = (GM_getValue('conf') && GM_getValue('conf').marvelousga) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').marvelousga.remove)) {
        conf.push(eNameToNameRemove[eName])
      }
      return conf
    })() : getOptions('checkedRemoves', [0, 1, 2, 3, 4, 5])

    fuc.creatSetting('marvelousga', 'marvelousGA & dupedornot', fuckOptions, checkedFucks, removeOptions, checkedRemoves)
  })();
  (function () {
    const fuckOptions = getOptions('fuckOptions', [0, 1, 2, 3, 5, 6, 7, 8])
    const checkedFucks = (GM_getValue('conf') && GM_getValue('conf').banana) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').banana.fuck)) {
        conf.push(eNameToNameJoin[eName])
      }
      return conf
    })() : getOptions('checkedFucks', [0, 1, 2, 3, 5, 6, 7, 8])

    const removeOptions = getOptions('removeOptions', [0, 1, 2, 3, 4, 5])
    const checkedRemoves = (GM_getValue('conf') && GM_getValue('conf').banana) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').banana.remove)) {
        conf.push(eNameToNameRemove[eName])
      }
      return conf
    })() : getOptions('checkedRemoves', [0, 1, 2, 3, 4, 5])

    fuc.creatSetting('banana', 'grabfreegame & bananagiveaway', fuckOptions, checkedFucks, removeOptions, checkedRemoves)
  })();
  (function () {
    const fuckOptions = getOptions('fuckOptions', [0, 7, 8])
    const checkedFucks = (GM_getValue('conf') && GM_getValue('conf').gamecode) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').gamecode.fuck)) {
        conf.push(eNameToNameJoin[eName])
      }
      return conf
    })() : getOptions('checkedFucks', [0, 7, 8])

    const removeOptions = getOptions('removeOptions', [0])
    const checkedRemoves = (GM_getValue('conf') && GM_getValue('conf').gamecode) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').gamecode.remove)) {
        conf.push(eNameToNameRemove[eName])
      }
      return conf
    })() : getOptions('checkedRemoves', [0])

    fuc.creatSetting('gamecode', 'gamecode.win', fuckOptions, checkedFucks, removeOptions, checkedRemoves)
  })();
  (function () {
    const fuckOptions = getOptions('fuckOptions', [0, 7, 8])
    const checkedFucks = (GM_getValue('conf') && GM_getValue('conf').gamehag) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').gamehag.fuck)) {
        conf.push(eNameToNameJoin[eName])
      }
      return conf
    })() : getOptions('checkedFucks', [0, 7, 8])

    const removeOptions = getOptions('removeOptions', [0])
    const checkedRemoves = (GM_getValue('conf') && GM_getValue('conf').gamehag) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').gamehag.remove)) {
        conf.push(eNameToNameRemove[eName])
      }
      return conf
    })() : getOptions('checkedRemoves', [0])

    fuc.creatSetting('gamehag', 'gamehag', fuckOptions, checkedFucks, removeOptions, checkedRemoves)
  })();
  (function () {
    const fuckOptions = getOptions('fuckOptions', [0, 1, 8])
    const checkedFucks = (GM_getValue('conf') && GM_getValue('conf').prys) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').prys.fuck)) {
        conf.push(eNameToNameJoin[eName])
      }
      return conf
    })() : getOptions('checkedFucks', [0, 1, 8])

    const removeOptions = getOptions('removeOptions', [0, 1])
    const checkedRemoves = (GM_getValue('conf') && GM_getValue('conf').prys) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').prys.remove)) {
        conf.push(eNameToNameRemove[eName])
      }
      return conf
    })() : getOptions('checkedRemoves', [0, 1])

    fuc.creatSetting('prys', 'prys', fuckOptions, checkedFucks, removeOptions, checkedRemoves)
  })();
  (function () {
    const fuckOptions = getOptions('fuckOptions', [0, 1, 5, 6, 7])
    const checkedFucks = (GM_getValue('conf') && GM_getValue('conf').givekey) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').givekey.fuck)) {
        conf.push(eNameToNameJoin[eName])
      }
      return conf
    })() : getOptions('checkedFucks', [0, 1, 5, 6, 7])

    const removeOptions = getOptions('removeOptions', [0, 1, 4, 5])
    const checkedRemoves = (GM_getValue('conf') && GM_getValue('conf').givekey) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').givekey.remove)) {
        conf.push(eNameToNameRemove[eName])
      }
      return conf
    })() : getOptions('checkedRemoves', [0, 1, 4, 5])

    fuc.creatSetting('givekey', 'givekey.ru', fuckOptions, checkedFucks, removeOptions, checkedRemoves)
  })();
  (function () {
    const fuckOptions = getOptions('fuckOptions', [0, 7])
    const checkedFucks = (GM_getValue('conf') && GM_getValue('conf').givekey) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').givekey.fuck)) {
        conf.push(eNameToNameJoin[eName])
      }
      return conf
    })() : getOptions('checkedFucks', [0, 7])

    const removeOptions = getOptions('removeOptions', [0])
    const checkedRemoves = (GM_getValue('conf') && GM_getValue('conf').givekey) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').givekey.remove)) {
        conf.push(eNameToNameRemove[eName])
      }
      return conf
    })() : getOptions('checkedRemoves', [0])

    fuc.creatSetting('takekey', 'takekey.ru', fuckOptions, checkedFucks, removeOptions, checkedRemoves)
  })();
  (function () {
    const fuckOptions = getOptions('fuckOptions', [0, 7, 8])
    const checkedFucks = (GM_getValue('conf') && GM_getValue('conf').gleam) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').gleam.fuck)) {
        conf.push(eNameToNameJoin[eName])
      }
      return conf
    })() : getOptions('checkedFucks', [0, 7, 8])

    const removeOptions = getOptions('removeOptions', [0])
    const checkedRemoves = (GM_getValue('conf') && GM_getValue('conf').gleam) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').gleam.remove)) {
        conf.push(eNameToNameRemove[eName])
      }
      return conf
    })() : getOptions('checkedRemoves', [0])

    fuc.creatSetting('gleam', 'gleam.io', fuckOptions, checkedFucks, removeOptions, checkedRemoves)
  })();
  (function () {
    const fuckOptions = getOptions('fuckOptions', [9, 10])
    const checkedFucks = (GM_getValue('conf') && GM_getValue('conf').freegamelottery) ? (() => {
      const conf = []
      for (const eName of Object.keys(GM_getValue('conf').freegamelottery.fuck)) {
        conf.push(eNameToNameJoin[eName])
      }
      return conf
    })() : getOptions('checkedFucks', [10])

    new Vue({ // eslint-disable-line no-new
      el: '#freegamelottery',
      data: {
        header: 'freegamelottery' + getI18n('websiteSetting'),
        checked: GM_getValue('conf') ? GM_getValue('conf').freegamelottery ? !!GM_getValue('conf').freegamelottery.load : false : false,
        fuck: {
          checkAll: fuckOptions.length === checkedFucks.length,
          checkedFucks: checkedFucks,
          fucks: fuckOptions,
          isIndeterminate: fuckOptions.length !== checkedFucks.length
        },
        openDelay: 100,
        rowType: 'flex',
        rowAlign: 'middle',
        verify: '1'
      },
      methods: {
        fuckHandleCheckAllChange (val) {
          this.fuck.checkedFucks = val ? fuckOptions.map(e => e.name) : []
          this.fuck.isIndeterminate = false
        },
        handleCheckedFucksChange (value) {
          const checkedCount = value.length
          this.fuck.checkAll = checkedCount === this.fuck.fucks.length
          this.fuck.isIndeterminate = checkedCount > 0 && checkedCount < this.fuck.fucks.length
        }
      }
    })
  })();

  (function () {
    new Vue({ // eslint-disable-line no-new
      el: '#save',
      data: {
        title: getI18n('saveSetting')
      },
      methods: {
        save () {
          const conf = fuc.creatConf()
          GM_setValue('conf', conf)
          this.$notify({
            title: getI18n('saveSuccess'),
            type: 'success'
          })
        }
      }
    })
    new Vue({ // eslint-disable-line no-new
      el: '#reset',
      data: {
        title: getI18n('resetSetting')
      },
      methods: {
        reset () {
          this.$confirm(getI18n('resetSettingNotice'), getI18n('notice'), {
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            type: 'warning'
          }).then(() => {
            GM_deleteValue('conf')
            if (!GM_getValue('conf')) {
              vueUi.$message({
                type: 'success',
                message: getI18n('resetSettingSuccess')
              })
            } else {
              vueUi.$message({
                type: 'error',
                message: getI18n('resetSettingFailed')
              })
            }
          }).catch(() => {
            vueUi.$message({
              type: 'info',
              message: getI18n('resetSettingCancel')
            })
          })
        }
      }
    })
    const download = new Vue({ // eslint-disable-line no-unused-vars
      el: '#download',
      data: {
        title: getI18n('downloadSetting')
      },
      methods: {
        download () {
          const msg = vueUi.$message({
            type: 'info',
            message: getI18n('processSetting')
          })
          const conf = fuc.creatConf()
          const creatFile = new FileReader()
          creatFile.onload = () => {
            $(`<a href="${creatFile.result}" download="auto-task.conf.json" target="_self"></a>`)[0].click()
          }
          creatFile.onerror = (e) => {
            if (debug) console.log(e)
            msg.close()
            vueUi.$message({
              type: 'error',
              message: getI18n('creatUrlFailed')
            })
          }
          creatFile.readAsDataURL(new File([JSON.stringify(conf, null, 4)], 'setting.conf.txt'))
        }
      }
    })
    new Vue({ // eslint-disable-line no-new
      el: '#upload2',
      data: {
        title: getI18n('loadSetting'),
        multiple: false,
        sfl: false,
        accept: 'json',
        httpRequest: () => { }
      },
      methods: {
        upload (file) {
          const msg = vueUi.$message({
            type: 'info',
            message: getI18n('readSetting')
          })
          if (window.FileReader) {
            const reader = new FileReader()
            reader.onload = () => {
              if (debug) console.log(reader.result)
              msg.close()
              const cMsg = vueUi.$message({
                type: 'success',
                message: getI18n('readSettingComplete')
              })
              try {
                GM_setValue('conf', JSON.parse(reader.result))
                cMsg.close()
                vueUi.$message({
                  type: 'success',
                  message: getI18n('loadSettingComplete')
                })
                window.location.reload()
              } catch (e) {
                cMsg.close()
                vueUi.$message({
                  type: 'error',
                  message: `${getI18n('loadSettingFailed')}！`
                })
                if (debug) console.log(`${getI18n('loadSettingFailed')}: `, e)
              }
            }
            reader.onerror = (e) => {
              if (debug) console.log(e)
              msg.close()
              vueUi.$message({
                type: 'error',
                message: getI18n('readSettingFailed')
              })
            }
            reader.readAsText(file)
          } else {
            msg.close()
            vueUi.$message({
              type: 'warning',
              duration: 5000,
              message: getI18n('notSupport')
            })
            this.$msgbox({
              title: getI18n('copySetting'),
              type: 'info',
              showClose: false,
              showCancelButton: true,
              confirmButtonText: getI18n('confirm'),
              cancelButtonText: getI18n('cancel'),
              closeOnClickModal: false,
              closeOnPressEscape: false,
              closeOnHashChange: false,
              center: true,
              showInput: true,
              inputType: 'textarea'
            })
              .then(({ value }) => {
                if (debug) console.log(value)
                const cMsg = vueUi.$message({
                  type: 'info',
                  message: getI18n('loadSettingText')
                })
                try {
                  GM_setValue('conf', JSON.parse(value))
                  cMsg.close()
                  vueUi.$message({
                    type: 'success',
                    message: getI18n('loadSettingComplete')
                  })
                  window.location.reload()
                } catch (e) {
                  cMsg.close()
                  vueUi.$message({
                    type: 'error',
                    message: `${getI18n('loadSettingFailed')}！`
                  })
                  if (debug) console.log(`${getI18n('loadSettingFailed')}: `, e)
                }
              })
              .catch(action => {
                vueUi.$message({
                  type: 'info',
                  message: getI18n('cancelled')
                })
              })
          }
          this.$refs.upload.abort(file.name)
        }
      }
    })
  })();
  (function () {
    const maxPoint = GM_getValue('conf') ? GM_getValue('conf').opiumpulses ? (GM_getValue('conf').opiumpulses['max-point'] || 0) : 0 : 0

    new Vue({ // eslint-disable-line no-new
      el: '#opiumpulses',
      data: {
        header: 'opiumpulses' + getI18n('websiteSetting'),
        checked: GM_getValue('conf') ? GM_getValue('conf').opiumpulses ? !!GM_getValue('conf').opiumpulses.load : false : false,
        maxPoint: maxPoint,
        openDelay: 100,
        rowType: 'flex',
        rowAlign: 'middle',
        verify: '1'
      }
    })
  })()
}
