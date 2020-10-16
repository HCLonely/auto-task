const fs = require('fs-extra')
function doSomething (options) {
  return {
    name: 'doSomething', // this name will show up in warnings and errors
    async renderChunk (code, chunk) {
      if (options.addContainer) {
        code = `try{
    unsafeWindow.AutoTask = {}
    ${code}
  } catch (e) {
    Swal.fire({
      icon: 'error',
      html: '脚本执行出错，详细信息请查看控制台(红色背景部分)！<br>Script execution error, please see the console for details (red background part)!'
    })
    console.log('%c%s', 'color:white;background:red', e.stack)
  }`
      }
      if (options.addHeader) {
        const header = fs.readFileSync('./src/scripts/header.js', 'utf-8')
        code = header + code.replace(/\/\*[\s]*?global.*?\*\/(\r)?\n/g, '').replace(/ \/\/ eslint-disable-line (no-unused-vars|prefer-const|no-global-assign|promise\/param-names|no-new)/g, '').replace(/\/\* disable[\w\W]*?\*\//g, '').replace(/ \/\/ (?!eslint-disable-line).*/g, '')
      }
      if (options.replace) {
        for (const [k, v] of Object.entries(options.replace)) {
          code = code.replace(new RegExp(k, 'g'), v)
        }
      }
      return {
        code: code
      }
    }
  }
}
exports.doSomething = doSomething
