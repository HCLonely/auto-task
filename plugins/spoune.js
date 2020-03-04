const spoune = {
    fuck: function () {
        this.get_tasks();
    },
    get_tasks: function () {
        let status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n("getTasksInfo")}<font></font></li>` });
        let giveawayTasks = $("#GiveawayTasks button");
        for (let task of giveawayTasks) {
            let taskClick = $(task).attr("onclick");
            if (taskClick) {
                let taskId = taskClick.match(/loadTask\(([\d]+)/);
                if (taskId) {
                    this.tasks.push({ id: taskId[1], text: $(task).text() });
                } else {
                    fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n("getTaskIdFailed", $(task).text())}</font></li>` });
                }
            } else {
                fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n("getTaskIdFailed", $(task).text())}</font></li>` });
            }
        }
        status.warning("Complete");
        if (this.tasks.length > 0) {
            this.do_task();
        } else {
            fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n("noAutoFinish")}</font></li>` });
        }

    },
    do_task: function () {
        fuc.forOrder({ arr: fuc.unique(this.tasks), i: 0, callback: spoune.verify, complete: true });
    },
    verify: function ({ arr, i, end }) {
        if (end) {
            fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n("allTasksComplete")}</font>，<font class="warning">${getI18n("finishSelf")}</font></li>` });
        } else {
            let task = arr[i];
            let status = fuc.echoLog({ type: "custom", text: `<li>${getI18n("doing")}${task.text}...<font></font></li>` });
            new Promise(resolve => {
                fuc.httpRequest({
                    url: `/controller.php?taskDetail=${task.id}&show`,
                    method: "get",
                    onload: response => {
                        if (debug) console.log(response);
                        if (response.status === 200) {
                            let src = response.responseText.match(/src="\.([\w\W]*?)">/);
                            if (src) {
                                fuc.httpRequest({
                                    url: src[1],
                                    method: "get",
                                    onload: response => {
                                        if (debug) console.log(response);
                                        if (response.status === 200) {
                                            let href = response.responseText.match(/href="\.(\/verify[\w\W]*?)"/) || response.responseText.match(/href="\.(\/steamgroup[\w\W]*?)"/);
                                            if (href) {
                                                fuc.httpRequest({
                                                    url: "/werbung" + href[1],
                                                    method: "get",
                                                    onload: response => {
                                                        if (debug) console.log(response);
                                                        if (response.status === 200 && /Task.*completed/gim.test(response.responseText)) {
                                                            status.success();
                                                            resolve(1);
                                                        } else {
                                                            let href = response.responseText.match(/href="\.(\/verify[\w\W]*?)"/) || response.responseText.match(/href="\.(\/steamgroup[\w\W]*?)"/);
                                                            if (href) {
                                                                fuc.httpRequest({
                                                                    url: "/werbung" + href[1],
                                                                    method: "get",
                                                                    onload: response => {
                                                                        if (debug) console.log(response);
                                                                        if (response.status === 200 && /Task.*completed/gim.test(response.responseText)) {
                                                                            status.success();
                                                                        } else {
                                                                            status.error("Error:" + (response.statusText || response.status));
                                                                        }
                                                                        resolve(1);
                                                                    },
                                                                    r: resolve,
                                                                    status
                                                                });
                                                            } else {
                                                                status.error("Error:" + (response.statusText || response.status));
                                                                resolve(0);
                                                            }
                                                        }
                                                    },
                                                    r: resolve,
                                                    status
                                                });
                                            } else {
                                                status.error("Error:" + getI18n("getUrlFailed", "2"));
                                                resolve(0);
                                            }
                                        } else {
                                            status.error("Error:" + (response.statusText || response.status));
                                            resolve(0);
                                        }
                                    },
                                    r: resolve,
                                    status
                                });
                            } else {
                                status.error("Error:" + getI18n("getUrlFailed", "1"));
                                resolve(0);
                            }
                        } else {
                            status.error("Error:" + (response.statusText || response.status));
                            resolve(0);
                        }
                    },
                    r: resolve,
                    status
                });
            }).finally(() => {
                fuc.forOrder({ arr, i: ++i, callback: spoune.verify, complete: true });
            });
        }
    },
    remove: function () { },
    checkLogin: function () { },
    checkLeft: function (ui) {
        let checkLeft = setInterval(() => {
            if ($("#keysAvailable").length > 0) {
                clearInterval(checkLeft);
                if ($("#keysAvailable").text() === '0') {
                    ui.$confirm(getI18n("noKeysLeft"), getI18n("notice"), {
                        confirmButtonText: getI18n("confirm"),
                        cancelButtonText: getI18n("cancel"),
                        type: 'warning',
                        center: true
                    }).then(() => {
                        window.close();
                    });
                }
            }
        }, 500);
    },
    tasks: [],//任务信息
    setting: {
        'fuck': true,
        'verify': false,
        'join': false,
        'remove': false
    },
    conf: GM_getValue('conf') ? ((GM_getValue('conf').spoune && GM_getValue('conf').spoune.load) ? GM_getValue('conf').spoune : (GM_getValue('conf').global || defaultConf)) : defaultConf
};