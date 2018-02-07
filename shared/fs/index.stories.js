// @flow
import React from 'react'
import * as Types from '../constants/types/fs'
import {Box} from '../common-adapters'
import {storiesOf} from '../stories/storybook'
import Files from '.'
import FilePreview from './filepreview'

const load = () => {
  storiesOf('Files', module).add('Root', () => (
    <Box style={{width: '100%'}}>
      <Files path={Types.stringToPath('/keybase')} items={[]} onBack={() => {}} />
      <Files path={Types.stringToPath('/keybase/private')} items={[]} onBack={() => {}} />
      <Files path={Types.stringToPath('/keybase/public')} items={[]} onBack={() => {}} />
      <FilePreview path={'/keybase/private/foo/bar.img'}
      meta={{lastModifiedTimestamp: 1518029754000, size: 15000, lastWriter: 'foobar', progress: 'pending'}}/>
    </Box>
  ))
}

export default load
