import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './button.css'

export default class Button extends Component {
  static propTypes = {
    to: PropTypes.string,
    children: PropTypes.string.isRequired
  }

  render () {
    const { to, children, ...otherProps } = this.props

    // if `to` is defined, then we will use link as its wrapper
    if (to) {
      return (
        <Link to={to} className='Button' {...otherProps}>{children}</Link>
      )
    }

    return (
      <button className='Button' {...otherProps}>
        {children}
      </button>
    )
  }
}
