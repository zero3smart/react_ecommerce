import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './filter-button.css'

export default class FilterButton extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onClick: PropTypes.func.isRequired,
    children: PropTypes.string,
    iconSrc: PropTypes.string,
    iconStyle: PropTypes.object,
    style: PropTypes.object
  }

  get handleClick () {
    const { name, value, onClick } = this.props
    return () => {
      onClick(value, name)
    }
  }

  render () {
    const { iconSrc, children, iconStyle, style } = this.props
    return (
      <div className='FilterButton' onClick={this.handleClick} style={style}>
        <div className='FilterButton-icon' style={iconStyle}>
          {iconSrc && <img src={iconSrc} alt={children} />}
        </div>
        <h5>{children}</h5>
      </div>
    )
  }
}
