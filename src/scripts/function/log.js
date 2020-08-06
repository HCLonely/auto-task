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
      ele = $(`<li>${getI18n('joinGroup')}<a href="https://steamcommunity.com/groups/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'getGroupId':
      ele = $(`<li>${getI18n('getGroupId')}<a href="https://steamcommunity.com/groups/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'leaveSteamGroup':
      ele = $(`<li>${getI18n('leaveGroup')}<a href="https://steamcommunity.com/groups/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'followCurator':
      ele = $(`<li>${getI18n('followCurator')}<a href="https://store.steampowered.com/curator/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'unfollowCurator':
      ele = $(`<li>${getI18n('unfollowCurator')}<a href="https://store.steampowered.com/curator/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'getCuratorId':
      ele = $(`<li>${getI18n('getCuratorId')}<a href="https://store.steampowered.com/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'getDeveloperId':
      ele = $(`<li>${getI18n('getDeveloperId')}<a href="https://store.steampowered.com/developer/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'followDeveloper':
      ele = $(`<li>${getI18n('followDeveloper')}<a href="https://store.steampowered.com/developer/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'unfollowDeveloper':
      ele = $(`<li>${getI18n('unfollowDeveloper')}<a href="https://store.steampowered.com/developer/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'getPublisherId':
      ele = $(`<li>${getI18n('getPublisherId')}<a href="https://store.steampowered.com/publisher/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'followPublisher':
      ele = $(`<li>${getI18n('followPublisher')}<a href="https://store.steampowered.com/publisher/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'unfollowPublisher':
      ele = $(`<li>${getI18n('unfollowPublisher')}<a href="https://store.steampowered.com/publisher/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'getFranchiseId':
      ele = $(`<li>${getI18n('getFranchiseId')}<a href="https://store.steampowered.com/franchise/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'followFranchise':
      ele = $(`<li>${getI18n('followFranchise')}<a href="https://store.steampowered.com/franchise/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'unfollowFranchise':
      ele = $(`<li>${getI18n('unfollowFranchise')}<a href="https://store.steampowered.com/franchise/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'addWishlist':
      ele = $(`<li>${getI18n('addWishlist')}<a href="https://store.steampowered.com/app/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'removeWishlist':
      ele = $(`<li>${getI18n('removeWishlist')}<a href="https://store.steampowered.com/app/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'followGame':
      ele = $(`<li>${getI18n('followGame')}<a href="https://store.steampowered.com/app/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'unfollowGame':
      ele = $(`<li>${getI18n('unfollowGame')}<a href="https://store.steampowered.com/app/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'likeAnnouncements':
      ele = $(`<li>${getI18n('likeAnnouncements')}<a href="${e.url}" target="_blank">${e.id}</a>...<font></font></li>`)
      break
    case 'verifyDiscordAuth':
      ele = $(`<li>${getI18n('verifyDiscordAuth')}...<font></font></li>`)
      break
    case 'joinDiscordServer':
      ele = $(`<li>${getI18n('joinDiscordServer')}<a href="https://discord.com/invite/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'leaveDiscordServer':
      ele = $(`<li>${getI18n('leaveDiscordServer')}<a href="https://discord.com/invite/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
      break
    case 'updateDiscordAuth':
      ele = $(`<li style="color:red;">${getI18n('updateDiscordAuth')}</li>`)
      break
    case 'visitLink':
      ele = $(`<li>${getI18n('visitLink')}...<a href="${e.text}" target="_blank">${e.text}</a>...<font></font></li>`)
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
