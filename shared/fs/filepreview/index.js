// @flow
import * as React from 'react'
import * as Types from '../../constants/types/fs'
import {globalStyles, globalColors, globalMargins, isMobile} from '../../styles'
import {Box, BackButton, Button, ClickableBox, Icon, List, Text} from '../../common-adapters'
import {type IconType} from '../../common-adapters/icon'
import {pathToIcon} from '../icon'
import {formatTimeForMessages} from '../../util/timestamp'


const stylesCommonCore = {
  alignItems: 'center',
  borderBottomColor: globalColors.black_05,
  borderBottomWidth: 1,
  justifyContent: 'center',
}

const stylesCommonColumn = {
  ...globalStyles.flexBoxColumn,
  ...stylesCommonCore,
  minHeight: isMobile ? 64 : 40,
}

type FilePreviewHeaderProps = {
  title: string,
  desc: string,
}

const filePreviewHeaderStyle = {...stylesCommonColumn, alignItems: 'center', borderBottomWidth: 0}

const FilePreviewHeader = ({title,desc}: FilePreviewHeaderProps) => (
  <Box>
    <Box style={filePreviewHeaderStyle}>
      <Text type="BodyBig">
      {title}
      </Text>
      <Text type="BodySmall">{desc}</Text>
    </Box>
  </Box>
)

type FilePreviewProps = {
  path: Types.Path,
  meta: Types.PathItemMetadata,
  onBack: () => void,
}

const stylesContainer = {
  ...globalStyles.flexBoxColumn,
  ...globalStyles.fullHeight,
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
}
const styleOuterContainer = {
  height: '100%',
  position: 'relative',
}

const humanReadableFileSize = (size) => {
  if(size > 1024*1024*1024*1024)
    return ''+Math.round(size/(1024*1024*1024*1024))+'tb'
  if(size > 1024*1024*1024)
    return ''+Math.round(size/(1024*1024*1024))+'gb'
  if(size > 1024*1024)
    return ''+Math.round(size/(1024*1024))+'mb'
  if(size > 1024)
    return ''+Math.round(size/1024)+'kb'
  return ''+size
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onBack: () => dispatch(navigateUp()),
})

class FilePreview extends React.PureComponent<FilePreviewProps> {

  render() {
    const {onBack, path, meta} = this.props
    const icon = pathToIcon('file', path, 48)
    const fileName = Types.getPathName(path)
    const mtime = formatTimeForMessages(meta.lastModifiedTimestamp)
    // FIXME hook actions to the buttons.
    return (
      <Box style={styleOuterContainer}>
          <Box style={globalStyles.flexBoxColumn}>
              <BackButton onClick={onBack} style={{left: 16, position: 'absolute', top: 16}} />
          </Box>
          <FilePreviewHeader title={fileName}  desc={'Modified on '+mtime+' by '+meta.lastWriter}/>
        <Box style={stylesContainer}>
        <Icon type={icon}/>
        <Text type="BodyBig" style={{marginTop: globalMargins.small}}>{fileName}</Text>
        <Text type="BodySmall">{humanReadableFileSize(meta.size)}</Text>
        <Button key="share" type="Primary" label="Share"
          style={{marginTop: globalMargins.medium}}/>
        <Button key="open" type="Secondary" label="Open folder"
          style={{marginTop: globalMargins.small}}/>
        </Box>
      </Box>
    )
  }
}

export default FilePreview
