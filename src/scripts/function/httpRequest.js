import { debug } from '../config'
import { echoLog } from './log'

function httpRequest (e) {
  e.method = e.method.toUpperCase()
  if (e.dataType) e.responseType = e.dataType
  const requestObj = Object.assign({
    timeout: 30000,
    ontimeout (data) {
      if (debug) console.log(data)
      if (e.status) e.status.error('Error:Timeout(0)')
      if (e.r) e.r({ result: 'error', statusText: 'Timeout', status: 0, option: e })
    },
    onabort (data) {
      if (debug) console.log(data)
      if (e.status) e.status.error('Error:Aborted(0)')
      if (e.r) e.r({ result: 'error', statusText: 'Aborted', status: 0, option: e })
    },
    onerror (data) {
      if (debug) console.log(data)
      if (e.status) e.status.error('Error:Error(0)')
      if (e.r) e.r({ result: 'error', statusText: 'Error', status: 0, option: e })
    }
  }, e)
  if (debug) console.log('发送请求:', requestObj)
  GM_xmlhttpRequest(requestObj)
}
function getFinalUrl (r, url, options = null) {
  const conf = Object.assign({
    url,
    method: 'GET',
    onload (response) {
      r({ result: 'success', finalUrl: response.finalUrl, url })
    },
    r
  }, options)
  httpRequest(conf)
}
function visitLink (r, url, options = {}) {
  if (!options.method) options.method = 'HEAD'
  const status = echoLog({ type: 'visitLink', text: url })
  new Promise(resolve => {
    getFinalUrl(resolve, url, options)
  }).then(() => {
    status.warning('Complete')
    r(1)
  }).catch(err => {
    console.error(err)
  })
}

export { httpRequest, getFinalUrl, visitLink }
