/* global defaultConfig,getI18n,Swal,GM_info,$ */
/* eslint-disable no-unused-vars */
function loadSettings (userConfig) {
  const config = Object.assign(defaultConfig, userConfig)
  const form = $('form').html('')
  form.before(`<h2 class="center">${getI18n('settingTitle')}</h2><p class="center">${getI18n('currentVersion', GM_info.script.version) + getI18n('latestVersion')}</p>`)
  loadLatestVersion()
  for (const [key, value] of Object.entries(config)) {
    let tbody = ''
    if (!['announcement'].includes(key)) {
      for (const [_k, _v] of Object.entries(value)) {
        let tr = ''
        for (const [k, v] of Object.entries(_v)) {
          tr += `
<tr>
  ${tr === '' ? `<th rowspan="${_k === 'verify' ? Object.keys(_v).length : (Object.keys(_v).length + 1)}">${getI18n(_k + 'Button')}</th>` : ''}
  <td>${getI18n(k)}</td>
  <td>${getI18n(k + 'Des')}</td>
  <td>${typeof v === 'boolean'
            ? `<div class="custom-control custom-${_k === 'verify' ? 'radio' : 'checkbox'}"><input type="${_k === 'verify' ? 'radio' : 'checkbox'}" class="custom-control-input" name="${key + '-' + _k + '-' + k}" id="${key + '-' + _k + '-' + k}"${v ? ' checked="checked"' : ''}><label class="custom-control-label" for="${key + '-' + _k + '-' + k}">${getI18n('enable')}</label></div>`
            : `<div class="form-group row"><div class="col-sm-10"><input type="text" class="form-control" value="${v}" name="${key + '-' + _k + '-' + k}" id="${key + '-' + _k + '-' + k}"></div></div>`}
  </td>
</tr>`
        }
        tbody += tr + (['fuck', 'remove', 'other'].includes(_k) ? `<tr>
  <td colspan="2"></td>
  <td>
  <div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" name="${key + '-' + _k + '-all'}" id="${key + '-' + _k + '-all'}"><label class="custom-control-label" for="${key + '-' + _k + '-all'}">${getI18n('selectAll')}</label></div>
  </td>
</tr>` : '')
      }
      const table = `
<table class="table table-bordered table-striped table-hover">
  <thead>
    <tr>
      <th scope="col" colspan="4" class="table-header">
        ${key === 'global' ? getI18n('globalSetting') : getI18n('websiteSetting', key)}
        ${value.enable === undefined ? '' : `<div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" name="${key + '-enable'}" id="${key + '-enable'}${value.enable ? ' checked="checked"' : ''}"><label class="custom-control-label" for="${key + '-enable'}">${getI18n('enable')}</label></div>`}
      </th>
    </tr>
    <tr>
      <th scope="col"></th>
      <th scope="col">${getI18n('function')}</th>
      <th scope="col">${getI18n('description')}</th>
      <th scope="col">${getI18n('option')}</th>
    </tr>
  </thead>
  <tbody>
    ${tbody}
  </tbody>
</table>`
      form.append(table)
    } else {
      const table = `<div class="form-group row" style="display:none"><div class="col-sm-10"><input type="text" class="form-control" value="${value}" name="${key}" id="${key}"></div></div>`
      form.append(table)
    }
  }
  if ($('.btn-group-vertical').length === 0) {
    form.after(`
<div class="btn-group-vertical" role="group" aria-label="Basic example">
  <button type="button" class="btn btn-primary" onclick="saveSetting()">${getI18n('saveSetting')}</button>
  <button type="button" class="btn btn-primary" onclick="resetSetting()">${getI18n('resetSetting')}</button>
  <button type="button" class="btn btn-primary" onclick="exportConfig()">${getI18n('exportSetting')}</button>
  <button type="button" class="btn btn-primary" onclick="importConfig()">${getI18n('importSetting')}</button>
</div>`)
  }
  $('input[name$="-all"]').unbind('click').click(function (e) {
    const type = $(this).attr('name').replace('-all', '')
    const group = $('input[name^="' + type + '"]')
    $(this).is(':checked') ? group.prop('checked', true) : group.prop('checked', false)
  })
  $('.non-js').hide()
  return true
}

function loadLatestVersion () {
  $.get('/version.json?t=' + new Date().getTime(), function (data, status, xhr) {
    if (status === 'success') {
      $('#latestVersion').text(data.version)
    } else {
      $('#latestVersion').text(getI18n('loadVersionFiled'))
    }
  }, 'json')
}
function exportConfig () {
  Swal.fire({
    title: getI18n('processSetting'),
    onBeforeOpen: () => {
      Swal.showLoading()
      const conf = creatConfig()
      const creatFile = new FileReader()
      creatFile.onload = () => {
        $(`<a href="${creatFile.result}" download="auto-task.conf.json" target="_blank"></a> `)[0].click()
        Swal.close()
      }
      creatFile.onerror = e => {
        console.log(e)
        Swal.hideLoading()
        Swal.update({
          icon: 'error',
          title: getI18n('creatUrlFailed')
        })
      }
      creatFile.readAsDataURL(new File([JSON.stringify(conf, null, 4)], 'setting.conf.txt'))
    }
  })
}
async function importConfig () {
  const { value: file } = await Swal.fire({
    title: 'Select file',
    input: 'file',
    inputAttributes: {
      accept: 'json,txt'
    }
  })

  if (file) {
    Swal.fire({
      title: getI18n('readSetting')
    })
    Swal.showLoading()
    if (window.FileReader) {
      const reader = new FileReader()
      reader.onload = () => {
        Swal.hideLoading()
        Swal.update({
          icon: 'success',
          title: getI18n('readSettingComplete')
        })
        try {
          GM_setValue('conf', JSON.parse(reader.result))
          loadSettings(JSON.parse(reader.result))
          Swal.update({
            icon: 'success',
            title: getI18n('loadSettingComplete')
          })
        } catch (e) {
          Swal.update({
            icon: 'error',
            title: `${getI18n('loadSettingFailed')}！`
          })
          console.log(`${getI18n('loadSettingFailed')}: `, e)
        }
      }
      reader.onerror = e => {
        console.log(e)
        Swal.hideLoading()
        Swal.update({
          icon: 'error',
          title: getI18n('readSettingFailed')
        })
      }
      reader.readAsText(file)
    } else {
      Swal.hideLoading()
      Swal.update({
        icon: 'warning',
        title: getI18n('notSupport'),
        confirmButtonText: getI18n('confirm'),
        cancelButtonText: getI18n('cancel'),
        showCancelButton: true
      }).then((result) => {
        if (result.value) {
          Swal.fire({
            title: getI18n('copySetting'),
            icon: 'info',
            input: 'textarea',
            confirmButtonText: getI18n('confirm'),
            cancelButtonText: getI18n('cancel'),
            showCancelButton: true
          })
            .then(({ value }) => {
              Swal.update({
                icon: 'info',
                title: getI18n('loadSettingText')
              })
              try {
                GM_setValue('conf', JSON.parse(value))
                loadSettings(JSON.parse(value))
                Swal.update({
                  icon: 'success',
                  title: getI18n('loadSettingComplete')
                })
              } catch (e) {
                Swal.update({
                  icon: 'error',
                  title: `${getI18n('loadSettingFailed')}！`
                })
                console.log(`${getI18n('loadSettingFailed')}: `, e)
              }
            })
            .catch(action => {
              Swal.update({
                icon: 'info',
                title: getI18n('cancelled')
              })
            })
        }
      })
    }
  }
}

function creatConfig () {
  const configArray = $('form').serializeArray()
  const configRaw = {}
  for (const e of configArray) {
    const keys = e.name.split('-')
    switch (keys.length) {
      case 1:
        configRaw[keys[0]] = e.value === 'on' ? true : e.value
        break
      case 2:
        if (!configRaw[keys[0]]) configRaw[keys[0]] = {}
        configRaw[keys[0]][keys[1]] = e.value === 'on' ? true : e.value
        break
      case 3:
        if (!configRaw[keys[0]]) configRaw[keys[0]] = {}
        if (!configRaw[keys[0]][keys[1]]) configRaw[keys[0]][keys[1]] = {}
        configRaw[keys[0]][keys[1]][keys[2]] = e.value === 'on' ? true : e.value
        break
      default:
        console.warn('Unknown key: defaultConfig.' + e.replace(/-/g, '.'), defaultConfig)
    }
  }
  for (const [key1, value1] of Object.entries(defaultConfig)) {
    if (Object.prototype.toString.call(value1) === '[object Object]') {
      for (const [key2, value2] of Object.entries(value1)) {
        if (Object.prototype.toString.call(value2) === '[object Object]') {
          for (const [key3, value3] of Object.entries(value2)) {
            if (!configRaw[key1]) configRaw[key1] = {}
            if (!configRaw[key1][key2]) configRaw[key1][key2] = {}
            if (!configRaw[key1][key2][key3]) configRaw[key1][key2][key3] = false
          }
        } else {
          if (!configRaw[key1]) configRaw[key1] = {}
          if (!configRaw[key1][key2]) configRaw[key1][key2] = false
        }
      }
    } else {
      if (!configRaw[key1]) configRaw[key1] = false
    }
  }
  return configRaw
}
function saveSetting () {
  try {
    GM_setValue('conf', creatConfig())
    Swal.fire({
      icon: 'success',
      title: getI18n('saveSuccess')
    })
  } catch (e) {
    console.log(e)
    Swal.fire({
      icon: 'error',
      title: getI18n('saveError'),
      text: e.message
    })
  }
}
function resetSetting () {
  Swal.fire({
    icon: 'warning',
    title: getI18n('resetSettingNotice'),
    confirmButtonText: getI18n('confirm'),
    cancelButtonText: getI18n('cancel'),
    showCancelButton: true
  }).then(e => {
    if (e.value) {
      $('h2.center').remove()
      if (loadSettings({})) {
        Swal.update({
          icon: 'success',
          title: getI18n('resetSettingSuccess'),
          showCancelButton: false
        })
      } else {
        Swal.update({
          icon: 'error',
          title: getI18n('resetSettingFailed'),
          showCancelButton: false
        })
      }
    } else {
      Swal.update({
        icon: 'warning',
        title: getI18n('resetSettingCancel'),
        showCancelButton: false
      })
    }
  })
}
