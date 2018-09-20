import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import BurgerSvg from 'yesplz@assets/svg/burger.svg'
import SearchSvg from 'yesplz@assets/svg/search.svg'
import FavoritesSvg from 'yesplz@assets/svg/favorites.svg'
import FilterToggle from 'modules/filters/FilterToggle'
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
    return match => match // || this.isProductDetailPage
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
        <div className='Base-header'>
          <div className='Base-header-container'>
            <NavLink
              exact
              to={'/'}
              onClick={this.handleLinkClick}
              isActive={this.handleHomeLinkActive}
              className='logo'>
              YesPlz!
            </NavLink>
            <NavLink to='/products' onClick={this.handleLinkClick} className='menu-icon'>
              <img src={SearchSvg} alt='Visual Filter Page' />
            </NavLink>
            <NavLink
              to={this.isFavoritesPage ? '#' : '/favorites/clothing'}
              onClick={this.handleLinkClick}
              isActive={this.handleFavoritesLinkActive}
              className='menu-icon'>
              <img src={FavoritesSvg} alt='Favorites Page' />
            </NavLink>
            <NavLink
              to='/faq'
              onClick={this.handleLinkClick}
              className='menu-icon'>
              <img src={BurgerSvg} alt='FAQ Page' />
            </NavLink>
          </div>
        </div>
        {children}
        <FilterToggle />
      </div>
    )
  }
}
