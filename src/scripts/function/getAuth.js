import { getI18n } from '../i18n'
import { throwError } from './tool'

function getDiscordAuth (notice) {
  try {
    if (typeof discordAuth === 'string') {
      GM_setValue('discordInfo', {
        authorization: discordAuth.replace(/"/g, ''),
        expired: false,
        updateTime: new Date().getTime()
      })
      if (notice) {
        Swal.fire({
          title: getI18n('updateDiscordInfoSuccess'),
          icon: 'success'
        })
      }
    } else {
      if (notice) {
        Swal.fire({
          title: getI18n('updateDiscordInfoError'),
          icon: 'error'
        })
      }
    }
  } catch (e) {
    throwError(e, 'getDiscordAuth')
    if (notice) {
      Swal.fire({
        title: getI18n('updateDiscordInfoError'),
        icon: 'error'
      })
    }
  }
}

export { getDiscordAuth }
