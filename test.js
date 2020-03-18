/* eslint-disable camelcase */
/* eslint-disable no-useless-escape */
const fs = require('fs')

function pack () {
  const ver = JSON.parse(fs.readFileSync('version', 'utf-8'))
  let version = ver.version
  const versionArr = version.split('.')
  version = versionArr.join('.')
  ver.version = version
  const i18n = fs.readFileSync('plugins/i18n.js', 'utf-8')
  const header = `// ==UserScript==
// @name           自动任务
// @name:en        Auto Task
// @namespace      auto-task
// @version        ${version}
// @description    自动完成赠key站任务
// @description:en Automatically complete giveaway tasks
// @author         HCLonely
// @license        MIT
// @iconURL        https://userjs.hclonely.com/favicon.ico
// @homepage       https://blog.hclonely.com/posts/777c60d5/
// @supportURL     https://github.com/HCLonely/auto-task/issues/new/choose
// @updateURL      https://userjs.hclonely.com/auto-task.user.js
// @include        *://giveaway.su/giveaway/view/*
// @include        *://marvelousga.com/*
// @include        *://dupedornot.com/*
// @include        *://www.grabfreegame.com/giveaway/*
// @include        *://www.bananagiveaway.com/giveaway/*
// @include        *://gamecode.win/*
// @include        /https?:\\/\\/gamehag.com\/.*?giveaway\\/.*/
// @include        *://prys.revadike.com/giveaway/?id=*
// @include        *://www.indiedb.com/giveaways*
// @include        *://www.opiumpulses.com/giveaways
// @include        *://gkey.fun/distribution/*
// @include        *://givekey.ru/distribution/*
// @include        *://takekey.ru/distribution/*
// @include        *://chubkeys.com/giveaway/*
// @include        *://giveawayhopper.com/giveaway/*
// @include        *://*freegamelottery.com*
// @include        *://gleam.io/*
// @include        *://www.spoune.com/index.php*
// @exclude        *googleads*
// @include        https://userjs.hclonely.com/setting.html
// @include        https://userjs.hclonely.com/setting_en.html
// @include        https://userjs.hclonely.com/announcement.html
// @require        https://cdn.bootcss.com/vue/2.6.10/vue.min.js
// @require        https://cdn.bootcss.com/element-ui/2.12.0/index.js
// @require        https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @resource       css https://userjs.hclonely.com/auto-task.min.css?ver=${version}
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_deleteValue
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          GM_getResourceText
// @grant          GM_registerMenuCommand
// @grant          GM_info
// @grant          GM_openInTab
// @grant          GM_download
// @connect        *
// @run-at         document-end
// @compatible     chrome >=58,没有测试其他浏览器的兼容性
// ==/UserScript==

(function() {
    'use strict';
    
    ${i18n}
    GM_addStyle(GM_getResourceText('css'));
    $('body').append('<div v-cloak id="vue-ui"></div>');
    let vueUi=new Vue({el:"#vue-ui"});
    Vue.config.errorHandler = function(err, vm, info) {
        setTimeout(()=>{
            vueUi.$message({type:"error",duration:0,message:getI18n("jsError"),showClose:true});
        },500);
        console.log("%c%s","color:white;background:red","Info:"+info+"\\nError:"+err.stack);
    }
    $(document).ajaxError(function(event,xhr,options,exc){
        vueUi.$message({type:"error",duration:0,message:getI18n("jsError"),showClose:true});
        console.log("%c%s","color:white;background:red",getI18n("ajaxError")+"：");
        console.log("Event:",event);
        console.log("XMLHttpRequest :",xhr);
        console.log("Options:",options);
        console.log("JavaScript exception:",exc);
    });
    
    try{`

  const functionJs = fs.readFileSync('plugins/function.js', 'utf-8')
  const pluginsFiles = fs.readdirSync('plugins')
  const plugins = []
  let pluginsData = ''
  pluginsFiles.map((e, i) => {
    if (!['function.js', 'loadSetting.js', 'loadAnnouncement.js', 'i18n.js'].includes(e)) {
      pluginsData += '\n\n' + fs.readFileSync('plugins/' + e, 'utf-8')
      plugins.push(e.replace('.js', ''))
    }
  })
  const loadSetting = fs.readFileSync('plugins/loadSetting.js', 'utf-8')
  const loadAnnouncement = fs.readFileSync('plugins/loadAnnouncement.js', 'utf-8')
  const main = fs.readFileSync('main.js', 'utf-8')

  const data = `${header}

${functionJs}${pluginsData}

${loadSetting}

${loadAnnouncement}

const plugins = ${JSON.stringify(plugins).replace(/'|"/g, '')}

${main}

    }catch(e){
        setTimeout(()=>{
            vueUi.$message({type:"error",duration:0,message:getI18n("jsError"),showClose:true});
        },500);
        console.log("%c%s","color:white;background:red",e.stack);
    }
    
})();
`.replace(/\/\*[\s]*?global.*?\*\/(\r)?\n/g, '')
  fs.writeFile('version', JSON.stringify(ver), function (error) {
    if (error) {
      console.log(error)
    } else {
      console.log('version', version)
    }
  })
  fs.writeFile('auto-task.user.js', data, function (error) {
    if (error) {
      console.log(error)
    } else {
      console.log('auto-task.user.js写入成功')
    }
  })
}

pack()
