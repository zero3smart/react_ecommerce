import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { VisualFilter } from '@yesplz/core-models'
import './VisualFilterBagde.scss'

const VisualFilterBagde = ({ id, category, filter, viewBox, style }) => {
  useEffect(() => {
    // initialize visual filter
    (() => (
      new VisualFilter(`#${id}`, {
        category: category,
        defaultState: filter,
        customViewBox: viewBox,
        badgeMode: true,
        hideThumbnail: true
      })
    ))()
  }, [id])

  return (
    <button className='VisualFilterBagde' style={style}>
      <svg id={id} />
    </button>
  )
}

VisualFilterBagde.propTypes = {
  id: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  filter: PropTypes.object,
  viewBox: PropTypes.array,
  style: PropTypes.object
}

VisualFilterBagde.defaultProps = {
  filter: {
    coretype: 0,
    neckline: 1,
    shoulder: 1,
    sleeve_length: 0,
    top_length: 0,
    details: 0,
    pattern: 0,
    solid: 1,
    color: null,
    toes: 1,
    covers: 2,
    counters: 2,
    bottoms: 2,
    shafts: 4
  },
  viewBox: [90, 10, 130, 130]
}

export default VisualFilterBagde
