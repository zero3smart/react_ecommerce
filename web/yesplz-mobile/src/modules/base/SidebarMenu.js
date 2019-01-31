import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'
import classNames from 'classnames'
import './SidebarMenu.scss'

class SidebarMenu extends PureComponent {
  static propTypes = {
    opened: PropTypes.bool,
    onClose: PropTypes.func,
    onCategoryChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    opened: false,
    onClose: () => {}
  }

  constructor (props) {
    super(props)

    this.handleLinkClick = this.handleLinkClick.bind(this)
    this.changeCategory = this.changeCategory.bind(this)
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

  render () {
    const { opened } = this.props

    return (
      <div className={classNames('SidebarMenu', { 'is-opened': opened })}>
        <PerfectScrollbar className='SidebarMenu-group'>
          <NavLink to='/' onClick={this.handleLinkClick} className='is-primary'>
            Home
          </NavLink>
          {/* category menu */}
          <a href='javascript:void(0)' onClick={() => this.changeCategory('wtop')}>
            Tops
          </a>
          <a href='javascript:void(0)' onClick={() => this.changeCategory('wpants')}>
            Jeans
          </a>
          <a href='javascript:void(0)' onClick={() => this.changeCategory('wshoes')}>
            Shoes
          </a>
          {/* end of category menu */}
          <div className='SidebarMenu-separator' style={{ marginTop: 44 }} />
          <NavLink to='/favorites' onClick={this.handleLinkClick}>
            Favorites
          </NavLink>
          <div className='SidebarMenu-separator' style={{ marginBottom: 44 }} />
          <NavLink to='/profile' onClick={this.handleLinkClick}>
            Profile
          </NavLink>
          <NavLink to='/faq' onClick={this.handleLinkClick}>
            FAQ
          </NavLink>
        </PerfectScrollbar>
      </div>
    )
  }
}

export default SidebarMenu
