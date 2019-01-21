import React from 'react'
import PropTypes from 'prop-types'
import './top-menu.css'

const TopMenu = ({ children, style }) => (
  <div className='TopMenu' style={style}>
    <div className='container'>
      {children}
    </div>
  </div>
)

TopMenu.propTypes = {
  children: PropTypes.any,
  style: PropTypes.object
}

export default TopMenu
