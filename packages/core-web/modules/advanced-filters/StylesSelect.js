import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import find from 'lodash/find'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import isEqual from 'lodash/isEqual'

import VisualFilterBagde from '../../ui-kits/visual-filters/VisualFilterBagde'
import { FILTER_STYLES } from '../../config/constants'
import { ThumbnailPicker, ThumbnailPickerOption } from '../../ui-kits/selects'

const omittedKeys = ['name', 'label']

const StylesSelect = ({ name, value, category, onChange }) => {
  // chosen filter key
  const [ filterKey, changeFilterKey ] = useState()

  useEffect(() => {
    // define initial state when initial render, when it exist
    const defaultFilters = find(FILTER_STYLES, filters => {
      const omittedFilters = omit(filters, omittedKeys)
      const filterKeys = Object.keys(omittedFilters)

      // get the same field existed, and compare
      return isEqual(omittedFilters, pick(value, filterKeys))
    })

    // console.debug('defaultFilters', defaultFilters, value, FILTER_STYLES)
    // when default filters value found, use the name as filterKey
    if (defaultFilters) {
      changeFilterKey(defaultFilters.name)
    } else {
      changeFilterKey('none')
    }
  }, [JSON.stringify(value)])

  const handleChange = (_, itemValue) => {
    // update filterKey
    changeFilterKey(itemValue)

    // update value
    const selectedFilters = omit(find(FILTER_STYLES, { name: itemValue }), omittedKeys)
    onChange(name, selectedFilters)
  }

  return (
    <ThumbnailPicker name={name} value={filterKey} onChange={handleChange}>
      <ThumbnailPickerOption label='None' value='none'>
        <VisualFilterBagde id='vf-none' category={category} />
      </ThumbnailPickerOption>
      {
        FILTER_STYLES.map(filter => (
          <ThumbnailPickerOption
            key={filter.name}
            label={filter.label}
            value={filter.name}>
            <VisualFilterBagde id={`vf-${filter.name}`} category={category} filter={omit(filter, omittedKeys)} />
          </ThumbnailPickerOption>
        ))
      }
    </ThumbnailPicker>
  )
}

StylesSelect.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.object,
  category: PropTypes.string.isRequired,
  onChange: PropTypes.func
}

StylesSelect.defaultProps = {
  onChange: (name, value) => {}
}

export default StylesSelect
