/* global getI18n, fuc, globalConf, config, debug */
const spoune = { // eslint-disable-line no-unused-vars
  test () { return window.location.host.includes('spoune') },
  fuck () { this.get_tasks() },
  get_tasks () {
    const [
      status,
      giveawayTasks
    ] = [
      fuc.echoLog({ type: 'custom', text: `<li>${getI18n('getTasksInfo')}<font></font></li>` }),
      $('#GiveawayTasks button')
    ]
    for (const task of giveawayTasks) {
      const taskClick = $(task).attr('onclick')
      if (taskClick) {
        const taskId = taskClick.match(/loadTask\(([\d]+)/)
        if (taskId) {
          this.tasks.push({ id: taskId[1], text: $(task).text() })
        } else {
          fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('getTaskIdFailed', $(task).text())}</font></li>` })
        }
      } else {
        fuc.echoLog({ type: 'custom', text: `<li><font class="error">${getI18n('getTaskIdFailed', $(task).text())}</font></li>` })
      }
    }
    status.warning('Complete')
    if (this.tasks.length > 0) {
      this.verify()
    } else {
      fuc.echoLog({ type: 'custom', text: `<li><font class="warning">${getI18n('noAutoFinish')}</font></li>` })
    }
  },
  async verify ({ arr, i, end }) {
    const tasks = fuc.unique(this.tasks)
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i]
      const status = fuc.echoLog({ type: 'custom', text: `<li>${getI18n('doing')}${task.text}...<font></font></li>` })
      await new Promise(resolve => {
        fuc.httpRequest({
          url: `/controller.php?taskDetail=${task.id}&show`,
          method: 'get',
          onload (response) {
            if (debug) console.log(response)
            if (response.status === 200) {
              const src = response.responseText.match(/src="\.([\w\W]*?)">/)
              if (src) {
                fuc.httpRequest({
                  url: src[1],
                  method: 'get',
                  onload (response) {
                    if (debug) console.log(response)
                    if (response.status === 200) {
                      const href = response.responseText.match(/href="\.(\/verify[\w\W]*?)"/) || response.responseText.match(/href="\.(\/steamgroup[\w\W]*?)"/)
                      if (href) {
                        fuc.httpRequest({
                          url: '/werbung' + href[1],
                          method: 'get',
                          onload (response) {
                            if (debug) console.log(response)
                            if (response.status === 200 && /Task.*completed/gim.test(response.responseText)) {
                              status.success()
                              resolve()
                            } else {
                              const href = response.responseText.match(/href="\.(\/verify[\w\W]*?)"/) || response.responseText.match(/href="\.(\/steamgroup[\w\W]*?)"/)
                              if (href) {
                                fuc.httpRequest({
                                  url: '/werbung' + href[1],
                                  method: 'get',
                                  onload (response) {
                                    if (debug) console.log(response)
                                    if (response.status === 200 && /Task.*completed/gim.test(response.responseText)) {
                                      status.success()
                                    } else {
                                      status.error('Error:' + (response.statusText || response.status))
                                    }
                                    resolve()
                                  },
                                  r: resolve,
                                  status
                                })
                              } else {
                                status.error('Error:' + (response.statusText || response.status))
                                resolve()
                              }
                            }
                          },
                          r: resolve,
                          status
                        })
                      } else {
                        status.error('Error:' + getI18n('getUrlFailed', '2'))
                        resolve()
                      }
                    } else {
                      status.error('Error:' + (response.statusText || response.status))
                      resolve()
                    }
                  },
                  r: resolve,
                  status
                })
              } else {
                status.error('Error:' + getI18n('getUrlFailed', '1'))
                resolve()
              }
            } else {
              status.error('Error:' + (response.statusText || response.status))
              resolve()
            }
          },
          r: resolve,
          status
        })
      }).then(() => {
        return true
      }).catch(() => {
        return false
      })
    }
    fuc.echoLog({ type: 'custom', text: `<li><font class="success">${getI18n('allTasksComplete')}</font>，<font class="warning">${getI18n('finishSelf')}</font></li>` })
  },
  checkLeft (ui) {
    const checkLeft = setInterval(() => {
      if ($('#keysAvailable').length > 0) {
        clearInterval(checkLeft)
        if ($('#keysAvailable').text() === '0') {
          ui.$confirm(getI18n('noKeysLeft'), getI18n('notice'), {
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            type: 'warning',
            center: true
          }).then(() => {
            window.close()
          })
        }
      }
    }, 500)
  },
  tasks: [], // 任务信息
  setting: {
    fuck: true,
    verify: false,
    remove: false
  },
  conf: config?.spoune?.load ? config.spoune : globalConf
}
