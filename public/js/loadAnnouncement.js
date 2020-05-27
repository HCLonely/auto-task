/* global getI18n */
function loadAnnouncement () { // eslint-disable-line no-unused-vars
  $.get('/public/announcement.json?t=' + new Date().getTime(), function (data, status, xhr) {
  // $.get('/announcement.json?t=' + new Date().getTime(), function (data, status, xhr) {
    if (status === 'success') {
      data.map(e => {
        e.time = dateFormat('YYYY-mm-dd HH:MM', new Date(e.time))
        return e
      })
      new Vue({ // eslint-disable-line no-new
        el: '#app',
        data: { announcements: data }
      })
    } else {
      document.getElementById('failed').innerText = `${getI18n('loadAnnouncementFailed')}${status}！`
    }
  }, 'json')
}
function dateFormat (fmt, date) {
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
}
loadAnnouncement()
