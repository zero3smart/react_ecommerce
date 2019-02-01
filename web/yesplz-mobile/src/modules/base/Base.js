import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import LogoSrc from '@yesplz/core-web/assets/images/yesplz-logo.png'
import BurgerSvg from '@yesplz/core-web/assets/svg/burger.svg'
import SearchSvg from '@yesplz/core-web/assets/svg/search.svg'
import FavoritesSvg from '@yesplz/core-web/assets/svg/favorites.svg'
import { ProductFilter } from '@yesplz/core-web/modules/filters'
import { VisualFilter } from '@yesplz/core-models'
import history from '@yesplz/core-web/config/history'
import './base.css'

export default class Base extends Component {
  static propTypes = {
    children: PropTypes.element,
    location: PropTypes.object
  }

  componentDidMount () {
    // when onboarding active, show the tutorial page first
    if (VisualFilter.shouldShowOnboarding()) {
      history.push('/tutorial')
    }
  }

  get isProductDetailPage () {
    const { location } = this.props
    return /^\/products\//.test(location.pathname)
  }

  get isFavoritesPage () {
    const { location } = this.props
    return /^\/favorites\//.test(location.pathname)
  }

  get showVisualFilter () {
    const { location } = this.props
    return !(/^\/tutorial/.test(location.pathname))
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
          <div className='container Base-header-container'>
            <NavLink
              exact
              to={'/'}
              onClick={this.handleLinkClick}
              isActive={this.handleHomeLinkActive}
              className='logo'>
              <img src={LogoSrc} alt='YesPlz' />
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
        {this.showVisualFilter ? <ProductFilter /> : null}
      </div>
    )
  }
}
