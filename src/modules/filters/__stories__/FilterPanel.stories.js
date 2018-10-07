import React from 'react'
import { storiesOf, action } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import FilterPanel from '../FilterPanel'

const filters = {
  collar: 0,
  coretype: 0,
  details: 0,
  neckline: 1,
  pattern: 0,
  shoulder: 0,
  sleeve_length: 2,
  solid: 0,
  top_length: 0,
  favorite: true
}

storiesOf('filters/FilterPanel', module)
  .add(
    'mobile default',
    withInfo(`
      mobile visual filter panel
    `)(() => (
      <FilterPanel
        filters={filters}
        lastBodyPart='coretype'
        onFilterChange={action('filter changed')}
        onClose={action('close visual filter')}
        onFilterLike={action('favorite filter')}
        onBodyPartChange={action('body part changed')}
      />))
  )
  .add(
    'desktop default',
    withInfo(`
      mobile visual filter panel
    `)(() => (
      <FilterPanel
        filters={filters}
        lastBodyPart='coretype'
        onFilterChange={action('filter changed')}
        onClose={action('close visual filter')}
        onFilterLike={action('favorite filter')}
        onBodyPartChange={action('body part changed')}
        useVerticalThumb={false}
      />))
  )
