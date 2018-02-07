import * as Types from '../constants/types/fs'
import {type IconType} from '../common-adapters/icon'
import {isMobile} from '../constants/platform'

const iconMap = {
  file: isMobile ? 'icon-file' : 'icon-file',
  folder: isMobile ? 'icon-folder-private' : 'icon-folder-private',
  symlink: isMobile ? 'icon-file' : 'icon-file',
}

const pathToIcon = (type, path, size=24) => {
  const icon: IconType = iconMap[Types.pathTypeToString(type)]+'-'+size
  return icon
}

export { pathToIcon }
