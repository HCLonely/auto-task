const fs = require('fs-extra')
function doSomething (options) {
  return {
    name: 'doSomething', // this name will show up in warnings and errors
    async renderChunk (code, chunk) {
      if (options.addContainer) {
        code = '(function(){\n' + code + '\n})()'
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
