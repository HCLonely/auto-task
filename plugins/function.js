const steamInfo = GM_getValue('steamInfo') || {
    userName: '',
    steam64Id: '',
    communitySessionID: '',
    storeSessionID: '',
    updateTime: 0
};
const defaultConf = {
    fuck: {
        group: 1,
        curator: 1,
        developer: 1,
        publisher: 1,
        announcement: 1,
        wishlist: 1,
        followGame: 1,
        visit: 1,
        verify: 1
    },
    verify: {
        verify: 1
    },
    join: {
        group: 1,
        curator: 1,
        developer: 1,
        publisher: 1,
        announcement: 1,
        wishlist: 1,
        followGame: 1,
        visit: 1
    },
    remove: {
        group: 1,
        curator: 1,
        developer: 1,
        publisher: 1,
        wishlist: 1,
        followGame: 1
    },
    other: {
        showLogs: 1,
        showDetails: 0,
        checkLogin: 1,
        checkLeft: 1,
        autoOpen: 0,
        reCaptcha: 0
    },
    announcement: ""
};
let globalConf = (GM_getValue('conf') && GM_getValue('conf').global) ? GM_getValue('conf').global : defaultConf;
let debug = !!globalConf.other.showDetails;
const fuc = {
    httpRequest: function (e) {
        let requestObj = {};
        requestObj.url = e.url;
        requestObj.method = e.method.toUpperCase();
        requestObj.timeout = e.timeout || 30000;
        if (e.dataType) requestObj.responseType = e.dataType;
        if (e.headers) requestObj.headers = e.headers;
        if (e.data) requestObj.data = e.data;
        if (e.onload) requestObj.onload = e.onload;
        requestObj.ontimeout = e.ontimeout || function (data) {
            if (debug) console.log(data);
            if (e.status) e.status.error('Error:Timeout(0)');
            if (e.r) e.r({ result: 'error', statusText: 'Timeout', status: 0, option: e });
        };
        requestObj.onabort = e.onabort || function (data) {
            if (debug) console.log(data);
            if (e.status) e.status.error('Error:Aborted(0)');
            if (e.r) e.r({ result: 'error', statusText: 'Aborted', status: 0, option: e });
        };
        requestObj.onerror = e.onerror || function (data) {
            if (debug) console.log(data);
            if (e.status) e.status.error('Error:Error(0)');
            if (e.r) e.r({ result: 'error', statusText: 'Error', status: 0, option: e });
        };
        if (debug) {
            console.log('发送请求:');
            console.log(requestObj);
        }
        GM_xmlhttpRequest(requestObj);
    },
    updateSteamInfo: function (r, type = "all", update = false) {
        if (new Date().getTime() - steamInfo.updateTime > 10 * 60 * 1000 || update) {
            let pro = [];
            if (type === "community" || type === "all") {
                pro.push(new Promise(r => {
                    let status = this.echoLog({ type: 'updateSteamCommunity' });
                    this.httpRequest({
                        url: 'https://steamcommunity.com/my',
                        method: "GET",
                        onload: (response) => {
                            if (debug) console.log(response);
                            if (response.status === 200) {
                                let steam64Id = response.responseText.match(/g_steamID = \"(.+?)\";/);
                                let communitySessionID = response.responseText.match(/g_sessionID = \"(.+?)\";/);
                                let userName = response.responseText.match(/steamcommunity.com\/id\/(.+?)\/friends\//);
                                if (steam64Id) steamInfo.steam64Id = steam64Id[1];
                                if (communitySessionID) steamInfo.communitySessionID = communitySessionID[1];
                                if (userName) steamInfo.userName = userName[1];
                                status.success();
                                r({ result: 'success', statusText: response.statusText, status: response.status });
                            } else {
                                status.error('Error:' + response.statusText + '(' + response.status + ')');
                                r({ result: 'error', statusText: response.statusText, status: response.status });
                            }
                        },
                        r,
                        status
                    });
                }));
            }
            if (type === "store" || type === "all") {
                pro.push(new Promise(r => {
                    let status = this.echoLog({ type: 'updateSteamStore' });

                    this.httpRequest({
                        url: 'https://store.steampowered.com/stats/',
                        method: "GET",
                        onload: (response) => {
                            if (debug) console.log(response);
                            if (response.status === 200) {
                                let storeSessionID = response.responseText.match(/g_sessionID = \"(.+?)\";/);
                                if (storeSessionID) steamInfo.storeSessionID = storeSessionID[1];
                                status.success();
                                r({ result: 'success', statusText: response.statusText, status: response.status });
                            } else {
                                status.error('Error:' + response.statusText + '(' + response.status + ')');
                                r({ result: 'error', statusText: response.statusText, status: response.status });
                            }
                        },
                        r,
                        status
                    });
                }));
            }
            Promise.all(pro).then(data => {
                steamInfo.updateTime = new Date().getTime();
                GM_setValue('steamInfo', steamInfo);
                r(1);
            });
        } else {
            r(1);
        }
    },
    joinSteamGroup: function (r, group) {
        let status = this.echoLog({ type: 'joinSteamGroup', text: group });

        this.httpRequest({
            url: 'https://steamcommunity.com/groups/' + group,
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            data: $.param({ action: "join", sessionID: steamInfo.communitySessionID }),
            onload: (response) => {
                if (debug) console.log(response);
                if (response.status === 200 && !response.responseText.includes('grouppage_join_area')) {
                    status.success();
                    r({ result: 'success', statusText: response.statusText, status: response.status });
                } else {
                    status.error('Error:' + response.statusText + '(' + response.status + ')');
                    r({ result: 'error', statusText: response.statusText, status: response.status });
                }
            },
            r,
            status
        });
    },
    getGroupID: function (groupName, callback) {
        let status = this.echoLog({ type: 'getGroupId', text: groupName });
        let groupNameToId = GM_getValue('groupNameToId') || {};
        if (groupNameToId[groupName]) {
            status.success();
            callback(groupName, groupNameToId[groupName]);
        } else {
            let pro = new Promise(resolve => {
                this.httpRequest({
                    url: "https://steamcommunity.com/groups/" + groupName,
                    method: "GET",
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    onload: function (response) {
                        if (debug) console.log(response);
                        if (response.status === 200) {
                            let groupId = response.responseText.match(/OpenGroupChat\( \'([0-9]+)\'/);
                            if (groupId === null) {
                                status.error('Error:' + response.statusText + '(' + response.status + ')');
                                resolve('err');
                            } else {
                                status.success();
                                groupNameToId[groupName] = groupId[1];
                                GM_setValue('groupNameToId', groupNameToId);
                                resolve(groupId[1]);
                            }
                        } else {
                            status.error('Error:' + response.statusText + '(' + response.status + ')');
                            resolve('err');
                        }
                    },
                    status,
                    r: () => {
                        resolve('err');
                    }
                });
            });
            pro.then(function (groupId) {
                if (groupId !== 'err' && callback) {
                    callback(groupName, groupId);
                }
            });
        }
    },
    leaveSteamGroup: function (r, groupName) {
        this.getGroupID(groupName, (groupName, groupId) => {
            let status = this.echoLog({ type: 'leaveSteamGroup', text: groupName });

            this.httpRequest({
                url: 'https://steamcommunity.com/id/' + steamInfo.userName + '/home_process',
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: $.param({ sessionID: steamInfo.communitySessionID, action: "leaveGroup", groupId: groupId }),
                onload: (response) => {
                    if (debug) console.log(response);
                    if (response.status === 200 && response.finalUrl.includes('groups') && $(response.responseText.toLowerCase()).find(`a[href='https://steamcommunity.com/groups/${groupName.toLowerCase()}']`).length === 0) {
                        status.success();
                        r({ result: 'success', statusText: response.statusText, status: response.status });
                    } else {
                        status.error('Error:' + response.statusText + '(' + response.status + ')');
                        r({ result: 'error', statusText: response.statusText, status: response.status });
                    }
                },
                r,
                status
            });
        });
    },
    followCurator: function (r, curatorId, follow = '1', status = '') {
        status = status || this.echoLog({ type: follow === '1' ? 'followCurator' : 'unfollowCurator', text: curatorId });

        this.httpRequest({
            url: 'https://store.steampowered.com/curators/ajaxfollow',
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            data: $.param({ clanid: curatorId, sessionid: steamInfo.storeSessionID, follow: follow }),
            dataType: 'json',
            onload: (response) => {
                if (debug) console.log(response);
                if (response.status === 200 && response.response && response.response.success && response.response.success.success === 1) {
                    status.success();
                    r({ result: 'success', statusText: response.statusText, status: response.status });
                } else {
                    status.error(`Error:${response.response.msg || response.statusText}(${response.response.success || response.status})`);
                    r({ result: 'error', statusText: response.statusText, status: response.status });
                }
            },
            r,
            status
        });
    },
    unfollowCurator: function (r, curatorId) {
        this.followCurator(r, curatorId, '0');
    },
    getCuratorID: function (developerName, callback, isPublisher = 0) {
        let status = this.echoLog({ type: isPublisher ? 'getPublisherId' : 'getDeveloperId', text: developerName });
        let developerNameToId = GM_getValue('developerNameToId') || {};
        if (developerNameToId[developerName]) {
            status.success();
            callback(developerName, developerNameToId[developerName]);
        } else {
            let pro = new Promise(resolve => {
                this.httpRequest({
                    url: `https://store.steampowered.com/${isPublisher ? "publisher" : "developer"}/${developerName}`,
                    method: "GET",
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    onload: function (response) {
                        if (debug) console.log(response);
                        if (response.status === 200) {
                            let developerId = response.responseText.match(/g_pagingData.*?"clanid":([\d]+)/);
                            if (developerId === null) {
                                status.error('Error:' + response.statusText + '(' + response.status + ')');
                                resolve('err');
                            } else {
                                status.success();
                                developerNameToId[developerName] = developerId[1];
                                GM_setValue('developerNameToId', developerNameToId);
                                resolve(developerId[1]);
                            }
                        } else {
                            status.error('Error:' + response.statusText + '(' + response.status + ')');
                            resolve('err');
                        }
                    },
                    status,
                    r: () => {
                        resolve('err');
                    }
                });
            });
            pro.then(function (curatorId) {
                if (curatorId !== 'err' && callback) {
                    callback(developerName, curatorId);
                }
            });
        }
    },
    followDeveloper: function (r, developerName, isPublisher = 0) {
        this.getCuratorID(developerName, (developerName, curatorId) => {
            let status = this.echoLog({ type: isPublisher ? 'followPublisher' : 'followDeveloper', text: developerName });
            this.followCurator(r, curatorId, '1', status);
        }, isPublisher);

    },
    unfollowDeveloper: function (r, developerName, isPublisher = 0) {
        this.getCuratorID(developerName, (developerName, curatorId) => {
            let status = this.echoLog({ type: isPublisher ? 'unfollowPublisher' : 'unfollowDeveloper', text: developerName });
            this.followCurator(r, curatorId, '0', status);
        }, isPublisher);

    },
    followPublisher: function (r, publisherName) {
        this.followDeveloper(r, publisherName, 1);
    },
    unfollowPublisher: function (r, publisherName) {
        this.unfollowDeveloper(r, publisherName, 1);
    },
    addWishlist: function (r, gameId) {
        let status = this.echoLog({ type: 'addWishlist', text: gameId });
        new Promise(resolve => {
            this.httpRequest({
                url: "https://store.steampowered.com/api/addtowishlist",
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: $.param({ sessionid: steamInfo.storeSessionID, appid: gameId }),
                dataType: 'json',
                onload: function (response) {
                    if (debug) console.log(response);
                    if (response.status === 200 && response.response && response.response.success === true) {
                        status.success();
                        resolve({ result: 'success', statusText: response.statusText, status: response.status });
                    } else {
                        resolve({ result: 'error', statusText: response.statusText, status: response.status });
                    }
                },
                onabort: (response) => { resolve({ result: 'error', statusText: response.statusText, status: response.status }); },
                onerror: (response) => { resolve({ result: 'error', statusText: response.statusText, status: response.status }); },
                ontimeout: (response) => { resolve({ result: 'error', statusText: response.statusText, status: response.status }); },
                r: resolve,
                status
            });
        }).then(result => {
            if (result.result === 'success') {
                r(result);
            } else {
                this.httpRequest({
                    url: "https://store.steampowered.com/app/" + gameId,
                    method: "GET",
                    onload: function (response) {
                        if (debug) console.log(response);
                        if (response.status === 200) {
                            if (response.responseText.includes(`class="queue_actions_ctn"`) && response.responseText.includes('已在库中')) {
                                status.success();
                                r({ result: 'success', statusText: response.statusText, status: response.status, own: true });
                            } else if ((response.responseText.includes(`class="queue_actions_ctn"`) && response.responseText.includes('添加至您的愿望单')) || !response.responseText.includes(`class="queue_actions_ctn"`)) {
                                status.error('Error:' + result.statusText + '(' + result.status + ')');
                                r({ result: 'error', statusText: response.statusText, status: response.status });
                            } else {
                                status.success();
                                r({ result: 'success', statusText: response.statusText, status: response.status });
                            }
                        } else {
                            status.error('Error:' + result.statusText + '(' + result.status + ')');
                            r({ result: 'error', statusText: response.statusText, status: response.status });
                        }
                    },
                    r,
                    status
                });
            }
        });
    },
    removeWishlist: function (r, gameId) {
        let status = this.echoLog({ type: 'removeWishlist', text: gameId });
        new Promise(resolve => {
            this.httpRequest({
                url: "https://store.steampowered.com/api/removefromwishlist",
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: $.param({ sessionid: steamInfo.storeSessionID, appid: gameId }),
                dataType: 'json',
                onload: function (response) {
                    if (debug) console.log(response);
                    if (response.status === 200 && response.response && response.response.success === true) {
                        status.success();
                        resolve({ result: 'success', statusText: response.statusText, status: response.status });
                    } else {
                        resolve({ result: 'error', statusText: response.statusText, status: response.status });
                    }
                },
                onabort: (response) => { resolve({ result: 'error', statusText: response.statusText, status: response.status }); },
                onerror: (response) => { resolve({ result: 'error', statusText: response.statusText, status: response.status }); },
                ontimeout: (response) => { resolve({ result: 'error', statusText: response.statusText, status: response.status }); },
                r: resolve,
                status
            });
        }).then(result => {
            if (result.result === 'success') {
                r(result);
            } else {
                this.httpRequest({
                    url: "https://store.steampowered.com/app/" + gameId,
                    method: "GET",
                    onload: function (response) {
                        if (debug) console.log(response);
                        if (response.status === 200) {
                            if (response.responseText.includes(`class="queue_actions_ctn"`) && (response.responseText.includes('已在库中') || response.responseText.includes('添加至您的愿望单'))) {
                                status.success();
                                r({ result: 'success', statusText: response.statusText, status: response.status });
                            } else {
                                status.error('Error:' + result.statusText + '(' + result.status + ')');
                                r({ result: 'error', statusText: response.statusText, status: response.status });
                            }
                        } else {
                            status.error('Error:' + result.statusText + '(' + result.status + ')');
                            r({ result: 'error', statusText: response.statusText, status: response.status });
                        }
                    },
                    r,
                    status
                });
            }
        });
    },
    followGame: function (r, gameId) {
        let status = this.echoLog({ type: 'followGame', text: gameId });
        new Promise(resolve => {
            this.httpRequest({
                url: "https://store.steampowered.com/explore/followgame/",
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: $.param({ sessionid: steamInfo.storeSessionID, appid: gameId }),
                onload: function (response) {
                    if (debug) console.log(response);
                    if (response.status === 200 && response.responseText === 'true') {
                        status.success();
                        resolve({ result: 'success', statusText: response.statusText, status: response.status });
                    } else {
                        resolve({ result: 'error', statusText: response.statusText, status: response.status });
                    }
                },
                onabort: (response) => { resolve({ result: 'error', statusText: response.statusText, status: response.status }); },
                onerror: (response) => { resolve({ result: 'error', statusText: response.statusText, status: response.status }); },
                ontimeout: (response) => { resolve({ result: 'error', statusText: response.statusText, status: response.status }); },
                r: resolve,
                status
            });
        }).then(result => {
            if (result.result === 'success') {
                r(result);
            } else {
                this.httpRequest({
                    url: "https://store.steampowered.com/app/" + gameId,
                    method: "GET",
                    onload: function (response) {
                        if (debug) console.log(response);
                        if (response.status === 200) {
                            if (response.responseText.includes(`class="queue_actions_ctn"`) && response.responseText.includes(`class="btnv6_blue_hoverfade btn_medium queue_btn_active" style="">`)) {
                                status.success();
                                r({ result: 'success', statusText: response.statusText, status: response.status });
                            } else {
                                status.error('Error:' + result.statusText + '(' + result.status + ')');
                                r({ result: 'error', statusText: response.statusText, status: response.status });
                            }
                        } else {
                            status.error('Error:' + result.statusText + '(' + result.status + ')');
                            r({ result: 'error', statusText: response.statusText, status: response.status });
                        }
                    },
                    r,
                    status
                });
            }
        });
    },
    unfollowGame: function (r, gameId) {
        let status = this.echoLog({ type: 'unfollowGame', text: gameId });
        new Promise(resolve => {
            this.httpRequest({
                url: "https://store.steampowered.com/explore/followgame/",
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data: $.param({ sessionid: steamInfo.storeSessionID, appid: gameId, unfollow: '1' }),
                onload: function (response) {
                    if (debug) console.log(response);
                    if (response.status === 200 && response.responseText === 'true') {
                        status.success();
                        resolve({ result: 'success', statusText: response.statusText, status: response.status });
                    } else {
                        resolve({ result: 'error', statusText: response.statusText, status: response.status });
                    }
                },
                onabort: (response) => { resolve({ result: 'error', statusText: response.statusText, status: response.status }); },
                onerror: (response) => { resolve({ result: 'error', statusText: response.statusText, status: response.status }); },
                ontimeout: (response) => { resolve({ result: 'error', statusText: response.statusText, status: response.status }); },
                r: resolve,
                status
            });
        }).then(result => {
            if (result.result === 'success') {
                r(result);
            } else {
                this.httpRequest({
                    url: "https://store.steampowered.com/app/" + gameId,
                    method: "GET",
                    onload: function (response) {
                        if (debug) console.log(response);
                        if (response.status === 200) {
                            if (response.responseText.includes(`class="queue_actions_ctn"`) && response.responseText.includes(`class="btnv6_blue_hoverfade btn_medium queue_btn_active" style="">`)) {
                                status.error('Error:' + result.statusText + '(' + result.status + ')');
                                r({ result: 'error', statusText: response.statusText, status: response.status });
                            } else {
                                status.success();
                                r({ result: 'success', statusText: response.statusText, status: response.status });
                            }
                        } else {
                            status.error('Error:' + result.statusText + '(' + result.status + ')');
                            r({ result: 'error', statusText: response.statusText, status: response.status });
                        }
                    },
                    r,
                    status
                });
            }
        });
    },
    likeAnnouncements: function (r, url, id) {
        let status = this.echoLog({ type: 'likeAnnouncements', url, id });

        this.httpRequest({
            url: url.replace('/detail/', '/rate/'),
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            data: $.param({ sessionid: steamInfo.communitySessionID, voteup: true }),
            dataType: 'json',
            onload: (response) => {
                if (debug) console.log(response);
                if (response.status === 200 && response.response && response.response.success === 1) {
                    status.success();
                    r({ result: 'success', statusText: response.statusText, status: response.status });
                } else {
                    status.error(`Error:${response.response.msg || response.statusText}(${response.response.success || response.status})`);
                    r({ result: 'error', statusText: response.statusText, status: response.status });
                }
            },
            r,
            status
        });
    },
    getFinalUrl: function (r, url, options = {}) {
        let conf = {
            url: options.url || url,
            method: options.method || "HEAD",
            onload: (response) => {
                r({ result: 'success', finalUrl: response.finalUrl, url });
            },
            r
        };
        if (options.headers) conf.headers = options.headers;
        if (options.data) conf.data = options.data;
        this.httpRequest(conf);
    },
    visitLink: function (r, url, options = {}) {
        let status = this.echoLog({ type: 'visitLink', text: url });
        new Promise(resolve => {
            this.getFinalUrl(resolve, url, options);
        }).then(() => {
            status.warning('Complete');
            r(1);
        });
    },
    forOrder: function ({ arr, callback, i = 0, time = 0, complete = false }) {
        if (complete) {
            if (i < arr.length) {
                callback({ arr, i, end: false });
            } else {
                callback({ end: true });
            }
        } else {
            if (i < arr.length) {
                callback({ e: arr[i], end: false });
                setTimeout(function () {
                    fuc.forOrder({ arr, callback, i: ++i, time, complete });
                }, time);
            } else {
                callback({ end: true });
            }
        }
    },
    checkUpdate: function (v, s = false) {
        v.icon = "el-icon-loading";
        let status = false;
        if (s) status = this.echoLog({ type: 'custom', text: `<li>${getI18n("checkingUpdate")}<font></font></li>` });
        this.httpRequest({
            url: "https://github.com/HCLonely/auto-task/raw/master/version?t=" + new Date().getTime(),
            method: "get",
            dataType: "json",
            onload: (response) => {
                if (debug) console.log(response);
                if (response.response && response.response.version === GM_info.script.version) {
                    v.icon = "el-icon-refresh";
                    v.title = getI18n("checkUpdate");
                    if (s) status.success(getI18n("thisIsNew"));
                    v.hidden = true;
                } else if (response.response) {
                    v.icon = "el-icon-download";
                    v.title = getI18n("updateNow") + response.response.version;
                    v.checkUpdate = function () { window.open("https://github.com/HCLonely/auto-task/raw/master/auto-task.user.js", "_blank"); };
                    if (s) status.success(getI18n("newVer") + response.response.version);
                    v.hidden = false;
                } else {
                    v.icon = "el-icon-refresh";
                    v.title = getI18n("checkUpdate");
                    if (s) status.error("Error:" + (response.statusText || response.status));
                }
                let conf = GM_getValue("conf") || defaultConf;
                if (response.response && response.response.time !== conf.announcement) {
                    v.announcementHidden = false;
                    conf.announcement = response.response.time;
                    GM_setValue("conf", conf);
                }
            },
            ontimeout: (response) => {
                if (debug) console.log(response);
                v.icon = "el-icon-refresh";
                v.title = getI18n("checkUpdate");
                if (s) status.error("Error:Timeout(0)");
            },
            onabort: (response) => {
                if (debug) console.log(response);
                v.icon = "el-icon-refresh";
                v.title = getI18n("checkUpdate");
                if (s) status.error("Error:Abort(0)");
            },
            onerror: (response) => {
                if (debug) console.log(response);
                v.icon = "el-icon-refresh";
                v.title = getI18n("checkUpdate");
                if (s) status.error("Error:Error(0)");
            },
            status
        });
    },
    getAnnouncement: function (v) {
        v.announcementIcon = "el-icon-loading";
        let status = this.echoLog({ type: 'custom', text: `<li>${getI18n("getAnnouncement")}<font></font></li>` });
        this.httpRequest({
            url: "https://github.com/HCLonely/auto-task/raw/master/new.json?t=" + new Date().getTime(),
            method: "get",
            dataType: "json",
            onload: (response) => {
                if (debug) console.log(response);
                if (response.responseText && response.response) {
                    status.success();
                    let data = response.response;
                    let conf = GM_getValue("conf") || defaultConf;
                    conf.announcement = data.time;
                    GM_setValue("conf", conf);
                    v.announcementHidden = true;
                    const h = vueUi.$createElement;
                    let hArr = [];
                    for (let index in data.text) {
                        if (/^[\d]+$/.test(index)) hArr.push(h('p', null, `${parseInt(index) + 1}.${data.text[index]}`));
                    }
                    vueUi.$msgbox({
                        title: `V${data.version}(${fuc.dateFormat("YYYY-mm-dd HH:MM", new Date(data.time))})`,
                        message: h('div', null, hArr),
                        showCancelButton: true,
                        confirmButtonText: getI18n("visitHistory"),
                        cancelButtonText: getI18n("close")
                    }).then(() => {
                        window.open("https://blog.hclonely.com/auto-task/announcement.html", "_blank");
                    }).catch(() => { });
                } else {
                    status.error("Error:" + (response.statusText || response.status));
                }
                v.announcementIcon = "el-icon-document";
            },
            ontimeout: (response) => {
                if (debug) console.log(response);
                v.announcementIcon = "el-icon-document";
                status.error("Error:Timeout(0)");
            },
            onabort: (response) => {
                if (debug) console.log(response);
                v.announcementIcon = "el-icon-document";
                status.error("Error:Abort(0)");
            },
            onerror: (response) => {
                if (debug) console.log(response);
                v.announcementIcon = "el-icon-document";
                status.error("Error:Error(0)");
            },
            status
        });
    },
    newTabBlock: function () {
        let d = new Date();
        let cookiename = "haveVisited1";
        document.cookie = cookiename + "=1; path=/";
        document.cookie = cookiename + "=" + (d.getUTCMonth() + 1) + "/" + d.getUTCDate() + "/" + d.getUTCFullYear() + "; path=/";
    },
    creatSetting: function (settingName, header, fuckOptions, checkedFucks, removeOptions, checkedRemoves) {
        new Vue({
            el: `#${settingName}`,
            data: {
                header: `${header} ${getI18n("websiteSetting")}`,
                checked: GM_getValue('conf') ? GM_getValue('conf')[settingName] ? (!!GM_getValue('conf')[settingName].load) : false : false,
                fuck: {
                    checkAll: fuckOptions.length === checkedFucks.length,
                    checkedFucks: checkedFucks,
                    fucks: fuckOptions,
                    isIndeterminate: fuckOptions.length !== checkedFucks.length,
                },
                remove: {
                    checkAll: removeOptions.length === checkedRemoves.length,
                    checkedRemoves: checkedRemoves,
                    removes: removeOptions,
                    isIndeterminate: removeOptions.length !== checkedRemoves.length,
                },
                openDelay: 100,
                rowType: "flex",
                rowAlign: "middle",
                verify: "1"
            },
            methods: {
                fuckHandleCheckAllChange(val) {
                    this.fuck.checkedFucks = val ? fuckOptions.map(e => e.name) : [];
                    this.fuck.isIndeterminate = false;
                },
                handleCheckedFucksChange(value) {
                    let checkedCount = value.length;
                    this.fuck.checkAll = checkedCount === this.fuck.fucks.length;
                    this.fuck.isIndeterminate = checkedCount > 0 && checkedCount < this.fuck.fucks.length;
                },
                removeHandleCheckAllChange(val) {
                    this.remove.checkedRemoves = val ? removeOptions.map(e => e.name) : [];
                    this.remove.isIndeterminate = false;
                },
                handleCheckedRemovesChange(value) {
                    let checkedCount = value.length;
                    this.remove.checkAll = checkedCount === this.remove.removes.length;
                    this.remove.isIndeterminate = checkedCount > 0 && checkedCount < this.remove.removes.length;
                }
            }
        });
    },
    creatConf: function () {
        let confs = {};
        for (let div of $('div.setting')) {
            let id = $(div).attr('id');
            let conf = {};
            for (let form of $(div).find('form')) {
                let name = $(form).attr('name');
                if (name === 'max-point') {
                    let value = $(form).find('input').val();
                    conf[name] = /^[\d]+$/.test(value) ? value : 0;
                } else {
                    let setting = {};
                    for (let data of $(form).serializeArray()) {
                        setting[data.name] = 1;
                    }
                    conf[name] = setting;
                }
            }
            confs[id] = conf;
        }
        for (let checkbox of $('.non-global input')) {
            if ($(checkbox).is(":checked")) confs[$(checkbox).attr('name')].load = 1;
        }
        let lotteryUserInfo = GM_getValue('conf') ? GM_getValue('conf').lotteryUserInfo : false;
        if (lotteryUserInfo) confs.lotteryUserInfo = lotteryUserInfo;
        let announcement = GM_getValue('conf') ? GM_getValue('conf').announcement : false;
        if (announcement) confs.announcement = announcement;
        return confs;
    },
    echoLog: function (e) {
        let ele = '';
        switch (e.type) {
            case 'updateSteamCommunity':
                ele = $(`<li>${getI18n("updateCommunityId")}<font></font></li>`);
                break;
            case 'updateSteamStore':
                ele = $(`<li>${getI18n("updateStoreId")}<font></font></li>`);
                break;
            case 'joinSteamGroup':
                ele = $(`<li>${getI18n("joinGroup")}<a href="https://steamcommunity.com/groups/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`);
                break;
            case 'getGroupId':
                ele = $(`<li>${getI18n("getGroupId")}<a href="https://steamcommunity.com/groups/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`);
                break;
            case 'leaveSteamGroup':
                ele = $(`<li>${getI18n("leaveGroup")}<a href="https://steamcommunity.com/groups/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`);
                break;
            case 'followCurator':
                ele = $(`<li>${getI18n("followCurator")}<a href="https://store.steampowered.com/curator/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`);
                break;
            case 'unfollowCurator':
                ele = $(`<li>${getI18n("unfollowCurator")}<a href="https://store.steampowered.com/curator/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`);
                break;
            case 'getDeveloperId':
                ele = $(`<li>${getI18n("getDeveloperId")}<a href="https://store.steampowered.com/developer/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`);
                break;
            case 'followDeveloper':
                ele = $(`<li>${getI18n("followDeveloper")}<a href="https://store.steampowered.com/developer/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`);
                break;
            case 'unfollowDeveloper':
                ele = $(`<li>${getI18n("unfollowDeveloper")}<a href="https://store.steampowered.com/developer/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`);
                break;
            case 'getPublisherId':
                ele = $(`<li>${getI18n("getPublisherId")}<a href="https://store.steampowered.com/publisher/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`);
                break;
            case 'followPublisher':
                ele = $(`<li>${getI18n("followPublisher")}<a href="https://store.steampowered.com/publisher/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`);
                break;
            case 'unfollowPublisher':
                ele = $(`<li>${getI18n("unfollowPublisher")}<a href="https://store.steampowered.com/publisher/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`);
                break;
            case 'addWishlist':
                ele = $(`<li>${getI18n("addWishlist")}<a href="https://store.steampowered.com/app/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`);
                break;
            case 'removeWishlist':
                ele = $(`<li>${getI18n("removeWishlist")}<a href="https://store.steampowered.com/app/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`);
                break;
            case 'followGame':
                ele = $(`<li>${getI18n("followGame")}<a href="https://store.steampowered.com/app/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`);
                break;
            case 'unfollowGame':
                ele = $(`<li>${getI18n("unfollowGame")}<a href="https://store.steampowered.com/app/${e.text}" target="_blank">${e.text}</a>...<font></font></li>`);
                break;
            case 'likeAnnouncements':
                ele = $(`<li>${getI18n("likeAnnouncements")}<a href="${e.url}" target="_blank">${e.id}</a>...<font></font></li>`);
                break;
            case 'visitLink':
                ele = $(`<li>${getI18n("visitLink")}...<a href="${e.text}" target="_blank">${e.text}</a>...<font></font></li>`);
                break;
            case 'custom':
                ele = $(e.text);
                break;
            default:
                ele = $(`<li>${getI18n("unknown")}<font></font></li>`);
                break;
        }
        $('.fuck-task-logs .el-notification__content').append(ele);
        ele[0].scrollIntoView();
        let font = ele.find('font');
        const status = {
            font,
            success: function (text = "Success") {
                this.font.attr("class", "").addClass("success");
                this.font.text(text);
            },
            error: function (text = "Error") {
                this.font.attr("class", "").addClass("error");
                this.font.text(text);
            },
            warning: function (text = "Warning") {
                this.font.attr("class", "").addClass("warning");
                this.font.text(text);
            },
            info: function (text = "Info") {
                this.font.attr("class", "").addClass("info");
                this.font.text(text);
            },
        };
        return status;
    },
    unique: e => [...new Set(e)],
    getUrlQuery: function (url) {
        let q = {};
        if (url) {
            if (url.includes("?")) {
                url.split("?")[1].replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => q[k] = v);
            }
        } else {
            location.search.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => q[k] = v);
        }
        return q;
    },
    dateFormat: function (fmt, date) {
        let ret;
        let opt = {
            "Y+": date.getFullYear().toString(),        // 年
            "m+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "M+": date.getMinutes().toString(),         // 分
            "S+": date.getSeconds().toString()          // 秒
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")));
            }
        }
        return fmt;
    },
    addBackground: function () {
        GM_addStyle(`body {background-image:url(http://wx3.sinaimg.cn/large/006brDXlly1ft9lm37ot7j31hc0u0an5.jpg);background-position:center bottom;background-size:cover;background-attachment:fixed;background-repeat:no-repeat;}`);
    },
    isEmptyObjArr: function (object) {
        for (let value of Object.values(object)) {
            if (Object.prototype.toString.call(value) === "[object Array]") {
                if (value.length !== 0) {
                    return false;
                }
            } else if (Object.prototype.toString.call(value) === "[object Object]") {
                if (Object.keys(value).length !== 0) {
                    return false;
                }
            } else if (Object.prototype.toString.call(value) === "[object String]") {
                if (value !== "") {
                    return false;
                }
            }
        }
        return true;
    }
};