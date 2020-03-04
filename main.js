if (window.location.host.includes('hclonely')) {
    if (window.location.pathname.includes('setting')) {
        fuc.addBackground();
        loadSetting();
    } else if (window.location.pathname.includes('announcement')) {
        fuc.addBackground();
        loadAnnouncement();
    }
} else if ((window.location.host.includes('marvelousga') || window.location.host.includes('dupedornot') || window.location.host.includes('gamecode.win')) && (!window.location.pathname.includes('giveaway'))) {
    fuc.newTabBlock();
} else {
    let website = {};
    if (window.location.host.includes('giveaway.su')) {
        website = giveawaysu;
    } else if (window.location.host.includes('marvelousga') || window.location.host.includes('dupedornot')) {
        fuc.newTabBlock();
        website = marvelousga;
    } else if (window.location.host.includes('grabfreegame') || window.location.host.includes('bananagiveaway')) {
        website = banana;
    } else if (window.location.host.includes('gamecode.win')) {
        fuc.newTabBlock();
        website = gamecode;
    } else if (window.location.host.includes('gamehag')) {
        $("#getkey").removeAttr("disabled");
        if (globalConf.other.reCaptcha) $("body").append(`<script>window.bannedCountries = ["en"];window.geo ="en";window.respCaptch="";</script>`);

        website = gamehag;
    } else if (window.location.host.includes('prys.revadike')) {
        website = prys;
    } else if (window.location.host.includes('indiedb')) {
        website = indiedb;
    } else if (window.location.host.includes('opiumpulses')) {
        website = opiumpulses;
    } else if (window.location.host.includes('gkey') || window.location.host.includes('givekey')) {
        website = givekey;
        let init = setInterval(() => {
            try {
                if (Centrifuge) {
                    clearInterval(init);
                    website.creat_app();
                }
            } catch (e) { }
        }, 500);
    } else if (window.location.host.includes('chubkeys') || window.location.host.includes('giveawayhopper')) {
        website = chubkeys;
    } else if (window.location.host.includes('freegamelottery')) {
        website = freegamelottery;
    } else if (window.location.host.includes('gleam.io')) {
        website = gleam;
    } else if (window.location.host.includes('spoune')) {
        website = spoune;
    } else if (window.location.host.includes('takekey')) {
        website = takekey;
    }

    if (globalConf.other.checkLogin) {
        website.checkLogin();
    }
    if (globalConf.other.checkLeft) {
        website.checkLeft(vueUi);
    }

    $('body').append(`
<div id="fuck-task-app">
  <div v-cloak id="fuck-task-btn">
  <el-button :style="style" @click="toggleThisDiv" :icon="icon" :title="title" :show="show"></el-button>
    <el-button type="primary" v-for="item in buttons" v-if="item.show" @click="item.click" :id="item.id" :title="item.title">{{item.text}}</el-button>
    <el-button type="primary" @click="toggle" :id="drawerBtn.id" :title="drawerBtn.title">{{drawerBtn.text}}</el-button>
  </div>
  <div id="fuck-task-info"></div>
</div>
`);
    let showLogs = globalConf.other ? globalConf.other.showLogs : defaultConf.other.showLogs;

    let btnNum = 1;
    for (let boolean of Object.values(website.setting)) {
        if (boolean === true) btnNum++;
    }

    let btnArea = new Vue({
        el: '#fuck-task-btn',
        data: {
            icon: "el-icon-arrow-right",
            title: getI18n("hide"),
            show: true,
            style: `position:absolute;left:-20px;width:20px;border:0px;border-top-right-radius:0px;border-bottom-right-radius:0px;padding:0;height:${btnNum * 40}px;opacity:80%;`,
            buttons: [
                {
                    id: 'fuck-task',
                    text: website.setting.fuckText || 'FuckTask',
                    title: website.setting.fuckTitle || getI18n("fuckBtnTitle"),
                    show: website.setting.fuck,
                    click: () => {
                        website.fuck(btnArea);
                    }
                },
                {
                    id: 'verify-task',
                    text: website.setting.verifyText || 'Verify',
                    title: website.setting.verifyTitle || getI18n("verifyBtnTitle"),
                    show: website.setting.verify,
                    click: () => {
                        website.verify();
                    }
                },
                {
                    id: 'join-task',
                    text: website.setting.joinText || 'Join',
                    title: website.setting.joinDes || getI18n("joinBtnTitle"),
                    show: website.setting.join,
                    click: () => {
                        website.join();
                    }
                },
                {
                    id: 'remove-task',
                    text: website.setting.removeText || 'Remove',
                    title: website.setting.removeTitle || getI18n("removeBtnTitle"),
                    show: website.setting.remove,
                    click: () => {
                        website.remove();
                    }
                }
            ],
            drawerBtn: {
                id: 'show-logs',
                text: !showLogs ? 'ShowLogs' : 'HideLogs',
                title: !showLogs ? getI18n("showLog") : getI18n("hideLog"),
                show: !!showLogs
            },
        },
        methods: {
            toggleThisDiv() {
                if (this.show) {
                    this.icon = "el-icon-arrow-left";
                    this.title = getI18n("show");
                    $("#fuck-task-btn").animate({
                        width: '0',
                    });
                } else {
                    this.icon = "el-icon-arrow-right";
                    this.title = getI18n("hide");
                    $("#fuck-task-btn").animate({
                        width: '110',
                    });
                }
                this.show = !this.show;
            },
            toggle() {
                if (this.drawerBtn.show) {
                    this.drawerBtn.text = 'ShowLogs';
                    this.drawerBtn.title = getI18n("showLog");
                    $(".fuck-task-logs").animate({
                        right: '-100%'
                    }, 'fast');
                } else {
                    this.drawerBtn.text = 'HideLogs';
                    this.drawerBtn.title = getI18n("hideLog");
                    $(".fuck-task-logs").animate({
                        right: '16px'
                    }, 'fast');
                }
                this.drawerBtn.show = !this.drawerBtn.show;
            }
        }
    });
    new Vue({
        el: '#fuck-task-info',
    }).$notify({
        title: getI18n("taskLog"),
        iconClass: '',
        duration: 0,
        position: 'bottom-right',
        showClose: false,
        customClass: 'fuck-task-logs',
        dangerouslyUseHTMLString: true,
        message: ''
    });
    $(".fuck-task-logs .el-notification__title").before(`
<h2 v-cloak id="extraBtn" class="el-notification__title">
<el-badge is-dot class="item" :hidden="hidden">
  <el-button :icon="icon" :title="title" @click="checkUpdate" circle></el-button>
</el-badge>
<el-badge is-dot class="item" :hidden="settingHidden">
  <el-button icon="el-icon-setting" title="${getI18n("setting")}" @click="setting" circle></el-button>
</el-badge>
<el-badge is-dot class="item" :hidden="announcementHidden">
  <el-button :icon="announcementIcon" title="${getI18n("visitUpdateText")}" @click="updateText" circle></el-button>
</el-badge>
<el-badge is-dot class="item" :hidden="otherHidden">
  <el-button icon="el-icon-brush" title="${getI18n("cleanCache")}" @click="clearTemp" circle></el-button>
</el-badge>
<el-badge is-dot class="item" :hidden="otherHidden">
  <el-button icon="el-icon-s-promotion" title="${getI18n("feedback")}" @click="updateBug" circle></el-button>
</el-badge>
</h2>
`);
    let extraBtn = new Vue({
        el: "#extraBtn",
        data: {
            title: getI18n("checkUpdate"),
            icon: "el-icon-refresh",
            hidden: true,
            settingHidden: !!GM_getValue('conf'),
            otherHidden: true,
            announcementHidden: true,
            announcementIcon: "el-icon-document"
        },
        methods: {
            setting() {
                window.open("https://blog.hclonely.com/auto-task/setting.html", "_blank");
            },
            updateText() {
                fuc.getAnnouncement(this);
            },
            updateBug() {
                window.open("https://github.com/HCLonely/auto-task/issues/new/choose", "_blank");
            },
            checkUpdate() {
                fuc.checkUpdate(this, true);
            },
            clearTemp() {
                let status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n("cleaning")}<font></font></li>` });
                let listValues = GM_listValues();
                for (let value of listValues) {
                    if (value !== "conf" && value !== "language") GM_deleteValue(value);
                }
                status.success();
            }
        }
    });
    if (globalConf.other.checkUpdate) {
        fuc.checkUpdate(extraBtn);
    }

    $('.fuck-task-logs .el-notification__content').show();
    if (!showLogs) {
        $(".fuck-task-logs").animate({
            right: '-100%',
            display: '-webkit-box',
            display: '-ms-flexbox',
            display: 'flex',
        }, 0);
    }
    if (window.location.host.includes('gkey') || window.location.host.includes('givekey')) {
        $("#verify-task").addClass("is-disabled").attr("disabled", "disabled");
    } else if (window.location.host === 'd.freegamelottery.com' && GM_getValue("lottery") === 1) {
        website.draw();
    }
}

GM_registerMenuCommand(getI18n("readme"), () => { window.open('https://blog.hclonely.com/posts/777c60d5/', '_blank'); });
GM_registerMenuCommand(getI18n("updateSteamInfo"), () => {
    new Promise(resolve => {
        fuc.updateSteamInfo(resolve, "all", true);
    }).then(r => {
        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n("updateSteamInfoComplete")}</font></li>` });
    });
});
GM_registerMenuCommand("Language", () => {
    vueUi.$msgbox({
        title: getI18n("language") + " : " + language,
        message: `<select id="auto-task-language"><option value="auto">${getI18n("auto")}</option><option value="zh-cn">简体中文</option><option value="en">English</option></select>`,
        dangerouslyUseHTMLString: true,
        confirmButtonText: getI18n("confirm"),
        cancelButtonText: getI18n("cancel"),
        type: 'info'
    }).then(value => {
        if (value) GM_setValue("language", $("#auto-task-language option:selected").val());
        language = getLanguage();
    }).catch(err => { });
});