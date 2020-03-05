const givekey = {
    fuck: function (btnArea) {
        let transBtn = $(".yt-button__icon.yt-button__icon_type_right");
        if (transBtn.css("background-position") === "-68px 0px") {
            transBtn[0].click();
        }
        if (!$("#btngo").text().includes("Получить ключ")) {
            fuc.echoLog({ type: "custom", text: `<li><font class="error">${getI18n("changeLanguage")}</font></li>` });
        } else {
            givekey.wssApp.message = btnArea.$message({ message: getI18n("connectWss"), duration: 0 });
            $(() => givekey.wssApp.init(btnArea));
            fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n("connectWssWait")}</font></li>` });
            fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n("beforeFuck")}</font></li>` });
        }
    },
    analyze_tasks: function (tasks) {
        let status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n("processTasksUrl")}<font></font></li>` });
        let pro = [];
        this.groups = [];
        this.wGames = [];
        this.fGames = [];
        this.links = [];
        let taskInfoHistory = GM_getValue('taskInfo[' + location.host + this.get_giveawayId() + ']');
        if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory;
        for (let id of tasks) {
            let task = $("#task_" + id);
            let href = task.attr("href");
            if (href.includes("vk.com")) {
            } else if (href.includes("steamcommunity.com/groups")) {
                this.groups.push(href.match(/groups\/(.+)/)[1]);
                this.taskInfo.groups.push(href.match(/groups\/(.+)/)[1]);
            } else if (task.text().includes("加入愿望单")) {
                pro.push(new Promise(r => {
                    new Promise(resolve => {
                        fuc.getFinalUrl(resolve, href);
                    }).then(data => {
                        if (data.result === "success") {
                            let appId = data.finalUrl.match(/app\/([\d]+)/);
                            if (appId) {
                                this.wGames.push(appId[1]);
                                this.taskInfo.wGames.push(appId[1]);
                                r(1);
                            } else {
                                r(0);
                            }
                        } else {
                            r(0);
                        }
                    });
                }));
            } else if (task.text().includes("关注开发商")) {
                pro.push(new Promise(r => {
                    new Promise(resolve => {
                        fuc.getFinalUrl(resolve, href);
                    }).then(data => {
                        if (data.result === "success") {
                            let appId = data.finalUrl.match(/app\/([\d]+)/);
                            if (appId) {
                                this.wGames.push(appId[1]);
                                this.taskInfo.wGames.push(appId[1]);
                                r(1);
                            } else {
                                r(0);
                            }
                        } else {
                            r(0);
                        }
                    });
                }));
            } else if (href.includes("store.steampowered.com/app")) {
                this.fGames.push(href.match(/app\/([\d]+)/)[1]);
                this.taskInfo.fGames.push(href.match(/app\/([\d]+)/)[1]);
            } else {
                this.links.push(href);
            }
        }
        Promise.all(pro).finally(() => {
            this.groups = fuc.unique(this.groups);
            this.wGames = fuc.unique(this.wGames);
            this.fGames = fuc.unique(this.fGames);
            this.links = fuc.unique(this.links);
            this.taskInfo.groups = fuc.unique(this.taskInfo.groups);
            this.taskInfo.fGames = fuc.unique(this.taskInfo.fGames);
            this.taskInfo.wGames = fuc.unique(this.taskInfo.wGames);
            if (this.groups.length > 0 || this.fGames.length > 0 || this.links.length > 0 || this.wGames.length > 0) {
                this.do_task();
            } else {
                fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n("noAutoFinish")}</font></li>` });
            }
            GM_setValue('taskInfo[' + location.host + this.get_giveawayId() + ']', this.taskInfo);
            status.success();
            if (debug) console.log(this);
        });
    },
    get_tasks: function () {
        let taskInfoHistory = GM_getValue('taskInfo[' + location.host + this.get_giveawayId() + ']');
        if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) {
            this.taskInfo = taskInfoHistory;
            this.remove(true);
        } else {
            let pro = [];
            let status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n("getTasksInfo")}<font></font></li>` });

            let tasksContainer = $("a[id^=task_]");
            for (let task of tasksContainer) {//遍历任务信息
                let href = task.attr("href");
                if (href.includes("vk.com")) {
                } else if (href.includes("steamcommunity.com/groups/")) {
                    this.taskInfo.groups.push(href.match(/groups\/(.+)/)[1]);
                } else if ($(task).text().includes("加入愿望单")) {
                    pro.push(new Promise(r => {
                        new Promise(resolve => {
                            fuc.getFinalUrl(resolve, href);
                        }).then(data => {
                            if (data.result === "success") {
                                let appId = data.finalUrl.match(/app\/([\d]+)/);
                                if (appId) {
                                    this.wGames.push(appId[1]);
                                    this.taskInfo.wGames.push(appId[1]);
                                    r(1);
                                } else {
                                    r(0);
                                }
                            } else {
                                r(0);
                            }
                        });
                    }));
                } else if (href.includes("store.steampowered.com/app/")) {
                    this.taskInfo.fGames.push(href.match(/app\/([\d]+)/)[1]);
                }
            }
            Promise.all(pro).finally(() => {
                this.taskInfo.groups = fuc.unique(this.taskInfo.groups);
                this.taskInfo.curators = fuc.unique(this.taskInfo.curators);
                this.taskInfo.wGames = fuc.unique(this.taskInfo.wGames);
                GM_setValue('taskInfo[' + location.host + this.get_giveawayId() + ']', this.taskInfo);
                status.success();
                if (debug) console.log(this);
                if (this.taskInfo.groups.length > 0 || this.taskInfo.curators.length > 0 || this.taskInfo.wGames.length > 0) {
                    this.remove(true);
                } else {
                    fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n("cannotRemove")}</font></li>` });
                }
            });
        }
    },
    do_task: function () {
        this.updateSteamInfo(() => {
            let pro = [];
            let groups = fuc.unique(this.groups);
            let fGames = fuc.unique(this.fGames);
            let wGames = fuc.unique(this.wGames);
            let curators = fuc.unique(this.curators);
            let links = fuc.unique(this.links);
            if (this.conf.fuck.group) {
                for (let group of groups) {
                    pro.push(new Promise((resolve) => {
                        fuc.joinSteamGroup(resolve, group);
                    }));
                }
            }
            if (this.conf.fuck.wishlist) {
                for (let game of wGames) {
                    pro.push(new Promise(resolve => {
                        fuc.addWishlist(resolve, game);
                    }));
                }
            }
            if (this.conf.fuck.followGame) {
                for (let game of fGames) {
                    pro.push(new Promise((resolve) => {
                        fuc.followGame(resolve, game);
                    }));
                }
            }
            if (this.conf.fuck.curator) {
                for (let curator of curators) {
                    pro.push(new Promise((resolve) => {
                        fuc.followCurator(resolve, curator);
                    }));
                }
            }
            if (this.conf.fuck.visit) {
                for (let link of links) {
                    pro.push(new Promise((resolve) => {
                        fuc.visitLink(resolve, link);
                    }));
                }
            }
            Promise.all(pro).finally(resolve => {
                fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n("allTasksComplete")}</font></li>` });
            });
        });
    },
    verify: function () {
        givekey.wssApp.status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n("getTaskStatus")}<font></font></li>` });
        givekey.wssApp.request('/distribution/check', 'post', { id: location.href.match(/[\d]+/)[0], g_captcha: $('[name="g-recaptcha-response"]').val() });
    },
    remove: function (remove = false) {
        let pro = [];
        if (remove) {
            this.updateSteamInfo(() => {
                if (this.conf.remove.group) {
                    for (let group of fuc.unique(this.taskInfo.groups)) {
                        pro.push(new Promise((resolve) => {
                            fuc.leaveSteamGroup(resolve, group);
                        }));
                    }
                }
                if (this.conf.remove.unfollowGame) {
                    for (let game of fuc.unique(this.taskInfo.fGames)) {
                        pro.push(new Promise((resolve) => {
                            fuc.unfollowCurator(resolve, game);
                        }));
                    }
                }
                if (this.conf.remove.wishlist) {
                    for (let game of fuc.unique(this.taskInfo.wGames)) {
                        pro.push(new Promise((resolve) => {
                            fuc.removeWishlist(resolve, game);
                        }));
                    }
                }
                if (this.conf.remove.curator) {
                    for (let curator of fuc.unique(this.taskInfo.curators)) {
                        pro.push(new Promise((resolve) => {
                            fuc.unfollowCurator(resolve, curator);
                        }));
                    }
                }
                Promise.all(pro).finally(data => {
                    fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n("allTasksComplete")}</font></li>` });
                });
            });
        } else {
            this.get_tasks('remove');
        }
    },
    creat_app: function () {
        this.wssApp = {
            status: {},
            message: {},
            loading: false,
            centrifuge: new Centrifuge(/givekey.ru/.test(location.href) ? 'wss://app.givekey.ru/connection/websocket' : 'wss://app.gkey.fun/connection/websocket'),
            uid: $('meta[name="uid"]').attr("content"),
            init: function (m) {
                this.centrifuge.setToken($('meta[name="cent_token"]').attr("content")), this.centrifuge.connect(), this.centrifuge.on("connect", function (e) {
                    if (debug) console.log(getI18n("wssConnected"));
                    $("#verify-task").removeClass("is-disabled").removeAttr("disabled");
                    givekey.wssApp.message.close();
                    m.$message({ message: getI18n("wssConnectSuccess"), type: "success" });
                    for (let a of $('a[id^=task_]')) {
                        $(a).html($(a).html().replace("Посмотреть обзор на игру", "查看游戏评论")
                            .replace("Подписаться на разработчика", "订阅开发商")
                            .replace("Подписаться на куратора", "订阅鉴赏家")
                            .replace("Поставить лайк", "点赞")
                            .replace("Подписаться на игру", "关注游戏")
                            .replace(/Subscribe|Подписаться/, "订阅/加组")
                            .replace("Сделать репост", "转发")
                            .replace("Добавить в список желаемого", "加入愿望单")
                            .replace("Сделать обзор на игру", "评论")
                            .replace("Посетить web-сайт", "访问页面")
                        );
                    }
                }), this.centrifuge.on("disconnect", function (e) {
                    if (debug) console.log(`${getI18n("wssDisconnected")}\n${e.reason}`);
                    $("#verify-task").addClass("is-disabled").attr("disabled", "disabled");
                    givekey.wssApp.message = m.$message({ message: getI18n("wssReconnect"), type: "warning", duration: 0 });
                });
                if (this.uid) this.centrifuge.subscribe(`usr#${this.uid}`, (data) => {
                    if (debug) console.log(data);
                    givekey.wssApp.status.success();
                    if (data.data.js) {
                        let taskA = data.data.js.split(";");
                        if (taskA) {
                            let tasks = [];
                            taskA.map((e) => {
                                if (e.includes("btn-danger")) tasks.push(e.match(/[\d]+/)[0]);
                            });
                            givekey.analyze_tasks(tasks);
                        }
                    }
                });
            },
            request: (url, type, data, page) => {
                if (url) {
                    if (data || (data = {}), type || (type = "post"), "get" == type.toLowerCase()) {
                        if (givekey.wssApp.loading)
                            return;
                        givekey.wssApp.loading = !0;
                    }
                    $.ajax({
                        url: url,
                        type: type,
                        data: data,
                        headers: {
                            "x-csrf-token": $('meta[name="csrf-token"]').attr("content")
                        },
                        success: function (data) {
                            if (debug) console.log(data);
                            if (data.msg && !data.msg.data.includes("Проверяем! Пожалуйста подождите")) givekey.wssApp.status.error(data.msg.data.replace("Вы уже участвовали в этой раздаче!", "你已经参与了此赠key!"));
                        },
                        error: function (e) {
                            if (debug) console.log(e);
                            switch (e.status) {
                                case 401:
                                    givekey.wssApp.status.error(getI18n("noLogin"));
                                    break;
                                case 403:
                                    givekey.wssApp.status.error(getI18n("accessDenied"));
                                    break;
                                case 404:
                                    givekey.wssApp.status.error(getI18n("notFound"));
                                    break;
                                case 500:
                                    givekey.wssApp.status.error(getI18n("serverError"));
                                    break;
                                case 503:
                                    givekey.wssApp.status.error(getI18n("errorRefresh"));
                                    break;
                                default:
                                    givekey.wssApp.status.error("Error:" + e.status);
                                    break;
                            }
                            givekey.wssApp.loading = !1;
                        }
                    });
                }
            }
        };
    },
    get_giveawayId: function () {
        let id = location.href.match(/distribution\/([\d]+)/);
        if (id) {
            return id[1];
        } else {
            return location.href;
        }
    },
    updateSteamInfo: function (callback) {
        new Promise(resolve => {
            if (this.taskInfo.groups.length > 0) {
                if (this.taskInfo.curators.length > 0 || this.taskInfo.fGames.length > 0 || this.taskInfo.wGames.length > 0) {
                    fuc.updateSteamInfo(resolve, "all");
                } else {
                    fuc.updateSteamInfo(resolve, "community");
                }
            } else if (this.taskInfo.curators.length > 0 || this.taskInfo.fGames.length > 0 || this.taskInfo.wGames.length > 0) {
                fuc.updateSteamInfo(resolve, "store");
            } else {
                resolve(1);
            }
        }).then(s => {
            if (s === 1) {
                callback();
            }
        });
    },
    checkLogin: function () {
        if ($("a[href='/auth']").length > 0) window.open("/auth/vk", "_self");
    },
    checkLeft: function (ui) {
        if ($("#keys_count").text() === "0") {
            ui.$confirm(getI18n("noKeysLeft"), getI18n("notice"), {
                confirmButtonText: getI18n("confirm"),
                cancelButtonText: getI18n("cancel"),
                type: 'warning',
                center: true
            }).then(() => {
                window.close();
            });
        }
    },
    groups: [],//任务需要加的组
    curators: [],//任务需要关注的鉴赏家
    fGames: [],//任务需要关注的游戏
    wGames: [],//任务需要加愿望单的游戏
    links: [],//需要浏览的页面链接
    taskInfo: {
        groups: [],//所有任务需要加的组
        curators: [],//所有任务需要关注的鉴赏家
        fGames: [],//所有任务需要关注的游戏
        wGames: [],//所有任务需要加愿望单的游戏
    },
    tasks: [],//任务信息
    setting: {
        'fuck': true,
        'fuckText': 'Init',
        'fuckTitle': getI18n("initFirst"),
        'verify': true,
        'verifyText': 'Fuck',
        'verifyTitle': getI18n("initPlease"),
        'join': false,
        'remove': true
    },
    conf: GM_getValue('conf') ? ((GM_getValue('conf').givekey && GM_getValue('conf').givekey.load) ? GM_getValue('conf').givekey : (GM_getValue('conf').global || defaultConf)) : defaultConf
};