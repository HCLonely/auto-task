const fs = require('fs')
const crypto = require('crypto')
const jsMD5 = md5(fs.readFileSync('./require/require.min.js'))
const cssMD5 = md5(fs.readFileSync('./require/fuck-task.min.css'))

const path = process.argv[2] === '--dev' ? 'auto-task-test.user.js' : 'auto-task.user.js'

const code = fs.readFileSync(path).toString().replace('__JSMD5__', jsMD5).replace('__CSSMD5__', cssMD5)
fs.writeFileSync(path, code)

function md5 (data) {
  const hash = crypto.createHash('md5')
  return hash.update(data).digest('hex')
}
