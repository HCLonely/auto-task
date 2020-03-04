function loadAnnouncement() {
    new Promise(resolve => {
        fuc.httpRequest({
            url: "https://github.com/HCLonely/auto-task/raw/master/announcement.json",
            method: "get",
            dataType: "json",
            onload: response => {
                if (debug) console.log(response);
                if (response.status === 200 && response.response) {
                    resolve({ result: "success", data: response.response });
                } else {
                    resolve({ result: "error", data: response });
                }
            },
            r: resolve
        });
    }).then(data => {
        if (data.result === "success") {
            let announcements = data.data;
            announcements.map(e => {
                e.time = fuc.dateFormat("YYYY-mm-dd HH:MM", new Date(e.time));
                return e;
            });
            new Vue({
                el: "#app",
                data: {
                    announcements: announcements
                }
            });
        } else {
            vueUi.$message({ type: "error", duration: 0, message: `${getI18n("loadAnnouncementFailed")}${data.statusText || getI18n("checkConsole")}！`, showClose: true });
            console.error(data);
        }
    }).catch(error => {
        vueUi.$message({ type: "error", duration: 0, message: `${getI18n("loadAnnouncementFailed") + getI18n("checkConsole")}`, showClose: true });
        console.error(error);
    });
}