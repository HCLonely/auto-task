const prys = {
    fuck: function () {
        this.get_tasks('do_task');
    },
    get_tasks: function (callback = 'do_task') {
        let status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n("getTasksInfo")}<font></font></li>` });
        let steps = $("#steps tbody tr");
        for (let i = 0; i < steps.length; i++) {
            if (steps.eq(i).find("span:contains(Success)").length === 0) checkClick(i);
        }
        if (callback === 'do_task') {
            let taskInfoHistory = GM_getValue('taskInfo[' + location.host + this.get_giveawayId() + ']');
            if (taskInfoHistory && !fuc.isEmptyObjArr(taskInfoHistory)) this.taskInfo = taskInfoHistory;
            this.groups = [];
            this.curators = [];
            let pro = [];
            for (let step of steps) {
                if ($(step).find("span:contains(Success)").length === 0) {
                    if ($(step).find("a[href*='store.steampowered.com/curator/']").length > 0) {
                        let link = $(step).find("a[href*='store.steampowered.com/curator/']").attr('href');
                        let curatorId = link.match(/curator\/([\d]+)/);
                        if (curatorId) {
                            this.curators.push(curatorId[1]);
                            this.taskInfo.curators.push(curatorId[1]);
                        }
                    } else if ($(step).find("a[href*='steampowered.com/groups/']").length > 0) {
                        let link = $(step).find("a[href*='steampowered.com/groups/']").attr('href');
                        let groupName = link.match(/groups\/(.+)\/?/);
                        if (groupName) {
                            this.groups.push(groupName[1]);
                            this.taskInfo.groups.push(groupName[1]);
                        }
                    } else if ($(step).find("a[href*='steamcommunity.com/gid']").length > 0) {
                        let link = $(step).find("a[href*='steamcommunity.com/gid']").attr('href');
                        pro.push(new Promise(r => {
                            new Promise(resolve => {
                                fuc.getFinalUrl(resolve, link);
                            }).then(data => {
                                if (data.result === 'success') {
                                    let groupName = data.finalUrl.match(/groups\/(.+)\/?/);
                                    if (groupName) {
                                        this.groups.push(groupName[1]);
                                        this.taskInfo.groups.push(groupName[1]);
                                    }
                                }
                                r(1);
                            });
                        }));
                    }
                }
            }
            if (pro.length > 0) {
                Promise.all(pro).finally(data => {
                    this.groups = fuc.unique(this.groups);
                    this.curators = fuc.unique(this.curators);
                    this.taskInfo.groups = fuc.unique(this.taskInfo.groups);
                    this.taskInfo.curators = fuc.unique(this.taskInfo.curators);
                    GM_setValue('taskInfo[' + location.host + this.get_giveawayId() + ']', this.taskInfo);
                    if (this.groups.length > 0 || this.curators.length > 0) {
                        this.do_task();
                    } else {
                        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n("allTasksComplete")}</font></li>` });
                        if (this.conf.fuck.verify) this.verify();
                    }
                });
            } else {
                this.groups = fuc.unique(this.groups);
                this.curators = fuc.unique(this.curators);
                this.taskInfo.groups = fuc.unique(this.taskInfo.groups);
                this.taskInfo.curators = fuc.unique(this.taskInfo.curators);
                GM_setValue('taskInfo[' + location.host + this.get_giveawayId() + ']', this.taskInfo);
                if (this.groups.length > 0 || this.curators.length > 0) {
                    this.do_task();
                } else {
                    fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n("allTasksComplete")}</font></li>` });
                    if (this.conf.fuck.verify) this.verify();
                }
            }
        } else if (callback === "verify") {
            this.tasks = [];
            let checks = $("#steps tbody a[id^=check]");
            if (checks.length > 0) {
                for (let check of checks) {
                    let id = $(check).attr('id').match(/[\d]+/);
                    if (id) this.tasks.push({ id: id[0], taskDes: $(check).parent().prev().html().trim() });
                }
                this.verify(true);
            } else {
                fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n("prysAllTasksComplete")}</font></li>` });
            }
        } else if (callback === "remove") {
            let taskInfo = GM_getValue('taskInfo[' + location.host + this.get_giveawayId() + ']');
            if (taskInfo && !fuc.isEmptyObjArr(taskInfo)) {
                this.taskInfo = taskInfo;
                this.remove(true);
            } else {
                let pro = [];
                for (let step of steps) {
                    if ($(step).find("a[href*='store.steampowered.com/curator/']").length > 0) {
                        let link = $(step).find("a[href*='store.steampowered.com/curator/']").attr('href');
                        let curatorId = link.match(/curator\/([\d]+)/);
                        if (curatorId) {
                            this.taskInfo.curators.push(curatorId[1]);
                        }
                    } else if ($(step).find("a[href*='steampowered.com/groups/']").length > 0) {
                        let link = $(step).find("a[href*='steampowered.com/groups/']").attr('href');
                        let groupName = link.match(/groups\/(.+)\/?/);
                        if (groupName) {
                            this.taskInfo.groups.push(groupName[1]);
                        }
                    } else if ($(step).find("a[href*='steamcommunity.com/gid']").length > 0) {
                        let link = $(step).find("a[href*='steamcommunity.com/gid']").attr('href');
                        pro.push(new Promise(r => {
                            new Promise(resolve => {
                                fuc.getFinalUrl(resolve, link);
                            }).then(data => {
                                if (data.result === 'success') {
                                    let groupName = data.finalUrl.match(/groups\/(.+)\/?/);
                                    if (groupName) {
                                        this.taskInfo.groups.push(groupName[1]);
                                    }
                                }
                                r(1);
                            });
                        }));
                    }
                }
                if (pro.length > 0) {
                    Promise.all(pro).finally(data => {
                        this.taskInfo.groups = fuc.unique(this.taskInfo.groups);
                        this.taskInfo.curators = fuc.unique(this.taskInfo.curators);
                        GM_setValue('taskInfo[' + location.host + this.get_giveawayId() + ']', this.taskInfo);
                        if (this.taskInfo.groups.length > 0 || this.taskInfo.curators.length > 0) {
                            this.remove(true);
                        } else {
                            fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n("cannotRemove")}</font></li>` });
                        }
                    });
                } else {
                    this.taskInfo.groups = fuc.unique(this.taskInfo.groups);
                    this.taskInfo.curators = fuc.unique(this.taskInfo.curators);
                    GM_setValue('taskInfo[' + location.host + this.get_giveawayId() + ']', this.taskInfo);
                    if (this.taskInfo.groups.length > 0 || this.taskInfo.curators.length > 0) {
                        this.remove(true);
                    } else {
                        fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n("cannotRemove")}</font></li>` });
                    }
                }
            }
        } else {
            fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n("unknown")}！</font></li>` });
        }
        status.success();
        if (debug) console.log(this);
    },
    do_task: function () {
        this.updateSteamInfo(() => {
            let pro = [];
            let groups = fuc.unique(this.groups);
            let curators = fuc.unique(this.curators);
            if (this.conf.fuck.group) {
                for (let group of groups) {
                    pro.push(new Promise((resolve) => {
                        fuc.joinSteamGroup(resolve, group);
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
            Promise.all(pro).finally(resolve => {
                fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n("allTasksComplete")}</font></li>` });
                if (this.conf.fuck.verify) this.verify();
            });
        });
    },
    verify: function (verify = false) {
        if (verify) {
            let pro = [];
            for (let task of fuc.unique(this.tasks)) {
                let status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n("verifyingTask")}${task.taskDes}...<font></font></li>` });
                pro.push(new Promise((resolve) => {
                    this.checkStep(task.id, resolve, status);
                }));
            }
            Promise.all(pro).finally(resolve => {
                fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n("prysAllTasksComplete")}</font></li>` });
            });
        } else {
            this.get_tasks('verify');
        }
    },
    checkStep: function (step, r, status, captcha) {
        if (!captcha) captcha = null;
        if (step !== "captcha") $("#check" + step).replaceWith('<span id="check' + step +
            '"><i class="fa fa-refresh fa-spin fa-fw"></i> Checking...</span>');
        $.post("/api/check_step", {
            step: step,
            id: getURLParameter("id"),
            "g-recaptcha-response": captcha
        }, function (json) {
            r(1);
            if (json.success && step !== "captcha") {
                $("#check" + step).replaceWith('<span class="text-success" id="check' + step +
                    '"><i class="fa fa-check"></i> Success</span>');
                status.success();
            } else if (step !== "captcha") {
                $("#check" + step).replaceWith('<a id="check' + step + '" href="javascript:checkStep(' + step +
                    ')"><i class="fa fa-question"></i> Check</a>');
                status.error((json.response ? json.response.error ? json.response.error : 'Error' : 'Error'));
            }
            if (json.response) {
                if (json.response.captcha && json.success) {
                    showAlert("info", json.response.captcha);
                    captchaCheck();
                } else if (json.response.captcha) {
                    showAlert("warning", json.response.captcha);
                    captchaCheck();
                }
                if (json.response.prize) {
                    showAlert("success",
                        'Here is your prize:<h1 role="button" align="middle" style="word-wrap: break-word;">' +
                        json.response.prize + '</h2>');
                }
            }
        }).fail(function () {
            r(1);
            $("#check" + step).replaceWith('<a id="check' + step + '" href="javascript:checkStep(' + step +
                ')"><i class="fa fa-question"></i> Check</a>');
            status.error('Error:0');
        });
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
    get_giveawayId: function () {
        let id = location.search.match(/id=([\d]+)/);
        if (id) {
            return id[1];
        } else {
            return location.href;
        }
    },
    updateSteamInfo: function (callback) {
        new Promise(resolve => {
            if (this.taskInfo.groups.length > 0) {
                if (this.taskInfo.curators.length > 0) {
                    fuc.updateSteamInfo(resolve, "all");
                } else {
                    fuc.updateSteamInfo(resolve, "community");
                }
            } else if (this.taskInfo.curators.length > 0) {
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
    checkLogin: function () { },
    checkLeft: function (ui) {
        let left = $("#header").text().match(/([\d]+).*?prize.*?left/);
        if (!(left.length > 0 && left[1] !== "0")) {
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
    taskInfo: {
        groups: [],//所有任务需要加的组
        curators: [],//所有任务需要关注的鉴赏家
    },
    tasks: [],//任务信息
    setting: {
        'fuck': true,
        'verify': true,
        'join': false,
        'remove': true
    },
    conf: GM_getValue('conf') ? ((GM_getValue('conf').prys && GM_getValue('conf').prys.load) ? GM_getValue('conf').prys : (GM_getValue('conf').global || defaultConf)) : defaultConf
};