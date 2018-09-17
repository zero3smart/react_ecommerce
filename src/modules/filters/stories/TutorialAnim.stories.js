import React from 'react'
import { storiesOf, action } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import TutorialAnim from '../TutorialAnim'

const filters = {
  collar: 0,
  coretype: 2,
  details: 0,
  neckline: 1,
  pattern: 0,
  shoulder: 1,
  sleeve_length: 0,
  top_length: 2,
  favorite: true
}

storiesOf('filters/TutorialAnim', module)
  .add(
    'default',
    withInfo(`
      mobile visual filter panel
    `)(() => (
      <TutorialAnim
        filters={filters}
        lastBodyPart='coretype'
        onFilterChange={action('filter changed')}
        onClose={action('close visual filter')}
        onFilterLike={action('favorite filter')}
        onBodyPartChange={action('body part changed')}
      />))
  )
