import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './flat-banner.css'

export default class FlatBanner extends Component {
  static propTypes = {
    children: PropTypes.any,
    style: PropTypes.object
  }

  render () {
    const { children, style } = this.props

    return (
      <div className='FlatBanner' style={style}>
        {children}
      </div>
    )
  }
}
