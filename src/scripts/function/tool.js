
function unique (e) {
  return [...new Set(e)]
}
function getUrlQuery (url) {
  const q = {}
  if (url) {
    if (url.includes('?')) url.split('?')[1].replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => { q[k] = v })
  } else {
    window.location.search.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => { q[k] = v })
  }
  return q
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
function isEmptyObjArr (object) {
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
}

function clearArray (arr) {
  if (Array.isArray(arr[0])) {
    return arr.map(() => {
      return []
    })
  } else {
    return []
  }
}
function clearTaskInfo (data) {
  if (Array.isArray(data)) {
    return clearArray(data)
  } else {
    for (const [k, v] of Object.entries(data)) {
      if (Array.isArray(v)) data[k] = clearArray(v)
    }
  }
}
function uniqueTaskInfo (data) {
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
}
export {
  unique,
  getUrlQuery,
  dateFormat,
  isEmptyObjArr,
  clearTaskInfo,
  uniqueTaskInfo
}
