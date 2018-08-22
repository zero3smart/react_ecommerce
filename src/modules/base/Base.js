import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import Tabs from 'ui-kits/navigations/Tabs'
import { ProductFilter } from 'modules/filters'
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

  get isFavoritesPage () {
    const { location } = this.props
    return /^\/favorites\//.test(location.pathname)
  }

  get handleHomeLinkActive () {
    return match => match || this.isProductDetailPage
  }

  get handleFavoritesLinkActive () {
    return () => {
      const { location } = this.props
      return /^\/favorites\/(fits|clothing)$/.test(location.pathname)
    }
  }

  get handleLinkClick () {
    return () => {
      const scrollWrapper = document.getElementById('MainScroll')
      if (scrollWrapper) {
        scrollWrapper.scrollTop = 0
      }
    }
  }

  render () {
    const { children } = this.props

    return (
      <div className='Base'>
        <Tabs>
          <NavLink
            exact
            to={this.isProductDetailPage ? '#' : '/'}
            onClick={this.handleLinkClick}
            isActive={this.handleHomeLinkActive}>
            tops
          </NavLink>
          <NavLink to='/presets' onClick={this.handleLinkClick}>presets</NavLink>
          <NavLink
            to={this.isFavoritesPage ? '#' : '/favorites/clothing'}
            onClick={this.handleLinkClick}
            isActive={this.handleFavoritesLinkActive}>
            favorites
          </NavLink>
          <NavLink to='/feedbacks' onClick={this.handleLinkClick}>feedbacks</NavLink>
        </Tabs>
        {children}
        <ProductFilter />
      </div>
    )
  }
}