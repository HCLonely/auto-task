/*
 * @Author: HCLonely
 * @Date: 2021-01-28 16:28:08
 * @LastEditTime: 2021-01-28 17:30:02
 * @LastEditors: HCLonely
 * @FilePath: \auto-task\src\page\js\delayNotice.js
 * @Description: 添加延迟提醒列表
 */

/* global dayjs */

window.addCard = function addCard (item) {
  return `<div class="card text-center">
  <div class="card-header">
    <a href="${item.link}" target="_blank">${item.link}</a>
  </div>
  <div class="card-body">
    <h5 class="card-title">Tasks</h5>
    <ul>
    ${formatTaskLink(item.taskInfo)}
    </ul>
    <a href="#" class="btn btn-primary">Remove</a>
  </div>
  <div class="card-footer text-muted">
    ${dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}
  </div>
</div>`
}

function formatTaskLink (taskInfo) {
  let html = ''
  const toFinalUrl = taskInfo.toFinalUrl
  for (const [k, v] of Object.entries(taskInfo)) {
    const url = toFinalUrl[v]
    switch (k) {
      case 'groups':
        html += `<li class="card-text">Steam Group: <a href="${url}" target="_blank">${url}</a></li>`
        break
      case 'forums':
        html += `<li class="card-text">Steam Forum: <a href="${url}" target="_blank">${url}</a></li>`
        break
      case 'curators':
        html += `<li class="card-text">Steam Curator: <a href="${url}" target="_blank">${url}</a></li>`
        break
      case 'publishers':
        html += `<li class="card-text">Steam Publisher: <a href="${url}" target="_blank">${url}</a></li>`
        break
      case 'developers':
        html += `<li class="card-text">Steam Developer: <a href="${url}" target="_blank">${url}</a></li>`
        break
      case 'franchises':
        html += `<li class="card-text">Steam Franchise: <a href="${url}" target="_blank">${url}</a></li>`
        break
      case 'fGames':
        html += `<li class="card-text">Followed Steam Game: <a href="${url}" target="_blank">${url}</a></li>`
        break
      case 'wGames':
        html += `<li class="card-text">Steam Wishlist: <a href="${url}" target="_blank">${url}</a></li>`
        break
      case 'discords':
        html += `<li class="card-text">Discord Server: <a href="${url}" target="_blank">${url}</a></li>`
        break
      case 'instagrams':
        html += `<li class="card-text">Instagram User: <a href="${url}" target="_blank">${url}</a></li>`
        break
      case 'twitchs':
        html += `<li class="card-text">Twitch Channel: <a href="${url}" target="_blank">${url}</a></li>`
        break
      case 'reddits':
        html += `<li class="card-text">Reddit: <a href="${url}" target="_blank">${url}</a></li>`
        break
      case 'youtubeChannels':
        html += `<li class="card-text">Youtube Channel: <a href="${url}" target="_blank">${url}</a></li>`
        break
      case 'youtubeVideos':
        html += `<li class="card-text">Youtube Video: <a href="${url}" target="_blank">${url}</a></li>`
        break
      case 'vks':
        html += `<li class="card-text">VK: <a href="${url}" target="_blank">${url}</a></li>`
        break
      case 'links':
      case 'toFinalUrl':
      case 'announcements':
      case 'toGuild':
      // html += `<li class="card-text">Steam Announcement: <a href="${url}" target="_blank">${url}</a></li>`
        break
      default:
        break
    }
  }
  return html
}
