/* eslint-disable no-unused-vars */
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
  takekey: {
    fuck: {
      joinSteamGroup: true,
      visitLink: true
    },
    remove: {
      removeFromWishlist: true
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
      removeFromWishlist: true
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
const config = Object.assign(defaultConf, GM_getValue('conf') || {})
const globalConf = config.global
const debug = !!globalConf.other.showDetails
