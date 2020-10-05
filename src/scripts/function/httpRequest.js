import { debug } from '../config'
import { echoLog } from './log'
import { throwError } from './tool'

function httpRequest (options) {
  /* disable
  return new Promise(resolve => {
    options.method = options.method.toUpperCase()
    if (options.dataType) options.responseType = options.dataType
    const requestObj = Object.assign({
      timeout: 30000,
      ontimeout (data) {
        resolve({ result: 'error', statusText: 'Timeout', status: 0, data, options })
        /*
        if (debug) console.log(data)
        if (options.status) options.status.error('Error:Timeout(0)')
        if (options.r) options.r({ result: 'error', statusText: 'Timeout', status: 0, option: options })

      },
      onabort (data) {
        resolve({ result: 'error', statusText: 'Aborted', status: 0, data, options })
        /*
        if (debug) console.log(data)
        if (options.status) options.status.error('Error:Aborted(0)')
        if (options.r) options.r({ result: 'error', statusText: 'Aborted', status: 0, option: options })

      },
      onerror (data) {
        resolve({ result: 'error', statusText: 'Error', status: 0, data, options })
        /*
        if (debug) console.log(data)
        if (options.status) options.status.error('Error:Error(0)')
        if (options.r) options.r({ result: 'error', statusText: 'Error', status: 0, option: options })

      }
    }, options)
    if (debug) console.log('发送请求:', requestObj)
    GM_xmlhttpRequest(requestObj)
  }).then(result => {

  })
  */
  try {
    options.method = options.method.toUpperCase()
    if (options.dataType) options.responseType = options.dataType
    const requestObj = Object.assign({
      timeout: 30000,
      ontimeout (data) {
        if (debug) console.log(data)
        if (options.status) options.status.error('Error:Timeout(0)')
        if (options.r) options.r({ result: 'error', statusText: 'Timeout', status: 0, option: options })
      },
      onabort (data) {
        if (debug) console.log(data)
        if (options.status) options.status.error('Error:Aborted(0)')
        if (options.r) options.r({ result: 'error', statusText: 'Aborted', status: 0, option: options })
      },
      onerror (data) {
        if (debug) console.log(data)
        if (options.status) options.status.error('Error:Error(0)')
        if (options.r) options.r({ result: 'error', statusText: 'Error', status: 0, option: options })
      }
    }, options)
    if (debug) console.log('发送请求:', requestObj)
    GM_xmlhttpRequest(requestObj)
  } catch (e) {
    throwError(e, 'httpRequest')
  }
}
function getFinalUrl (r, url, options = null) {
  try {
    const conf = Object.assign({
      url,
      method: 'GET',
      onload (response) {
        r({ result: 'success', finalUrl: response.finalUrl, url })
      },
      r
    }, options)
    httpRequest(conf)
  } catch (e) {
    throwError(e, 'getFinalUrl')
  }
}
function visitLink (r, url, options = {}) {
  try {
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
  } catch (e) {
    throwError(e, 'visitLink')
  }
}

export { httpRequest, getFinalUrl, visitLink }
