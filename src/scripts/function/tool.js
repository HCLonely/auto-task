
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

export {
  unique,
  getUrlQuery,
  dateFormat,
  isEmptyObjArr
}
