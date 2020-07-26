const fs = require('fs-extra')
const CleanCSS = require('clean-css')
const { info, success } = require('./log')
const version = fs.readJSONSync('package.json').version

function minCSS () {
  info('Remove old css file: require/fuck-task.min.css')
  fs.removeSync('./require/fuck-task.min.css')
  info('Generate new css file: require/fuck-task.min.css')
  const overhangCss = fs.readFileSync('./src/style/overhang.min.css', 'utf-8')
  const bootstrapCss = fs.readFileSync('./src/style/bootstrap.min.css', 'utf-8')
  const iconfontCss = fs.readFileSync('./src/style/iconfont.min.css', 'utf-8').replace(/__VERSION__/g, version)
  const otherCss = fs.readFileSync('./src/style/other.css', 'utf-8').replace(/__VERSION__/g, version)
  const output = new CleanCSS().minify(bootstrapCss + overhangCss + iconfontCss + otherCss)
  fs.writeFileSync('./require/fuck-task.min.css', output.styles)
  success('Generate css file success!')
}

module.exports = minCSS
