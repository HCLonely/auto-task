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
// @iconURL        https://github.com/HCLonely/auto-task/raw/master/favicon.ico
// @homepage       https://blog.hclonely.com/posts/777c60d5/
// @supportURL     https://github.com/HCLonely/auto-task/issues/new/choose
// @updateURL      https://github.com/HCLonely/auto-task/raw/master/auto-task.user.js
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
// @resource       css https://github.com/HCLonely/auto-task/raw/master/auto-task.min.css?ver=${version}
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

  const data_1 = fs.readFileSync('plugins/function.js', 'utf-8')
  const data_2 = fs.readFileSync('plugins/giveawaysu.js', 'utf-8')
  const data_3 = fs.readFileSync('plugins/marvelousga.js', 'utf-8')
  const data_4 = fs.readFileSync('plugins/banana.js', 'utf-8')
  const data_5 = fs.readFileSync('plugins/gamecode.js', 'utf-8')
  const data_6 = fs.readFileSync('plugins/gamehag.js', 'utf-8')
  const data_7 = fs.readFileSync('plugins/prys.js', 'utf-8')
  const data_8 = fs.readFileSync('plugins/indiedb.js', 'utf-8')
  const data_9 = fs.readFileSync('plugins/opiumpulses.js', 'utf-8')
  const data_10 = fs.readFileSync('plugins/givekey.js', 'utf-8')
  const data_11 = fs.readFileSync('plugins/chubkeys.js', 'utf-8')
  const data_12 = fs.readFileSync('plugins/freegamelottery.js', 'utf-8')
  const data_13 = fs.readFileSync('plugins/gleam.js', 'utf-8')
  const data_14 = fs.readFileSync('plugins/spoune.js', 'utf-8')
  const data_15 = fs.readFileSync('plugins/takekey.js', 'utf-8')

  const loadSetting = fs.readFileSync('plugins/loadSetting.js', 'utf-8')
  const loadAnnouncement = fs.readFileSync('plugins/loadAnnouncement.js', 'utf-8')
  const main = fs.readFileSync('main.js', 'utf-8')

  const data = `
${header}

${data_1}

${data_2}

${data_3}

${data_4}

${data_5}

${data_6}

${data_7}

${data_8}

${data_9}

${data_10}

${data_11}

${data_12}

${data_13}

${data_14}

${data_15}

${loadSetting}

${loadAnnouncement}

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