/* global dayjs */

window.addCard = function addCard (item) {
  return `<div id="${item.time}" class="card text-center" ${((new Date().getTime() - item.time) / (24 * 3600 * 1000)) >= parseInt(window.delayNoticeTime) ? 'style="background-color:#ebf9ec"' : ''}>
  <div class="card-header">
    <a href="${item.link}" target="_blank">${item.link}</a>
    <a href="javascript:deleteNotice(${item.time})" class="btn delete btn-outline-danger">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
      </svg>
    </a>
  </div>
  <div class="card-body">
    <h5 class="card-title">Tasks</h5>
    <ul>
    ${formatTaskLink(item.taskInfo)}
    </ul>
    <a href="javascript:remove('${item.time}')" class="btn btn-primary">Remove</a>
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
    if (k === 'toFinalUrl' || k === 'toGuild') continue
    for (const e of v) {
      const url = toFinalUrl[e]
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
          break
        default:
          break
      }
    }
  }
  return html
}
