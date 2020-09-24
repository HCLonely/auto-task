import { getI18n } from '../i18n'

function unique (e) {
  try {
    return [...new Set(e)]
  } catch (e) {
    throwError(e, 'unique')
  }
}
function getUrlQuery (url) {
  try {
    const q = {}
    if (url) {
      if (url.includes('?')) url.split('?')[1].replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => { q[k] = v })
    } else {
      window.location.search.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => { q[k] = v })
    }
    return q
  } catch (e) {
    throwError(e, 'getUrlQuery')
  }
}
function dateFormat (fmt, date) {
  try {
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
  } catch (e) {
    throwError(e, 'dateFormat')
  }
}
function isEmptyObjArr (object) {
  try {
    for (const value of Object.values(object)) {
      if (Object.prototype.toString.call(value) === '[object Array]') {
        if (value.length !== 0) return false
      } else if (Object.prototype.toString.call(value) === '[object Object]') {
        if (Object.keys(value).length !== 0) return false
      } else if (Object.prototype.toString.call(value) === '[object String]') {
        if (value !== '') return false
      }
    }
    return true
  } catch (e) {
    throwError(e, 'isEmptyObjArr')
  }
}

function clearArray (arr) {
  try {
    if (Array.isArray(arr[0])) {
      return arr.map(() => {
        return []
      })
    } else {
      return []
    }
  } catch (e) {
    throwError(e, 'clearArray')
  }
}
function clearTaskInfo (data) {
  try {
    if (Array.isArray(data)) {
      return clearArray(data)
    } else {
      for (const [k, v] of Object.entries(data)) {
        if (Array.isArray(v)) data[k] = clearArray(v)
      }
      return data
    }
  } catch (e) {
    throwError(e, 'clearTaskInfo')
  }
}
function uniqueTaskInfo (data) {
  try {
    if (Array.isArray(data)) {
      if (Array.isArray(data[0])) {
        for (let i = 0; i < data.length; i++) {
          data[i] = unique(data[i])
        }
      } else {
        data = unique(data)
      }
    } else {
      for (const [k, v] of Object.entries(data)) {
        if (Array.isArray(v)) data[k] = unique(v)
      }
    }
    return data
  } catch (e) {
    throwError(e, 'uniqueTaskInfo')
  }
}
function throwError (e, name) {
  Swal.fire({
    icon: 'error',
    text: getI18n('functionError', name)
  })
  console.log('%c%s', 'color:white;background:red', name + '\n' + e.stack)
}

function delay (time = 1000) {
  return new Promise(resolve => {
    setTimeout(() => { resolve() }, time)
  })
}
export {
  unique,
  getUrlQuery,
  dateFormat,
  isEmptyObjArr,
  clearTaskInfo,
  uniqueTaskInfo,
  throwError,
  delay
}
