import React from 'react'
import PropTypes from 'prop-types'
import reduce from 'lodash/reduce'
import findKey from 'lodash/findKey'
import { ThumbnailPicker, ThumbnailPickerOption } from '../../ui-kits/selects'
import SolidSvg from '../../assets/svg/design-solid.svg'
import DetailSvg from '../../assets/svg/design-detail.svg'
import PatternSvg from '../../assets/svg/design-pattern.svg'

/**
 * `DesignSelect` should process object as its `value`,
 * and use 1/0 as selected state for its fields.
 * (see default props)
 */
const DesignSelect = ({ name, value, onChange }) => {
  // `valueKey` will be `solid`, `pattern` or `details`
  const valueKey = findKey(value, itemValue => itemValue === 1)

  const handleChange = (_, selectedItemValue) => {
    // return object exactly like the prop `value` pattern
    const updatedValue = reduce(value, (filters, _, itemKey) => ({
      ...filters,
      [itemKey]: itemKey === selectedItemValue ? 1 : 0
    }), {})

    onChange(name, updatedValue)
  }

  return (
    <ThumbnailPicker name={name} value={valueKey} onChange={handleChange} selectedStyle='half'>
      <ThumbnailPickerOption label='Solid' value='solid'>
        <img src={SolidSvg} alt='Solid' />
      </ThumbnailPickerOption>
      <ThumbnailPickerOption label='Pattern' value='pattern'>
        <img src={PatternSvg} alt='Pattern' />
      </ThumbnailPickerOption>
      <ThumbnailPickerOption label='Detail' value='details'>
        <img src={DetailSvg} alt='Detail' />
      </ThumbnailPickerOption>
    </ThumbnailPicker>
  )
}

DesignSelect.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.object,
  onChange: PropTypes.func
}

DesignSelect.defaultProps = {
  value: {
    solid: 0,
    pattern: 0,
    detail: 0
  },
  onChange: (name, value) => {}
}

export default DesignSelect
