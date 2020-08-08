import { debug } from '../../config'
import { echoLog } from '../log'
import { httpRequest } from '../httpRequest'
// import { unique } from '../tool'
import { getI18n } from '../../i18n'

/* global commonOptions */

/* 未完成任务: i18n */

function updateTwitchInfo (notice) {
  try {
    const authToken = Cookies.get('auth-token')
    const isLogin = !!Cookies.get('login')
    if (authToken && isLogin) {
      twitchInfo.authToken = authToken
      twitchInfo.isLogin = isLogin
      twitchInfo.clientId = commonOptions?.headers['Client-ID']
      twitchInfo.updateTime = new Date().getTime()
      GM_setValue('twitchInfo', twitchInfo)
      if (notice) {
        Swal.fire({
          title: getI18n('updateTwitchInfoSuccess'),
          icon: 'success'
        })
      }
    } else {
      if (notice) {
        Swal.fire({
          title: getI18n('needLogin'),
          icon: 'warning'
        })
      }
    }
  } catch (e) {
    if (debug) console.log(e)
    if (notice) {
      Swal.fire({
        title: getI18n('updateTwitchInfoError'),
        icon: 'error'
      })
    }
  }
}

function verifyTwitchAuth () {
  const status = echoLog({ type: 'verifyTwitchAuth' })

  return new Promise(resolve => {
    httpRequest({
      url: 'https://gql.twitch.tv/gql',
      method: 'POST',
      dataType: 'json',
      headers: { Authorization: 'OAuth ' + twitchInfo.authToken, 'Client-Id': twitchInfo.clientId },
      data: '[{"operationName":"FrontPageNew_User","variables":{"limit":1},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"64bd07a2cbaca80699d62636d966cf6395a5d14a1f0a14282067dcb28b13eb11"}}}]',
      onload (response) {
        if (debug) console.log(response)
        if (response.status === 200 && response.response?.[0]?.data?.currentUser) {
          status.success()
          resolve({ result: 'success', statusText: response.statusText, status: response.status })
        } else {
          status.error('Error:' + response.statusText + '(' + response.status + ')')
          resolve({ result: 'error', statusText: response.statusText, status: response.status })
        }
      },
      r: resolve,
      status
    })
  }).then(data => {
    return data?.result === 'success'
  }).catch(error => {
    if (debug) console.log(error)
    return false
  })
}
unsafeWindow.verifyTwitchAuth = verifyTwitchAuth // 测试用
export { updateTwitchInfo }
