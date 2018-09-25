import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './breadcrumbs.css'

export default class BreadCrumbs extends Component {
  static propTypes = {
    children: PropTypes.any,
    style: PropTypes.object
  }

  render () {
    const { children, style } = this.props

    return (
      <div className='BreadCrumbs' style={style}>
        <div className='container'>
          {children}
        </div>
      </div>
    )
  }
}
