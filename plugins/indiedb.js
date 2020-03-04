const indiedb = {
    fuck: function () {
        if ($("a.buttonenter:contains(Register to join)").length > 0) fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n("needLogin")}</font></li>` });
        let currentoption = $("a.buttonenter.buttongiveaway");
        if (/join giveaway/gim.test(currentoption.text())) {
            let status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n("joinGiveaway")}<font></font></li>` });
            let do_task = this.do_task;
            fuc.httpRequest({
                url: currentoption.attr('href'),
                method: 'POST',
                data: 'ajax=t',
                dataType: 'json',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'accept': 'application/json, text/javascript, */*; q=0.01'
                },
                onload: function (response) {
                    if (debug) console.log(response);
                    if (response.status === 200 && response.response) {
                        if (response.response.success) {
                            currentoption.addClass("buttonentered").text("Success - Giveaway joined");
                            $("#giveawaysjoined").slideDown();
                            $("#giveawaysrecommend").slideDown();
                            status.success("Success" + (response.response.text ? (":" + response.response.text) : ""));
                            do_task();
                        } else {
                            status.error("Error" + (response.response.text ? (":" + response.response.text) : ""));
                        }
                    } else {
                        status.error("Error:" + (response.statusText || response.status));
                    }
                }
            });
        } else if (/success/gim.test($("a.buttonenter.buttongiveaway").text())) {
            this.do_task();
        } else {
            fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n("needJoinGiveaway")}</font></li>` });
        }
    },
    do_task: function () {
        let id = $("script").map(function (i, e) {
            if (/\$\(document\)/gim.test(e.innerHTML)) {
                let optionId = e.innerHTML.match(/"\/newsletter\/ajax\/subscribeprofile\/optin\/[\d]+"/gim)[0].match(/[\d]+/)[0];
                let taskId = e.innerHTML.match(/"\/[\d]+"/gim)[0].match(/[\d]+/)[0];
                return [taskId, optionId];
            }
        });
        if (id.length === 2) {
            let tasks = $("#giveawaysjoined a[class*=promo]");
            let pro = [];
            for (let task of tasks) {
                let promo = $(task);
                if (!promo.hasClass("buttonentered")) {
                    let status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n("doing")}:${promo.parents("p").text()}...<font></font></li>` });
                    if (/facebookpromo|twitterpromo|visitpromo/gim.test(task.className)) {
                        pro.push(new Promise(resolve => {
                            $.ajax({
                                type: "POST",
                                url: urlPath("/giveaways/ajax/" + (promo.hasClass("facebookpromo") ? "facebookpromo" : (promo.hasClass("twitterpromo") ? "twitterpromo" : "visitpromo")) + "/" + id[0]), timeout: 60000, dataType: "json",
                                data: { ajax: "t" },
                                error: function (response, error, exception) {
                                    if (debug) console.log({ response, error, exception });
                                    status.error("Error:An error has occurred performing the action requested. Please try again shortly.");
                                    resolve(0);
                                },
                                success: function (response) {
                                    if (debug) console.log(response);
                                    if (response.success) {
                                        status.success("Success:" + response.text);
                                        promo.addClass("buttonentered").closest("p").html(promo.closest("p").find("span").html());
                                        resolve(1);
                                    } else {
                                        status.error("Error:" + response.text);
                                        resolve(0);
                                    }
                                }
                            });
                        }));
                    } else if (promo.hasClass("emailoptinpromo")) {
                        pro.push(new Promise(resolve => {
                            $.ajax({
                                type: "POST",
                                url: urlPath("/newsletter/ajax/subscribeprofile/optin/" + id[1]),
                                timeout: 60000,
                                dataType: "json",
                                data: { ajax: "t", emailsystoggle: 4 },
                                error: function (response, error, exception) {
                                    if (debug) console.log({ response, error, exception });
                                    status.error("Error:An error has occurred performing the action requested. Please try again shortly.");
                                    resolve(0);
                                },
                                success: function (response) {
                                    if (debug) console.log(response);
                                    if (response.success) {
                                        status.success("Success:" + response.text);
                                        promo.toggleClass("buttonentered").closest("p").html(promo.closest("p").find("span").html());
                                        resolve(1);
                                    } else {
                                        status.error("Error:" + response.text);
                                        resolve(0);
                                    }
                                }
                            });
                        }));
                    } else if (promo.hasClass("watchingpromo")) {
                        pro.push(new Promise(resolve => {
                            let data = fuc.getUrlQuery(promo.attr("href"));
                            data.ajax = "t";
                            $.ajax({
                                type: "POST",
                                url: urlPath(promo.attr("href").split(/[?#]/)[0]),
                                timeout: 60000,
                                dataType: "json",
                                data: data,
                                error: function (response, error, exception) {
                                    if (debug) console.log({ response, error, exception });
                                    status.error("Error:An error has occurred performing the action requested. Please try again shortly.");
                                    resolve(0);
                                },
                                success: function (response) {
                                    if (debug) console.log(response);
                                    if (response.success) {
                                        status.success("Success:" + response.text);
                                        promo.toggleClass("buttonentered").closest("p").html(promo.closest("p").find("span").html());
                                        resolve(1);
                                    } else {
                                        status.error("Error:" + response.text);
                                        resolve(0);
                                    }
                                }
                            });
                        }));
                    } else if (!/the-challenge-of-adblock/gim.test(promo.attr("href"))) {
                        pro.push(new Promise(resolve => {
                            $.ajax({
                                type: "POST", url: urlPath(promo.attr("href")), timeout: 60000, dataType: "json",
                                data: { ajax: "t" },
                                error: function (response, error, exception) {
                                    if (debug) console.log({ response, error, exception });
                                    status.error("Error:An error has occurred performing the action requested. Please try again shortly.");
                                    resolve(0);
                                },
                                success: function (response) {
                                    if (debug) console.log(response);
                                    if (response.success) {
                                        status.success("Success:" + response.text);
                                        promo.toggleClass("buttonentered").closest("p").html(promo.closest("p").find("span").html());
                                        resolve(1);
                                    } else {
                                        status.error("Error:" + response.text);
                                        resolve(0);
                                    }
                                }
                            });
                        }));
                    } else {
                        status.error("Error:" + getI18n("unknowntype"));
                    }
                }
            }
            Promise.all(pro).finally(() => {
                fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n("allTasksComplete")}</font></li>` });
            });
        } else {
            fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n("getIdFailed")}</font></li>` });
        }
    },
    verify: function () {
    },
    remove: function () {
    },
    checkLogin: function () {
        if ($("a.buttonenter:contains(Register to join)").length > 0) window.open("/members/login", "_self");
    },
    checkLeft: function (ui) { },
    setting: {
        'fuck': true,
        'verify': false,
        'join': false,
        'remove': false
    },
    conf: GM_getValue('conf') ? ((GM_getValue('conf').indiedb && GM_getValue('conf').indiedb.load) ? GM_getValue('conf').indiedb : (GM_getValue('conf').global || defaultConf)) : defaultConf
};