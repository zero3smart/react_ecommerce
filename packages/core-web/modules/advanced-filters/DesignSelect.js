import React from 'react'
import PropTypes from 'prop-types'
import reduce from 'lodash/reduce'
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
  // `valueKeys` will be array of `solid`, `pattern` or `details`
  const valueKeys = reduce(value, (acc, itemValue, itemKey) => {
    if (itemValue === 0) {
      return acc
    }
    return [...acc, itemKey]
  }, [])

  const handleChange = (_, updatedValueKeys) => {
    // return object exactly like the prop `value` pattern
    onChange(name, {
      // reset all value to 0
      ...reduce(value, (acc, _, key) => ({
        ...acc,
        [key]: 0
      }), {}),
      // set active value
      ...updatedValueKeys.reduce((acc, key) => ({
        ...acc,
        [key]: 1
      }), {})
    })
  }

  return (
    <ThumbnailPicker name={name} values={valueKeys} onChange={handleChange} selectedStyle='half'>
      <ThumbnailPickerOption label='Solid' value='solid' selectThenRemove='pattern'>
        <img src={SolidSvg} alt='Solid' />
      </ThumbnailPickerOption>
      <ThumbnailPickerOption label='Pattern' value='pattern' selectThenRemove='solid'>
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
