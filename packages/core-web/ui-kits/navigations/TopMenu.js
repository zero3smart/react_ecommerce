import React from 'react'
import PropTypes from 'prop-types'
import './top-menu.css'

const TopMenu = ({ children }) => (
  <div className='TopMenu'>
    <div className='container'>
      {children}
    </div>
  </div>
)

TopMenu.propTypes = {
  children: PropTypes.any
}

export default TopMenu
