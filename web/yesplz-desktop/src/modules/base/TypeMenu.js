import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import TopMenu from 'yesplz@ui-kits/navigations/TopMenu'

const TypeMenu = ({ style }) => (
  <TopMenu style={style}>
    <NavLink to='/tops'>Tops</NavLink>
    <NavLink to='/pants'>Jeans/Pants</NavLink>
    <NavLink to='/shoes'>Shoes</NavLink>
  </TopMenu>
)

TypeMenu.propTypes = {
  style: PropTypes.object
}

export default TypeMenu
