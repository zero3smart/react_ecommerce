import React from 'react'
import PropTypes from 'prop-types'
import './ThumbnailPicker.scss'

const ThumbnailPicker = ({ children, name, value, selectedStyle, onChange }) => {
  const managedChildren = React.Children.map(children, child => (
    React.cloneElement(child, {
      isActive: value === child.props.value,
      onClick: optionValue => onChange(name, optionValue)
    })
  ))

  return (
    <div className={`ThumbnailPicker ThumbnailPicker--${selectedStyle}`}>
      {managedChildren}
    </div>
  )
}

ThumbnailPicker.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  selectedStyle: PropTypes.oneOf(['full', 'half']),
  children: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired
}

export default ThumbnailPicker
