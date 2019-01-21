import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TopMenu from 'yesplz@ui-kits/navigations/TopMenu'
import CategoryDivisorSrc from './category-divisor.png'
import { Button } from 'yesplz@ui-kits/buttons'
import './filter-menu.css'

class FilterMenu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hoveredItem: ''
    }
    this.closeDropdown = this.closeDropdown.bind(this)
  }

  handleMenuHover (itemKey) {
    console.debug('hover', itemKey)
    this.setState({
      hoveredItem: itemKey
    })
  }

  closeDropdown () {
    console.debug('mouse leave')
    this.setState({
      hoveredItem: ''
    })
  }

  render () {
    const { hoveredItem } = this.state
    const { style } = this.props
    return (
      <TopMenu className='FilterMenu' style={style} onMouseLeave={this.closeDropdown}>
        <div className='FilterMenu-item' onMouseEnter={() => { this.handleMenuHover('tops') }}>Tops</div>
        <div className='FilterMenu-item' onMouseEnter={() => { this.handleMenuHover('pants') }}>Jeans/Pants</div>
        <div className='FilterMenu-item' onMouseEnter={() => { this.handleMenuHover('shoes') }}>Shoes</div>
        {renderMenuDropdown(hoveredItem)}
      </TopMenu>
    )
  }
}

FilterMenu.propTypes = {
  style: PropTypes.object
}

const renderMenuDropdown = (itemKey) => {
  switch (itemKey) {
    case 'tops':
      return <MenuDropdown title='Tops' />
    case 'pants':
      return <MenuDropdown title='Pants' />
    case 'shoes':
      return <MenuDropdown title='Shoes' />
  }
}

/**
 * @todo: dummy still need refactor
 */
const MenuDropdown = ({ title }) => (
  <div className='FilterMenu-dropdown animated fadeIn' style={styles.filterMenuDropdown}>
    <div className='container-wide'>
      <div className='FilterMenu-list'>
        <h5>{title}</h5>
        <ul>
          <li>turinics</li>
          <li>tank tops</li>
          <li>tank tops</li>
          <li>turinics item 1</li>
          <li className='is-active'>turinics</li>
          <li>tank tops</li>
          <li>turinics item 5</li>
          <li>turinics item</li>
          <li>turinics</li>
          <li>tank tops</li>
          <li>all tops</li>
        </ul>
      </div>
      <div className='FilterMenu-rightCol'>
        <img src={CategoryDivisorSrc} className='FilterMenu-categoryDivisor' />
        <div className='FilterMenu-filterCategories'>
          <div className='FilterMenu-list'>
            <h5>Occassions</h5>
            <ul>
              <li>work</li>
              <li className='is-active'>casual</li>
              <li>workout</li>
            </ul>
          </div>
          <div className='FilterMenu-list'>
            <h5>Sales</h5>
            <ul>
              <li>30%</li>
              <li>50%</li>
              <li>70%</li>
            </ul>
          </div>
          <div className='FilterMenu-list'>
            <h5>Prices</h5>
            <ul>
              <li>-$50</li>
              <li className='is-active'>$50 - $100</li>
              <li>$100 - $150</li>
              <li>$150 - $200</li>
              <li>$200 - $300</li>
            </ul>
          </div>
          <div className='FilterMenu-list'>
            <h5>Sizes</h5>
            <ul>
              <li>regular</li>
              <li className='is-active'>plus</li>
              <li>petite</li>
              <li>my sizes!</li>
            </ul>
          </div>
        </div>
        <div className='FilterMenu-buttonWrapper'>
          <Button className='ButtonTertiary'>Clear</Button>
          <Button className='ButtonTertiary'>Filter</Button>
        </div>
      </div>
    </div>
  </div>
)

MenuDropdown.propTypes = {
  title: PropTypes.string
}

const styles = {
  filterMenuDropdown: {
    animationDuration: '500ms'
  }
}

export default FilterMenu
