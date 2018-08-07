import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './float-button.css'

export default class FloatButton extends PureComponent {
  static propTypes = {
    children: PropTypes.any,
    onClick: PropTypes.func
  }

  render () {
    const { children, onClick } = this.props
    return (
      <div className='FloatButton' onClick={onClick}>
        {children}
      </div>
    )
  }
}
