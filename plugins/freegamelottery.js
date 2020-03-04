const freegamelottery = {
    fuck: function (vue) {
        GM_setValue("lottery", 1);
        if ($("a.registration-button").length > 0) {
            if (this.conf.fuck.autoLogin) {
                let userInfo = GM_getValue('conf').lotteryUserInfo;
                if (userInfo) {
                    let status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n("logining")}<font></font></li>` });
                    fuc.httpRequest({
                        url: "https://freegamelottery.com/user/login",
                        method: "POST",
                        data: `username=${userInfo.username}&password=${userInfo.password}&rememberMe=1`,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        onload: function (data) {
                            if (data.status === 200) {
                                status.success();
                                window.location.reload(true);
                            } else {
                                status.error("Error:" + (data.statusText || data.status));
                            }
                        },
                        status
                    });
                } else {
                    vue.$message({ type: 'warning', message: getI18n("needLogin") });
                    $("a.registration-button")[0].click();
                    $("button[value=Login]").click(() => {
                        let conf = GM_getValue('conf');
                        conf.lotteryUserInfo = { username: $("#modal_login").val(), password: $("#modal_password").val() };
                        GM_setValue("conf", conf);
                    });
                }
            } else {
                vue.$message({ type: 'warning', message: getI18n("needLogin") });
                $("a.registration-button")[0].click();
            }
        } else {
            this.draw();
        }
    },
    draw: function () {
        GM_setValue("lottery", 0);
        if (this.conf.fuck.doTask) {
            let main = fuc.echoLog({ type: 'custom', text: `<li>${getI18n("fglTimeout", "Visit MAIN DRAW")}<font></font></li>` });
            $.post('/draw/register-visit', { drawId: DashboardApp.draws.main.actual.id })
                .done(function () {
                    DashboardApp.draws.main.actual.haveVisited = true;
                    main.success();
                    let survey = fuc.echoLog({ type: 'custom', text: `<li>${getI18n("fglTimeout", "Visit SURVEY DRAW")}<font></font></li>` });
                    $.post('/draw/register-visit', { type: 'survey', drawId: DashboardApp.draws.survey.actual.id })
                        .done(function () {
                            DashboardApp.draws.survey.actual.haveVisited = 1;
                            survey.success();
                            let video = fuc.echoLog({ type: 'custom', text: `<li>${getI18n("fglTimeout", "Visit VIDEO DRAW")}<font></font></li>` });
                            $.post('/draw/register-visit', { drawId: DashboardApp.draws.video.actual.id })
                                .done(function () {
                                    DashboardApp.draws.video.actual.haveVisited = true;
                                    video.success();
                                    let stackpot = fuc.echoLog({ type: 'custom', text: `<li>${getI18n("fglTimeout", "Visit STACKPOT")}<font></font></li>` });
                                    $.post('/draw/register-visit', { type: 'stackpot', drawId: DashboardApp.draws.stackpot.actual.id })
                                        .done(function () {
                                            DashboardApp.draws.stackpot.actual.haveVisited = 1;
                                            stackpot.success();
                                            fuc.echoLog({ type: 'custom', text: `<li>${getI18n("fglComplete")}<font></font></li>` });
                                            location.href = '/#/draw/stackpot';
                                            window.location.reload(true);
                                        });
                                });
                        });
                });
        }
    },
    verify: function () { },
    remove: function () { },
    checkLogin: function () { },
    checkLeft: function (ui) { },
    setting: {
        'fuck': true,
        'verify': false,
        'join': false,
        'remove': false
    },
    conf: GM_getValue('conf') ? ((GM_getValue('conf').freegamelottery && GM_getValue('conf').freegamelottery.load) ? GM_getValue('conf').freegamelottery : (GM_getValue('conf').global || defaultConf)) : defaultConf
};