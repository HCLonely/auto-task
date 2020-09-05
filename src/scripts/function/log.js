import { getI18n } from '../i18n'

function echoLog (e) { // switch case !!
  let ele = ''
  switch (e.type) {
    case 'updateSteamCommunity':
      ele = $(`<li>${getI18n('updateCommunityId')}<font></font></li>`)
      break
    case 'updateSteamStore':
      ele = $(`<li>${getI18n('updateStoreId')}<font></font></li>`)
      break
    case 'joinSteamGroup':
    case 'leaveSteamGroup':
    case 'getSteamGroupId':
      ele = $(`<li>${getI18n(e.type)}<a href="https://steamcommunity.com/groups/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'subscribeForum':
    case 'unsubscribeForum':
    case 'getForumId':
      ele = $(`<li>${getI18n(e.type)}<a href="https://steamcommunity.com/app/${e.text}/discussions/" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'followCurator':
    case 'unfollowCurator':
    case 'getCuratorId':
      ele = $(`<li>${getI18n(e.type)}<a href="https://store.steampowered.com/curator/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'getDeveloperId':
    case 'followDeveloper':
    case 'unfollowDeveloper':
      ele = $(`<li>${getI18n(e.type)}<a href="https://store.steampowered.com/developer/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'getPublisherId':
    case 'followPublisher':
    case 'unfollowPublisher':
      ele = $(`<li>${getI18n(e.type)}<a href="https://store.steampowered.com/publisher/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'getFranchiseId':
    case 'followFranchise':
    case 'unfollowFranchise':
      ele = $(`<li>${getI18n(e.type)}<a href="https://store.steampowered.com/franchise/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'addWishlist':
    case 'removeWishlist':
    case 'followGame':
    case 'unfollowGame':
      ele = $(`<li>${getI18n(e.type)}<a href="https://store.steampowered.com/app/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'likeAnnouncements':
      ele = $(`<li>${getI18n('likeAnnouncements')}<a href="${e.url}" target="_blank">${e.id}</a>...<font></font></li>`)
      break
    case 'verifyDiscordAuth':
      ele = $(`<li>${getI18n('verifyDiscordAuth')}...<font></font></li>`)
      break
    case 'joinDiscordServer':
    case 'leaveDiscordServer':
      ele = $(`<li>${getI18n(e.type)}<a href="https://discord.com/invite/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'updateDiscordAuth':
      ele = $(`<li style="color:red;">${getI18n('updateDiscordAuth')}</li>`)
      break
    case 'verifyTwitchAuth':
      ele = $(`<li>${getI18n('verifyTwitchAuth')}...<font></font></li>`)
      break
    case 'followTwitchChannel':
    case 'unfollowTwitchChannel':
    case 'getTwitchChannelId':
      ele = $(`<li>${getI18n(e.type)}<a href="https://www.twitch.tv/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'getInsInfo':
      ele = $(`<li>${getI18n('getInsInfo')}<a href="https://www.instagram.com/${e.text}/" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'followIns':
    case 'unfollowIns':
      ele = $(`<li>${getI18n(e.type)}<a href="https://www.instagram.com/${e.text}/" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'updateTwitterInfo':
      ele = $(`<li>${getI18n('updateTwitterInfo')}...<font></font></li>`)
      break
    case 'getTwitterUserId':
    case 'followTwitterUser':
    case 'unfollowTwitterUser':
      ele = $(`<li>${getI18n(e.type)}<a href="https://twitter.com/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'retweet':
    case 'unretweet':
      ele = $(`<li>${getI18n(e.type)}${e.text}...<font></font></li>`)
      break
    case 'updateRedditInfo':
      ele = $(`<li>${getI18n('updateRedditInfo')}...<font></font></li>`)
      break
    case 'joinReddit':
    case 'leaveReddit':
      ele = $(`<li>${getI18n(e.type)}<a href="https://www.reddit.com/r/${e.text}/" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'verifyVkLogin':
      ele = $(`<li>${getI18n('verifyVkLogin')}...<font></font></li>`)
      break
    case 'getVkId':
    case 'joinVkGroup':
    case 'leaveVkGroup':
    case 'joinVkPublic':
    case 'leaveVkPublic':
      ele = $(`<li>${getI18n(e.type)}<a href="https://vk.com/${e.text}/" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'visitLink':
      ele = $(`<li>${getI18n('visitLink')}<a href="${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'custom':
      ele = $(e.text)
      break
    default:
      ele = $(`<li>${getI18n('unknown')}:${e.type}...<font></font></li>`)
      break
  }
  ele.addClass('card-text')
  $('#fuck-task-info .card-textarea').append(ele)
  ele[0].scrollIntoView()
  const font = ele.find('font')
  const status = {
    font,
    success (text = 'Success', html = false) {
      this.font.attr('class', '').addClass('success')
      html ? this.font.html(text) : this.font.text(text)
    },
    error (text = 'Error', html = false) {
      this.font.attr('class', '').addClass('error')
      html ? this.font.html(text) : this.font.text(text)
    },
    warning (text = 'Warning', html = false) {
      this.font.attr('class', '').addClass('warning')
      html ? this.font.html(text) : this.font.text(text)
    },
    info (text = 'Info', html = false) {
      this.font.attr('class', '').addClass('info')
      html ? this.font.html(text) : this.font.text(text)
    }
  }
  return status
}
function toggleLogs () {
  const btn = $('#toggle-logs')
  const taskInfoDiv = $('#fuck-task-info')
  if (taskInfoDiv.is(':hidden')) {
    btn.text('HideLogs').attr('title', getI18n('hideLog'))
    taskInfoDiv.show().animate({ right: '16px' }, 'fast')
  } else {
    btn.text('ShowLogs').attr('title', getI18n('showLog'))
    taskInfoDiv.animate({ right: '-100%' }, 'fast', () => { taskInfoDiv.hide() })
  }
}

export { echoLog, toggleLogs }
