const opiumpulses = {
    fuck: function () {
        this.get_tasks('FREE');
    },
    get_tasks: function (type = 'FREE') {
        let items = $(`.giveaways-page-item:contains('${type}'):not(:contains('ENTERED'))`);
        let myPoint = this.myPoints;
        let maxPoint = this.maxPoint();
        let option = {
            arr: items,
            time: 100,
            i: 0,
            callback: ({ arr, i, end }) => {
                if (end) {
                    fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n("joinLotteryComplete")}</font></li>` });
                } else {
                    let item = arr[i];
                    let needPoints = $(item).find(".giveaways-page-item-header-points").text().match(/[\d]+/gim);
                    if (type === "points" && needPoints && parseInt(needPoints[0]) > myPoint) {
                        fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n("noPoints")}</font></li>` });
                    } else if (type === "points" && !needPoints) {
                        fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n("getNeedPointsFailed")}</font></li>` });
                    } else {
                        if (type === "points" && parseInt(needPoints[0]) > maxPoint) {
                            i++;
                            option.i = i;
                            fuc.forOrder(option);
                        } else {
                            let status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n("joinLottery")}<a href="${$(item).find("a.giveaways-page-item-img-btn-more").attr("href")}" target="_blank">${$(item).find(".giveaways-page-item-footer-name").text().trim()}</a>...<font></font></li>` });
                            let a = $(item).find("a.giveaways-page-item-img-btn-enter:contains('enter')");
                            if (a.attr("onclick") && a.attr("onclick").includes('checkUser')) {
                                let giveawayId = a.attr("onclick").match(/[\d]+/);
                                if (giveawayId) {
                                    checkUser(giveawayId[0]);
                                }
                            }
                            new Promise(r => {
                                fuc.httpRequest({
                                    url: a.attr('href'),
                                    method: 'GET',
                                    onload: response => {
                                        if (debug) console.log(response);
                                        if (response.responseText && /You've entered this giveaway/gim.test(response.responseText)) {
                                            status.success();
                                            let points = response.responseText.match(/Points:[\s]*?([\d]+)/);
                                            if (type === "points" && points) {
                                                if (debug) console.log(getI18n("pointsLeft") + points[1]);
                                                opiumpulses.myPoints = parseInt(points[1]);
                                            }
                                        } else {
                                            status.error('Success:' + (response.status || response.statusText));
                                        }
                                        r(1);
                                    },
                                    status,
                                    r
                                });
                            }).then(data => {
                                i++;
                                option.i = i;
                                fuc.forOrder(option);
                            });
                        }
                    }
                }
            },
            complete: true
        };
        fuc.forOrder(option);
    },
    verify: function () {
        let myPoints = $(".page-header__nav-func-user-nav-items.points-items").text().match(/[\d]+/gim);
        if (myPoints) {
            this.myPoints = myPoints;
            this.get_tasks('points');
        } else {
            fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n("getPointsFailed")}</font></li>` });
        }
    },
    remove: function () { },
    checkLogin: function () { },
    checkLeft: function (ui) { },
    myPoints: 0,
    setting: {
        'fuck': true,
        'fuckText': 'Free',
        'fuckTitle': getI18n("joinFreeLottery"),
        'verify': true,
        'verifyText': 'Point',
        'verifyTitle': getI18n("joinPointLottery"),
        'join': false,
        'remove': false
    },
    conf: GM_getValue('conf') ? ((GM_getValue('conf').opiumpulses && GM_getValue('conf').opiumpulses.load) ? GM_getValue('conf').opiumpulses : (GM_getValue('conf').global || defaultConf)) : defaultConf,
    maxPoint: function () {
        return this.conf["max-point"] || Infinity;
    }
};