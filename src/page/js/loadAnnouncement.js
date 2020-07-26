import { dateFormat } from '../../scripts/function/tool'

function loadAnnouncement () { // eslint-disable-line no-unused-vars
  $.get('/announcement.json?t=' + new Date().getTime(), function (data, status, xhr) {
    $('.non-js').hide()
    if (status === 'success') {
      data.map(e => {
        e.time = dateFormat('YYYY-mm-dd HH:MM', new Date(e.time))
        return e
      })
      new Vue({ // eslint-disable-line
        el: '#app',
        data: { announcements: data }
      })
    } else {
      $('#failed').text('加载公告失败！Loading announcement failed!')
    }
  }, 'json')
}
loadAnnouncement()
