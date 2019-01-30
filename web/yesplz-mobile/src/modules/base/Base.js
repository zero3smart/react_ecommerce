import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import FavoritesSvg from '@yesplz/core-web/assets/svg/favorites.svg'
import { ProductFilter } from '@yesplz/core-web/modules/filters'
import { VisualFilter } from '@yesplz/core-models'
import history from '@yesplz/core-web/config/history'
import MenuButton from './MenuButton'
import SidebarMenu from './SidebarMenu'
import './base.css'

export default class Base extends Component {
  static propTypes = {
    children: PropTypes.element,
    location: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      menuOpened: true
    }
    this.toggleSidebarMenu = this.toggleSidebarMenu.bind(this)
    this.handleSidebarMenuClose = this.handleSidebarMenuClose.bind(this)
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

  toggleSidebarMenu () {
    const { menuOpened } = this.state
    this.setState({
      menuOpened: !menuOpened
    })
  }

  handleSidebarMenuClose () {
    this.setState({
      menuOpened: false
    })
  }

  render () {
    const { children } = this.props
    const { menuOpened } = this.state

    return (
      <div className='Base'>
        <div className='Base-header'>
          <div className='container Base-header-container'>
            <div style={styles.buttonMenuWrapper}>
              <MenuButton closeMode={menuOpened} onClick={this.toggleSidebarMenu} />
            </div>
            <NavLink
              exact
              to={'/'}
              onClick={this.handleLinkClick}
              isActive={this.handleHomeLinkActive}
              className='logo'>
              YESPLZ
            </NavLink>
            <NavLink
              to={this.isFavoritesPage ? '#' : '/favorites/clothing'}
              onClick={this.handleLinkClick}
              isActive={this.handleFavoritesLinkActive}
              className='menu-icon'>
              <img src={FavoritesSvg} alt='Favorites Page' />
            </NavLink>
          </div>
        </div>
        <SidebarMenu opened={menuOpened} onClose={this.handleSidebarMenuClose} />
        {children}
        {this.showVisualFilter ? <ProductFilter /> : null}
      </div>
    )
  }
}

const styles = {
  buttonMenuWrapper: {
    width: 40,
    height: 40,
    flexShrink: 0
  }
}
