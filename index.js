/* eslint-disable no-useless-escape */
const fs = require('fs')
const path = require('path')
const { program } = require('commander')
const { minify } = require('html-minifier')
const babel = require('@babel/core')
const UglifyJS = require('uglify-js')
const CleanCSS = require('clean-css')

const version = require('./package.json').version // 加载版本信息
const announcement = require('./package.json').announcement // 加载版本信息

program.version(version)
program
  .option('-p, --pack', '生成auto-task.user.js文件')
  .option('-s, --setting', '压缩setting.html文件')
  .option('-a, --announcement', '压缩announcement.html文件')
  .option('-h, --html', '压缩所有html文件')
  .option('-t, --test', '生成auto-task.user.js文件(Test)')
  .option('-j, --js', '生成index.min.js文件')
  .option('-c, --css', '生成fuck-task.min.css文件')

program.parse(process.argv)

if (program.pack) packUserJs()
if (program.test) packUserJs(true)
if (program.setting) minHtml('setting.html')
if (program.announcement) minHtml('announcement.html')
if (program.html) {
  minHtml('setting.html')
  minHtml('announcement.html')
  minHtml('index.html')
  minHtml('time.html')
  minHtml('time_en.html')
}
if (program.js) publicJs()
if (program.css) minCSS()

function packUserJs (test = false) {
  const header = fs.readFileSync('./src/header.txt', 'utf-8').replace(/VERSION/g, version).replace(/BRANCH/g, test ? 'test' : 'master') // 加载Tampermonkey头部信息
  const disabledPlugins = ['gamecode.js'] // 禁用的插件
  const i18n = fs.readFileSync('./src/tools/i18n.js', 'utf-8') // 加载i18n相关函数
  const defaultConfig = fs.readFileSync('./src/tools/defaultConfig.js', 'utf-8') // 加载默认设置
  const functionJs = fs.readFileSync('./src/tools/function.js', 'utf-8') // 加载功能函数
  // 加载插件
  const pluginsFiles = fs.readdirSync('./src/plugins')
  const plugins = []
  let pluginsData = ''
  pluginsFiles.map((e, i) => {
    if (!disabledPlugins.includes(e)) {
      pluginsData += '\n\n' + fs.readFileSync('./src/plugins/' + e, 'utf-8')
      plugins.push(e.replace('.js', ''))
    }
  })
  const main = fs.readFileSync('./src/main.js', 'utf-8') // 加载主体

  // 简单打包
  const body = `(function() {
    'use strict'

    GM_addStyle(GM_getResourceText('CSS'))
    ${i18n}
    $(document).ajaxError(function (event, xhr, options, exc) {
      Swal.fire({
        icon: 'error',
        text: getI18n('jsError')
      })
      console.log('%c%s', 'color:white;background:red', getI18n('ajaxError') + '：')
      console.log('Event:', event)
      console.log('XMLHttpRequest :', xhr)
      console.log('Options:', options)
      console.log('JavaScript exception:', exc)
    })

    try{

${defaultConfig}

${functionJs}${pluginsData}

const plugins = ${JSON.stringify(plugins).replace(/'|"/g, '')}

${main}

    }catch(e){
      Swal.fire({
        icon: 'error',
        text: getI18n('jsError')
      })
      console.log('%c%s', 'color:white;background:red', e.stack)
    }

})()
`.replace(/\/\*[\s]*?global.*?\*\/(\r)?\n/g, '').replace(/ \/\/ eslint-disable-line (no-unused-vars|prefer-const|no-global-assign|promise\/param-names|no-new)/g, '').replace(/\/\* disable[\w\W]*?\*\//g, '').replace(/BRANCH/g, test ? 'test' : 'master')

  fs.writeFile('./auto-task.raw.user.js', header + '\n' + body, function (error) {
    if (error) {
      return console.error('auto-task.raw.user.js文件写入失败: ', error)
    }
    console.log('auto-task.raw.user.js文件写入成功')
  })
  babel.transform(body, {}, function (err, result) {
    if (err) {
      return console.error('babel转换失败: ', err)
    }
    fs.writeFile('./auto-task.user.js', header + '\n' + result.code, function (error) {
      if (error) {
        return console.error('auto-task.user.js文件写入失败: ', error)
      }
      console.log('auto-task.user.js文件写入成功')
      update(test)
    })
  })
}

function minHtml (filename) {
  const html = fs.readFileSync(path.join('./src/html', filename), 'utf-8')
  fs.writeFile(path.join('./public', filename), minify(html, { removeComments: true, collapseWhitespace: true, minifyCSS: true, minifyJS: true }), function (error) {
    if (error) {
      return console.error(filename + '文件写入失败: ', error)
    }

    console.log(filename + '写入成功')
  })
}
function update (test) {
  const announcementHistory = JSON.parse(fs.readFileSync('./public/announcement.json', 'utf-8'))
  const time = new Date().getTime()
  const newVersion = {
    version: version,
    time: time,
    text: announcement
  }
  announcementHistory.unshift(newVersion)
  const versionFileName = `version_${test ? 'test' : 'master'}.json`
  fs.writeFile('./public/' + versionFileName, JSON.stringify(newVersion), function (error) {
    if (error) {
      return console.error(versionFileName + '文件写入失败: ', error)
    }

    console.log(versionFileName + '写入成功')
  })
  if (test) return
  fs.writeFile('./public/announcement.json', JSON.stringify(announcementHistory), function (error) {
    if (error) {
      return console.error('announcement.json文件写入失败: ', error)
    }

    console.log('announcement.json写入成功')
  })
}
function publicJs () {
  const defaultConfig = fs.readFileSync('./src/js/defaultConfig.js', 'utf-8')
  const i18n = fs.readFileSync('./src/js/i18n.js', 'utf-8')
  const main = fs.readFileSync('./src/js/main.js', 'utf-8')
  babel.transform(defaultConfig + '\n' + i18n + '\n' + main, {}, function (err, result) {
    if (err) {
      return console.error('babel转换public js失败: ', err)
    }
    fs.writeFile('./public/js/index.min.js', UglifyJS.minify(result.code).code, function (error) {
      if (error) {
        return console.error('index.min.js文件写入失败: ', error)
      }
      console.log('index.min.js文件写入成功')
    })
  })
  const loadAnnouncement = fs.readFileSync('./src/js/loadAnnouncement.js', 'utf-8')
  babel.transform(loadAnnouncement, {}, function (err, result) {
    if (err) {
      return console.error('babel转换loadAnnouncement.js失败: ', err)
    }
    fs.writeFile('./public/js/loadAnnouncement.min.js', UglifyJS.minify(result.code).code, function (error) {
      if (error) {
        return console.error('loadAnnouncement.min.js文件写入失败: ', error)
      }
      console.log('loadAnnouncement.min.js文件写入成功')
    })
  })
}
function minCSS () {
  const overhangCss = fs.readFileSync('./lib/overhang.min.css', 'utf-8')
  const bootstrapCss = fs.readFileSync('./lib/bootstrap.min.css', 'utf-8')
  const iconfontCss = fs.readFileSync('./lib/iconfont.min.css', 'utf-8')
  const otherCss = fs.readFileSync('./lib/other.css', 'utf-8')
  const output = new CleanCSS().minify(bootstrapCss + overhangCss + iconfontCss + otherCss)
  fs.writeFileSync('./lib/fuck-task.min.css', output.styles)
  console.log('fuck-task.min.css文件写入成功')
}
