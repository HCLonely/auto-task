import { getI18n } from '../i18n'
import { toggleActions } from './social/toggleActions'

function unique (e) {
  try {
    return [...new Set(e)]
  } catch (e) {
    throwError(e, 'unique')
  }
}
function getUrlQuery (url) {
  try {
    const q = {}
    if (url) {
      if (url.includes('?')) url.split('?')[1].replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => { q[k] = v })
    } else {
      window.location.search.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => { q[k] = v })
    }
    return q
  } catch (e) {
    throwError(e, 'getUrlQuery')
  }
}
function dateFormat (fmt, date) {
  try {
    let ret = null
    const opt = {
      'Y+': date.getFullYear().toString(),
      'm+': (date.getMonth() + 1).toString(),
      'd+': date.getDate().toString(),
      'H+': date.getHours().toString(),
      'M+': date.getMinutes().toString(),
      'S+': date.getSeconds().toString()
    }
    for (const k in opt) {
      ret = new RegExp('(' + k + ')').exec(fmt)
      if (ret) {
        fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
      }
    }
    return fmt
  } catch (e) {
    throwError(e, 'dateFormat')
  }
}
function isEmptyObjArr (object) {
  try {
    for (const value of Object.values(object)) {
      if (Object.prototype.toString.call(value) === '[object Array]') {
        if (value.length !== 0) return false
      } else if (Object.prototype.toString.call(value) === '[object Object]') {
        if (Object.keys(value).length !== 0) return false
      } else if (Object.prototype.toString.call(value) === '[object String]') {
        if (value !== '') return false
      }
    }
    return true
  } catch (e) {
    throwError(e, 'isEmptyObjArr')
  }
}

function clearArray (arr) {
  try {
    if (Array.isArray(arr[0])) {
      return arr.map(() => {
        return []
      })
    } else {
      return []
    }
  } catch (e) {
    throwError(e, 'clearArray')
  }
}
function clearTaskInfo (data) {
  try {
    if (Array.isArray(data)) {
      return clearArray(data)
    } else {
      for (const [k, v] of Object.entries(data)) {
        if (Array.isArray(v)) data[k] = clearArray(v)
      }
      return data
    }
  } catch (e) {
    throwError(e, 'clearTaskInfo')
  }
}
function uniqueTaskInfo (data) {
  try {
    if (Array.isArray(data)) {
      if (Array.isArray(data[0])) {
        for (let i = 0; i < data.length; i++) {
          data[i] = unique(data[i])
        }
      } else {
        data = unique(data)
      }
    } else {
      for (const [k, v] of Object.entries(data)) {
        if (Array.isArray(v)) data[k] = unique(v)
      }
    }
    return data
  } catch (e) {
    throwError(e, 'uniqueTaskInfo')
  }
}
function throwError (e, name) {
  Swal.fire({
    icon: 'error',
    text: getI18n('functionError', name)
  })
  console.log('%c%s', 'color:white;background:red', name + '\n' + e.stack)
}

function delay (time = 1000) {
  return new Promise(resolve => {
    setTimeout(() => { resolve() }, time)
  })
}

function addDelayNotice (taskInfo, echoLog, day) {
  try {
    const time = new Date().getTime()
    const noticeList = GM_getValue('noticeList') || []
    noticeList.push(time)
    GM_setValue('noticeList', noticeList)
    GM_setValue('delayNotice-' + time, {
      time,
      link: window.location.href,
      taskInfo
    })
    echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('addedNotice', day)}</font></li>` })
  } catch (e) {
    throwError(e, 'addDelayNotice')
  }
}
function deleteDelayNotice (time, echoLog) {
  try {
    const noticeList = GM_getValue('noticeList') || []
    noticeList.splice(noticeList.indexOf(time), 1)
    GM_setValue('noticeList', noticeList)
    GM_deleteValue('delayNotice-' + time)
    $('#' + time).remove()
    echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('deletedNotice')}</font></li>` })
  } catch (e) {
    throwError(e, 'deleteDelayNotice')
  }
}
function notice (options, callback) {
  try {
    const defaultOptions = {
      title: 'auto-task',
      text: 'auto-task notice',
      image: 'https://__SITEURL__/img/notice-icon.jpg',
      timeout: 10000
    }
    GM_notification(Object.assign(defaultOptions, options), callback)
  } catch (e) {
    throwError(e, 'notice')
  }
}
function assignment ({ groups, forums, curators, publishers, developers, franchises, fGames, wGames, announcements, discords, instagrams, twitchs, reddits, vks, twitterUsers, retweets, youtubeChannels, youtubeVideos, toFinalUrl }, config, action, website) {
  const pro = []
  const fuck = action === 'fuck'
  if (groups && groups.length > 0 && config[fuck ? 'joinSteamGroup' : 'leaveSteamGroup']) {
    pro.push(toggleActions({ website, type: 'group', elements: groups, action, toFinalUrl }))
  }
  if (forums && forums.length > 0 && config[fuck ? 'subscribeSteamForum' : 'unsubscribeSteamForum']) {
    pro.push(toggleActions({ website, type: 'forum', elements: forums, action, toFinalUrl }))
  }
  if (curators && curators.length > 0 && config[fuck ? 'followCurator' : 'unfollowCurator']) {
    pro.push(toggleActions({ website, type: 'curator', elements: curators, action, toFinalUrl }))
  }
  if (publishers && publishers.length > 0 && config[fuck ? 'followPublisher' : 'unfollowPublisher']) {
    pro.push(toggleActions({ website, type: 'publisher', elements: publishers, action, toFinalUrl }))
  }
  if (developers && developers.length > 0 && config[fuck ? 'followDeveloper' : 'unfollowDeveloper']) {
    pro.push(toggleActions({ website, type: 'developer', elements: developers, action, toFinalUrl }))
  }
  if (franchises && franchises.length > 0 && config[fuck ? 'followFranchise' : 'unfollowFranchise']) {
    pro.push(toggleActions({ website, type: 'franchise', elements: franchises, action, toFinalUrl }))
  }
  if (fGames && fGames.length > 0 && config[fuck ? 'followGame' : 'unfollowGame']) {
    pro.push(toggleActions({ website, type: 'game', elements: fGames, action, toFinalUrl }))
  }
  if (wGames && wGames.length > 0 && config[fuck ? 'addToWishlist' : 'removeFromWishlist']) {
    pro.push(toggleActions({ website, type: 'wishlist', elements: wGames, action, toFinalUrl }))
  }
  if (fuck && announcements && announcements.length > 0 && config.fuck.likeAnnouncement) {
    pro.push(toggleActions({ website, type: 'announcement', elements: announcements, action, toFinalUrl }))
  }
  if (instagrams && instagrams.length > 0 && config[fuck ? 'followIns' : 'unfollowIns']) {
    pro.push(toggleActions({ website, social: 'ins', elements: instagrams, action, toFinalUrl }))
  }
  if (twitchs && twitchs.length > 0 && config[fuck ? 'followTwitchChannel' : 'unfollowTwitchChannel']) {
    pro.push(toggleActions({ website, social: 'twitch', elements: twitchs, action, toFinalUrl }))
  }
  if (reddits && reddits.length > 0 && config[fuck ? 'joinReddit' : 'leaveReddit']) {
    pro.push(toggleActions({ website, social: 'reddit', elements: reddits, action, toFinalUrl }))
  }
  if (youtubeChannels && youtubeChannels.length > 0 && config[fuck ? 'followYoutubeChannel' : 'unfollowYoutubeChannel']) {
    pro.push(toggleActions({ website, social: 'youtube', type: 'channel', elements: youtubeChannels, action, toFinalUrl }))
  }
  if (youtubeVideos && youtubeVideos.length > 0 && config[fuck ? 'likeYoutubeVideo' : 'unlikeYoutubeVideo']) {
    pro.push(toggleActions({ website, social: 'youtube', type: 'video', elements: youtubeVideos, action, toFinalUrl }))
  }
  if (vks && vks.length > 0 && config[fuck ? 'joinVk' : 'leaveVk']) {
    pro.push(toggleActions({ website, social: 'vk', elements: vks, action, toFinalUrl }))
  }
  if (twitterUsers && twitterUsers.length > 0 && config[fuck ? 'followTwitterUser' : 'unfollowTwitterUser']) {
    pro.push(toggleActions({ website, social: 'twitter', type: 'follow', elements: twitterUsers, action, toFinalUrl }))
  }
  if (retweets && retweets.length > 0 && config[fuck ? 'retweet' : 'unretweet']) {
    pro.push(toggleActions({ website, social: 'twitter', type: 'retweet', elements: retweets, action, toFinalUrl }))
  }
  if (discords && discords.length > 0 && config[fuck ? 'joinDiscordServer' : 'leaveDiscordServer']) {
    pro.push(toggleActions({ website, social: 'discord', elements: discords, action, toFinalUrl }))
  }
  return Promise.all(pro)
}

export {
  unique,
  getUrlQuery,
  dateFormat,
  isEmptyObjArr,
  clearTaskInfo,
  uniqueTaskInfo,
  throwError,
  delay,
  addDelayNotice,
  deleteDelayNotice,
  assignment,
  notice
}
