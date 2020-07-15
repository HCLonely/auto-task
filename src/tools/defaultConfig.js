/* eslint-disable no-unused-vars */
/* global getI18n */
if (GM_getValue('conf') && window.location.host.includes('hclonely.com/setting')) {
  if (typeof GM_getValue('conf').global?.fuck?.joinSteamGroup !== 'boolean') {
    Swal.fire({
      icon: 'warning',
      text: getI18n('firstUpdate'),
      confirmButtonText: getI18n('goSetting'),
      cancelButtonText: getI18n('cancel'),
      showCancelButton: true
    })
  }
}
const steamInfo = Object.assign({
  userName: '',
  steam64Id: '',
  communitySessionID: '',
  storeSessionID: '',
  updateTime: 0
}, GM_getValue('steamInfo'))
const defaultConf = {
  global: {
    fuck: {
      joinSteamGroup: true,
      followCurator: true,
      followDeveloper: true,
      followPublisher: true,
      likeAnnouncement: true,
      addToWishlist: true,
      followGame: true,
      visitLink: true,
      verifyTask: true,
      doTask: true,
      autoLogin: false
    },
    verify: {
      verifyTask: true
    },
    remove: {
      leaveSteamGroup: true,
      unfollowCurator: true,
      unfollowDeveloper: true,
      unfollowPublisher: true,
      removeFromWishlist: true,
      unfollowGame: true
    },
    other: {
      showLogs: true,
      showDetails: true,
      checkLogin: true,
      checkLeft: true,
      autoOpen: true,
      reCaptcha: false
    },
    hotKey: {
      fuckKey: 'Alt + A',
      verifyKey: 'Alt + V',
      removeKey: 'Alt + R',
      toggleLogKey: 'Alt + L'
    }
  },
  giveawaysu: {
    fuck: {
      joinSteamGroup: true,
      followCurator: true,
      followDeveloper: true,
      followPublisher: true,
      likeAnnouncement: true,
      addToWishlist: true,
      followGame: true,
      visitLink: true
    },
    remove: {
      leaveSteamGroup: true,
      unfollowCurator: true,
      unfollowDeveloper: true,
      unfollowPublisher: true,
      removeFromWishlist: true,
      unfollowGame: true
    },
    enable: false
  },
  marvelousga: {
    fuck: {
      joinSteamGroup: true,
      followCurator: true,
      followDeveloper: true,
      followPublisher: true,
      likeAnnouncement: true,
      addToWishlist: true,
      followGame: true,
      visitLink: true,
      verifyTask: true
    },
    remove: {
      leaveSteamGroup: true,
      unfollowCurator: true,
      unfollowDeveloper: true,
      unfollowPublisher: true,
      removeFromWishlist: true,
      unfollowGame: true
    },
    enable: false
  },
  banana: {
    fuck: {
      joinSteamGroup: true,
      followCurator: true,
      followDeveloper: true,
      followPublisher: true,
      likeAnnouncement: true,
      addToWishlist: true,
      followGame: true,
      visitLink: true,
      verifyTask: true
    },
    remove: {
      leaveSteamGroup: true,
      unfollowCurator: true,
      unfollowDeveloper: true,
      unfollowPublisher: true,
      removeFromWishlist: true,
      unfollowGame: true
    },
    enable: false
  },
  /* disable
    gamecode: {
      fuck: {
        joinSteamGroup: true,
        followCurator: true,
        followDeveloper: true,
        followPublisher: true,
        likeAnnouncement: true,
        addToWishlist: true,
        followGame: true,
        visitLink: true,
        verifyTask: true
      },
      remove: {
        leaveSteamGroup: true,
        unfollowCurator: true,
        unfollowDeveloper: true,
        unfollowPublisher: true,
        removeFromWishlist: true,
        unfollowGame: true
      },
      enable: false
    },
    */
  gamehag: {
    fuck: {
      joinSteamGroup: true,
      visitLink: true,
      verifyTask: true
    },
    remove: {
      leaveSteamGroup: true
    },
    enable: false
  },
  prys: {
    fuck: {
      joinSteamGroup: true,
      followCurator: true,
      verifyTask: true
    },
    remove: {
      leaveSteamGroup: true,
      unfollowCurator: true
    },
    enable: false
  },
  /* disable
  givekey: {
    fuck: {
      joinSteamGroup: true,
      followCurator: true,
      addToWishlist: true,
      followGame: true,
      visitLink: true
    },
    remove: {
      leaveSteamGroup: true,
      unfollowCurator: true,
      removeFromWishlist: true,
      unfollowGame: true
    },
    enable: false
  },
  */
  takekey: {
    fuck: {
      joinSteamGroup: true,
      visitLink: true
    },
    remove: {
      leaveSteamGroup: true
    },
    enable: false
  },
  gleam: {
    fuck: {
      joinSteamGroup: true,
      visitLink: true,
      verifyTask: true
    },
    remove: {
      leaveSteamGroup: true
    },
    enable: false
  },
  opiumpulses: {
    other: {
      limitPoint: ''
    },
    enable: false
  },
  freegamelottery: {
    fuck: {
      autoLogin: true,
      doTask: true
    },
    userInfo: {
      username: '',
      password: ''
    },
    enable: false
  },
  announcement: ''
}
const config = Object.assign(JSON.parse(JSON.stringify(defaultConf)), GM_getValue('conf') || {})
for (const [k, v] of Object.entries(config)) {
  const defaultConfig = JSON.parse(JSON.stringify(defaultConf))
  if (defaultConfig[k]) config[k] = Object.assign(defaultConfig[k], config[k])
}
const globalConf = config.global
const debug = !!globalConf.other.showDetails
