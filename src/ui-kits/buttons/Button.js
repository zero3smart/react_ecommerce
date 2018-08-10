import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './button.css'

export default class Button extends Component {
  static propTypes = {
    to: PropTypes.string,
    children: PropTypes.string.isRequired
  }

  isExternal (url) {
    return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(url)
  }

  render () {
    const { to, children, ...otherProps } = this.props

    // if `to` not is defined, then we will use button as the component
    if (!to) {
      return (
        <button className='Button' {...otherProps}>
          {children}
        </button>
      )
    }

    // if `to` is defined, check wheter the url is external or internal
    // if external, use `<a />`, else use `react-router-dom <Link />`

    if (this.isExternal(to)) {
      return (
        <a href={to} className='Button' {...otherProps}>{children}</a>
      )
    } else {
      return (
        <Link to={to} className='Button' {...otherProps}>{children}</Link>
      )
    }
  }
}
