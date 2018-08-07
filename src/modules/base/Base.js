import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import Tabs from 'ui-kits/navigations/Tabs'
import './base.css'

export default class Base extends Component {
  static propTypes = {
    children: PropTypes.element,
    location: PropTypes.object
  }

  get isProductDetailPage () {
    const { location } = this.props
    return /^\/products\//.test(location.pathname)
  }

  get handleHomeLinkActive () {
    return match => match || this.isProductDetailPage
  }

  render () {
    const { children } = this.props

    return (
      <div className='Base'>
        <Tabs>
          <NavLink exact to='/' isActive={this.handleHomeLinkActive}>
            {this.isProductDetailPage ? 'products' : 'tops'}
          </NavLink>
          <NavLink to='/presets'>presets</NavLink>
          <NavLink to='/favorites/clothing'>favorites</NavLink>
          <NavLink to='/feedbacks'>feedbacks</NavLink>
        </Tabs>
        {children}
      </div>
    )
  }
}
