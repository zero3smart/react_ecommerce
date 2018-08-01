/**
 * Tabs navigation for react-router's `NavLink`
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './tabs.css'

export default class Tabs extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element
    ]),
    style: PropTypes.object
  }

  render () {
    const { children, style } = this.props
    return (
      <div className='Tabs' style={style}>
        {manageChildren(children)}
      </div>
    )
  }
}

/**
 * define `activeClassName` to children
 * @param {Object[]} children
 * @returns {Object[]} managed children
 */
const manageChildren = (children) => (
  React.Children.map(children, (element) => (
    React.cloneElement(element, { activeClassName: 'active' })
  ))
)
