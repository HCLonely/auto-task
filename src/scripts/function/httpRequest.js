import { debug } from '../config'
import { echoLog } from './log'
import { throwError } from './tool'

function httpRequest (options) {
  return new Promise(resolve => {
    options.method = options.method.toUpperCase()
    if (options.dataType) options.responseType = options.dataType
    const requestObj = Object.assign({
      timeout: 30000,
      ontimeout (data) {
        resolve({ result: 'Error', statusText: 'Timeout', status: 601, data, options })
      },
      onabort (data) {
        resolve({ result: 'Error', statusText: 'Aborted', status: 602, data, options })
      },
      onerror (data) {
        resolve({ result: 'Error', statusText: 'Error', status: 603, data, options })
      },
      onload (data) {
        resolve({ result: 'Success', statusText: 'Load', status: 600, data, options })
      }
    }, options)
    GM_xmlhttpRequest(requestObj)
  }).then(result => {
    if (debug) console.log('发送请求:', result)
    return result
  }).catch(error => {
    throwError(error, 'httpRequest')
    if (debug) console.log('发送请求:', { errorMsg: error, options })
    return { result: 'JsError', statusText: 'Error', status: 604, error, options }
  })
}
async function getFinalUrl (url, options = null) {
  try {
    const conf = Object.assign({
      url,
      method: 'GET'
    }, options)
    const { result, statusText, status, data } = await httpRequest(conf)
    if (result === 'Success') {
      return { result, statusText, status, finalUrl: data.finalUrl, url }
    } else {
      return { result, statusText, status, url }
    }
  } catch (error) {
    throwError(error, 'getFinalUrl')
    return { result: 'FunctionError', statusText: 'getFinalUrl', status: 605, url }
  }
}
async function visitLink (url, options = { method: 'HEAD' }) {
  try {
    const logStatus = echoLog({ type: 'visitLink', text: url })
    const { result, statusText, status } = await getFinalUrl(url, options)
    if (result === 'Success') {
      logStatus.warning('Complete')
    } else {
      logStatus.error(`${result}:${statusText}(${status})`)
    }
  } catch (error) {
    if (debug) console.error(error)
    throwError(error, 'visitLink')
  }
}

export { httpRequest, getFinalUrl, visitLink }
