import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames'
import ArrowLine from '@yesplz/core-web/ui-kits/icons/ArrowLine'
import SidebarMenuGroup from './SidebarMenuGroup'
import SidebarMenuItem from './SidebarMenuItem'
import TopsFilterMenu from './TopsFilterMenu'
import './SidebarMenu.scss'

class SidebarMenu extends PureComponent {
  static propTypes = {
    opened: PropTypes.bool,
    onClose: PropTypes.func,
    onCategoryChange: PropTypes.func.isRequired,
    onMenuGroupChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    opened: false,
    onClose: () => {}
  }

  constructor (props) {
    super(props)

    this.state = {
      activeGroupKey: 'main',
      activeMainMenuKey: 'home'
    }

    this.handleLinkClick = this.handleLinkClick.bind(this)
    this.changeCategory = this.changeCategory.bind(this)
    this.changeMenuGroup = this.changeMenuGroup.bind(this)
    this.resetMenuGroup = this.resetMenuGroup.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
  }

  handleLinkClick () {
    const { onClose } = this.props
    const scrollWrapper = document.getElementById('MainScroll')
    if (scrollWrapper) {
      scrollWrapper.scrollTop = 0
    }

    onClose()
  }

  changeCategory (categoryKey) {
    const { onCategoryChange, onClose } = this.props
    onCategoryChange(categoryKey)
    onClose()
  }

  changeMenuGroup (menuKey) {
    const { onMenuGroupChange } = this.props
    this.setState({ activeGroupKey: menuKey })
    onMenuGroupChange(menuKey)
  }

  resetMenuGroup () {
    const { onMenuGroupChange } = this.props
    this.setState({ activeGroupKey: 'main' })
    onMenuGroupChange('main')
  }

  handleFilterChange (category) {
    this.setState({
      activeMainMenuKey: category
    })
  }

  render () {
    const { opened } = this.props
    const { activeGroupKey, activeMainMenuKey } = this.state

    return (
      <div className={classNames('SidebarMenu', { 'is-opened': opened })}>
        <div className='SidebarMenu-back' onClick={this.resetMenuGroup}>
          <ArrowLine direction='left' />
        </div>
        <SidebarMenuGroup eventKey='main' activeKey={activeGroupKey}>
          <SidebarMenuItem eventKey='home' activeKey={activeMainMenuKey} to='/' onClick={this.handleLinkClick}>
            Home
          </SidebarMenuItem>
          {/* category menu */}
          <SidebarMenuItem eventKey='tops' activeKey={activeMainMenuKey} onClick={this.changeMenuGroup}>
            Tops
          </SidebarMenuItem>
          <SidebarMenuItem eventKey='pants' activeKey={activeMainMenuKey} onClick={this.changeMenuGroup}>
            Jeans
          </SidebarMenuItem>
          <SidebarMenuItem eventKey='shoes' activeKey={activeMainMenuKey} onClick={this.changeMenuGroup}>
            Shoes
          </SidebarMenuItem>
          {/* end of category menu */}
          <div className='SidebarMenu-separator' style={{ marginTop: 44 }} />
          <NavLink to='/favorites/items' onClick={this.handleLinkClick}>
            Favorites
          </NavLink>
          <div className='SidebarMenu-separator' style={{ marginBottom: 44 }} />
          <NavLink to='/profile' onClick={this.handleLinkClick}>
            Profile
          </NavLink>
          <NavLink to='/faq' onClick={this.handleLinkClick}>
            FAQ
          </NavLink>
        </SidebarMenuGroup>
        {/* tops menu */}
        <SidebarMenuGroup eventKey='tops' activeKey={activeGroupKey}>
          <TopsFilterMenu onFilterChange={this.handleFilterChange} />
        </SidebarMenuGroup>
        {/* pants menu */}
        <SidebarMenuGroup eventKey='pants' activeKey={activeGroupKey}>
          <p style={styles.menuNA}>Not Available</p>
        </SidebarMenuGroup>
        {/* shoes menu */}
        <SidebarMenuGroup eventKey='shoes' activeKey={activeGroupKey}>
          <p style={styles.menuNA}>Not Available</p>
        </SidebarMenuGroup>
      </div>
    )
  }
}

const styles = {
  menuNA: {
    color: 'inherit',
    fontWeight: 'bold',
    lineHeight: '1.4em',
    letterSpacing: '5.2px',
    textDecoration: 'none',
    textTransform: 'uppercase',
    paddingTop: '20px',
    paddingBottom: '20px',
    opacity: '0.3'
  }
}

export default SidebarMenu
