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

function assignment ({ groups, forums, curators, publishers, developers, franchises, fGames, wGames, announcements, discords, instagrams, twitchs, reddits, vks, twitterUsers, retweets, youtubeChannels, youtubeVideos, toFinalUrl, toGuild }, config, action, website) {
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
    pro.push(toggleActions({ website, social: 'discord', elements: discords, action, toFinalUrl, toGuild }))
  }
  return Promise.all(pro)
}
/* disable
async function analyzeLink (link, type, isFinalUrl = true) {
  let result
  switch (type) {
    case 'group':
      result = link.match(/https?:\/\/steamcommunity\.com\/groups\/(.+)\/?/)?.[1]
      break
    case 'forum':
      result = link.match(/https?:\/\/store\.steampowered\.com\/app\/([\d]+)/)?.[1]
      break
    case 'curator':
    case 'publisher':
    case 'developer':
    case 'franchise':
      result = /https?:\/\/store\.steampowered\.com\//.test(link) && (link.match(/curator\/([\d]+)/) || ((link.includes('publisher') ? link.match(/publisher\/(.+)\/?/) : link.includes('developer') ? link.match(/developer\/(.+)\/?/) : (link.match(/pub\/(.+)\/?/) || link.match(/dev\/(.+)\/?/))) || link.match(/franchise\/(.+)\/?/)))?.[1]
      break
    case 'game':
    case 'wishlist':
      result = link.match(/https?:\/\/store\.steampowered\.com\/app\/([\d]+)/)?.[1]
      break
    case 'discord': // guild
      result = link.match(/https?:\/\/discord\.com\/invite\/(.+)/)?.[1]
      break
    case 'instagram':
      result = link.match(/https:\/\/www\.instagram\.com\/(.+)?\//)?.[1]
      break
    case 'reddit':
      {
        result = link.match(/https?:\/\/www.reddit.com\/r\/([^/]*)/)?.[1]
        let userName = link.match(/https?:\/\/www.reddit.com\/user\/([^/]*)/)?.[1]
        if (userName) userName = 'u_' + userName
        result = result || userName
      }
      break
    case 'twitch':
      result = link.match(/https:\/\/www.twitch.tv\/(.+)/)?.[1]
      break
    case 'twitterUser':
      result = link.match(/https:\/\/twitter.com\/(.+)/)?.[1]
      break
    case 'retweet':
      result = link.match(/https:\/\/twitter.com\/.*?\/status\/([\d]+)/)?.[1]
      break
    case 'vk':
      result = link.match(/https:\/\/vk.com\/([^/]+)/)?.[1]
      break
  }
  return result
}
*/
export {
  unique,
  getUrlQuery,
  dateFormat,
  isEmptyObjArr,
  clearTaskInfo,
  uniqueTaskInfo,
  throwError,
  delay,
  assignment
}
