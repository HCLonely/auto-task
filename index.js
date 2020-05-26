/* eslint-disable no-useless-escape */
const fs = require('fs')
const path = require('path')
const { program } = require('commander')
const { minify } = require('html-minifier')
const babel = require('@babel/core')
const UglifyJS = require('uglify-js')

const version = require('./package.json').version // 加载版本信息
const announcement = require('./package.json').announcement // 加载版本信息

program.version(version)
program
  .option('-p, --pack', '生成auto-task.user.js文件')
  .option('-s, --setting', '压缩setting.html文件')
  .option('-a, --announcement', '压缩announcement.html文件')
  .option('-t, --test', '生成auto-task.user.js文件(Test)')
  .option('-j, --js', '生成index.min.js文件')

program.parse(process.argv)

if (program.pack) packUserJs()
if (program.test) packUserJs(true)
if (program.setting) {
  minHtml('setting.html')
}
if (program.announcement) minHtml('announcement.html')
if (program.js) publicJs()

function packUserJs (test = false) {
  const header = fs.readFileSync('./src/header.txt', 'utf-8').replace(/VERSION/g, version) // 加载Tampermonkey头部信息
  const disabledPlugins = ['gamecode.js'] // 禁用的插件
  const i18n = fs.readFileSync('./src/tools/i18n.js', 'utf-8') // 加载i18n相关函数
  const functionJs = fs.readFileSync('./src/tools/function.js', 'utf-8') // 加载功能函数
  const loadSetting = fs.readFileSync('./src/tools/loadSetting.js', 'utf-8') // 加载设置相关函数
  const loadAnnouncement = fs.readFileSync('./src/tools/loadAnnouncement.js', 'utf-8') // 加载公告相关函数
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

    ${i18n}
    GM_addStyle(GM_getResourceText('css'))
    $('body').append('<div v-cloak id="vue-ui"></div>')
    const vueUi = new Vue({ el: '#vue-ui' })
    Vue.config.errorHandler = function (err, vm, info) {
      setTimeout(() => {
        vueUi.$message({ type: 'error', duration: 0, message: getI18n('jsError'), showClose: true })
      }, 500)
      console.log('%c%s', 'color:white;background:red', 'Info:' + info + '\\nError:' + err.stack)
    }
    $(document).ajaxError(function (event, xhr, options, exc) {
      vueUi.$message({ type: 'error', duration: 0, message: getI18n('jsError'), showClose: true })
      console.log('%c%s', 'color:white;background:red', getI18n('ajaxError') + '：')
      console.log('Event:', event)
      console.log('XMLHttpRequest :', xhr)
      console.log('Options:', options)
      console.log('JavaScript exception:', exc)
    })
    
    try{

${functionJs}${pluginsData}

${loadSetting}

${loadAnnouncement}

const plugins = ${JSON.stringify(plugins).replace(/'|"/g, '')}

${main}

    }catch(e){
        setTimeout(() => {
          vueUi.$message({ type: 'error', duration: 0, message: getI18n('jsError'), showClose: true })
        }, 500)
        console.log('%c%s', 'color:white;background:red', e.stack)
    }
    
})()
`.replace(/\/\*[\s]*?global.*?\*\/(\r)?\n/g, '').replace(/ \/\/ eslint-disable-line (no-unused-vars|prefer-const|no-global-assign|promise\/param-names|no-new)/g, '').replace(/\/\* disable[\w\W]*?\*\//g, '')

  babel.transform(body, {}, function (err, result) {
    if (err) {
      return console.error('babel转换失败: ', err)
    }
    fs.writeFile('./auto-task.user.js', header + '\n' + result.code, function (error) {
      if (error) {
        return console.error('auto-task.user.js文件写入失败: ', error)
      }
      console.log('auto-task.user.js文件写入成功')
      if (!test) update()
    })
  })
}

function minHtml (filename) {
  const html = fs.readFileSync(path.join('./src', filename), 'utf-8')
  fs.writeFile(path.join('./public', filename), minify(html, { removeComments: true, collapseWhitespace: true, minifyCSS: true }), function (error) {
    if (error) {
      return console.error(filename + '文件写入失败: ', error)
    }

    console.log(filename + '写入成功')
  })
}
function update () {
  const announcementHistory = JSON.parse(fs.readFileSync('announcement.json', 'utf-8'))
  const time = new Date().getTime()
  const newVersion = {
    version: version,
    time: time,
    text: announcement
  }
  announcementHistory.unshift(newVersion)
  fs.writeFile('version.json', JSON.stringify(newVersion), function (error) {
    if (error) {
      return console.error('version.json文件写入失败: ', error)
    }

    console.log('version.json写入成功')
  })

  fs.writeFile('announcement.json', JSON.stringify(announcementHistory), function (error) {
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
}
