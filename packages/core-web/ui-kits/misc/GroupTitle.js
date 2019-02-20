import React from 'react'
import PropTypes from 'prop-types'
import ArrowLine from '../icons/ArrowLine'
import './GroupTitle.scss'

const GroupTitle = ({ children }) => (
  <h4 className='GroupTitle'>{children} <ArrowLine width='20px' height='20px' /></h4>
)

GroupTitle.propTypes = {
  children: PropTypes.string.isRequired
}

export default GroupTitle
