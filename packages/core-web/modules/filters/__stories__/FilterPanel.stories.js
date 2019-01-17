import React from 'react'
import { storiesOf, action } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import FilterPanel from '../FilterPanel'

const wtopDefaultFilters = {
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

const wshoesDefaultFilters = {
  toes: 0,
  cover: 0,
  counter: 0,
  bottom: 0,
  shaft: 0
}

storiesOf('filters/FilterPanel', module)
  .add(
    'mobile default',
    withInfo(`
      mobile visual filter panel
    `)(() => (
      <FilterPanel
        filters={wtopDefaultFilters}
        lastBodyPart='coretype'
        onFilterChange={action('filter changed')}
        onClose={action('close visual filter')}
        onFilterLike={action('favorite filter')}
        onBodyPartChange={action('body part changed')}
      />))
  )
  .add(
    'mobile touch debug',
    withInfo(`
    mobile touch debug
    `)(() => (
      <FilterPanel
        filters={wtopDefaultFilters}
        lastBodyPart='coretype'
        onFilterChange={action('filter changed')}
        onClose={action('close visual filter')}
        onFilterLike={action('favorite filter')}
        onBodyPartChange={action('body part changed')}
        debugTouchArea
      />))
  )
  .add(
    'desktop default',
    withInfo(`
      mobile visual filter panel
    `)(() => (
      <FilterPanel
        filters={wtopDefaultFilters}
        lastBodyPart='coretype'
        onFilterChange={action('filter changed')}
        onClose={action('close visual filter')}
        onFilterLike={action('favorite filter')}
        onBodyPartChange={action('body part changed')}
        useVerticalThumb={false}
      />))
  )
  .add(
    'desktop wshoes default',
    withInfo(`
      mobile visual filter panel
    `)(() => (
      <FilterPanel
        category='wshoes'
        filters={wshoesDefaultFilters}
        lastBodyPart='bottom'
        onFilterChange={action('filter changed')}
        onClose={action('close visual filter')}
        onFilterLike={action('favorite filter')}
        onBodyPartChange={action('body part changed')}
        useVerticalThumb={false}
      />))
  )
  .add(
    'desktop wshoes touch',
    withInfo(`
      mobile visual filter panel
    `)(() => (
      <FilterPanel
        category='wshoes'
        filters={wshoesDefaultFilters}
        lastBodyPart='bottom'
        onFilterChange={action('filter changed')}
        onClose={action('close visual filter')}
        onFilterLike={action('favorite filter')}
        onBodyPartChange={action('body part changed')}
        useVerticalThumb={false}
        debugTouchArea
      />))
  )
