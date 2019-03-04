import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import CheckSvg from '../../assets/svg/check.svg'
import './ThumbnailPickerOption.scss'

const ThumbnailPickerOption = ({ value, label, children, style, isActive, onClick }) => (
  <div className={classNames('ThumbnailPickerOption', { 'is-active': isActive })} style={style} onClick={() => onClick(value)}>
    <div className='ThumbnailPickerOption-thumbnail'>
      <div className='ThumbnailPickerOption-imageWrapper'>
        {children}
        {isActive && <img src={CheckSvg} alt='Picker Selected' className='ThumbnailPickerOption-thumbnailSelectedIcon' />}  
      </div>
    </div>
    <h5>{label}</h5>
  </div>
)

ThumbnailPickerOption.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  style: PropTypes.object,
  isActive: PropTypes.bool,
  onClick: PropTypes.func
}

export default ThumbnailPickerOption
