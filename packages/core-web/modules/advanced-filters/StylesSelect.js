import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import times from 'lodash/times'
import includes from 'lodash/includes'

import VisualFilterBagde from '../../ui-kits/visual-filters/VisualFilterBagde'
import { CATEGORY_TOPS, CATEGORY_SHOES, CATEGORY_PANTS } from '../../config/constants'
import { ThumbnailPicker, ThumbnailPickerOption } from '../../ui-kits/selects'

const StylesSelect = ({ name, value, category, lastBodyPart, config, onChange }) => {
  const [ bodyPartValue, changeBodyPartValue ] = useState()
  const currentBodyPart = includes(config.partList, lastBodyPart) ? lastBodyPart : config.partList[0]

  useEffect(() => {
    changeBodyPartValue(value[currentBodyPart])
  }, [currentBodyPart, value[currentBodyPart]])

  const handleChange = (_, itemValue) => {
    changeBodyPartValue(itemValue)

    onChange(name, {
      ...value,
      [currentBodyPart]: itemValue
    })
  }

  return (
    <ThumbnailPicker name={name} value={bodyPartValue} onChange={handleChange}>
      <ThumbnailPickerOption
        key={`vf-${currentBodyPart}-${0}`}
        label='None'
        value={0}>
        <VisualFilterBagde
          id={`vf-${currentBodyPart}-${0}`}
          category={category}
          defaultBodyPart={currentBodyPart}
          filter={{
            ...getDefaultFilters(category, currentBodyPart),
            [currentBodyPart]: 0
          }}
        />
      </ThumbnailPickerOption>
      {
        times(config.propMaxVal[currentBodyPart], index => {
          const itemValue = index + 1
          return (
            <ThumbnailPickerOption
              key={`vf-${currentBodyPart}-${itemValue}`}
              label={`${currentBodyPart}${itemValue}`}
              value={itemValue}>
              <VisualFilterBagde
                id={`vf-${currentBodyPart}-${itemValue}`}
                category={category}
                filter={{
                  ...getDefaultFilters(category, currentBodyPart, itemValue),
                  [currentBodyPart]: itemValue
                }}
                defaultBodyPart={currentBodyPart}
              />
            </ThumbnailPickerOption>
          )
        })
      }
    </ThumbnailPicker>
  )
}

StylesSelect.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
  category: PropTypes.string.isRequired,
  lastBodyPart: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  onChange: PropTypes.func
}

StylesSelect.defaultProps = {
  onChange: (name, value) => {}
}

const getDefaultFilters = (category, bodyPart, bodyPartValue) => {
  switch (category) {
    case CATEGORY_TOPS:
      return {
        coretype: bodyPart === 'top_length' ? 3 : 0,
        neckline: 0,
        shoulder: 0,
        sleeve_length: 0,
        top_length: 0
      }
    case CATEGORY_SHOES:
      return {
        toes: 0,
        covers: 0,
        counters: 0,
        bottoms: 0,
        shafts: 0
      }
    case CATEGORY_PANTS:
      return {
        rise: 0,
        thigh: includes(['knee', 'ankle'], bodyPart) ? 1 : 0,
        knee: bodyPart === 'ankle' ? (
          bodyPartValue === 0 || bodyPartValue === 3 ? 2 : 1
        ) : 0,
        ankle: 0
      }
    default:
      return {}
  }
}

export default StylesSelect
