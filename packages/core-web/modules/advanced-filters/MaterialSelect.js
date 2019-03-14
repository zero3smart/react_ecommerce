import React from 'react'
import PropTypes from 'prop-types'
import { ThumbnailPicker, ThumbnailPickerOption } from '../../ui-kits/selects'
import MaterialCottonPng from '../../assets/images/material-cotton.png'
import MaterialSilkPng from '../../assets/images/material-silk.png'
import MaterialWrinkleFreePng from '../../assets/images/material-wrinkle-free.png'

const MaterialSelect = ({ name, value, onChange }) => (
  <ThumbnailPicker name={name} value={value} onChange={onChange} selectedStyle='half' canUnselect>
    <ThumbnailPickerOption label='Material Cotton' value='cotton'>
      <img src={MaterialCottonPng} alt='Material Cotton' />
    </ThumbnailPickerOption>
    <ThumbnailPickerOption label='Silk' value='silk'>
      <img src={MaterialSilkPng} alt='material-silk' />
    </ThumbnailPickerOption>
    <ThumbnailPickerOption label='Wrinkle Free' value='wrinkle-free'>
      <img src={MaterialWrinkleFreePng} alt='Wrinkle Free' />
    </ThumbnailPickerOption>
  </ThumbnailPicker>
)

MaterialSelect.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func
}

MaterialSelect.defaultProps = {
  onChange: (name, value) => {}
}

export default MaterialSelect
