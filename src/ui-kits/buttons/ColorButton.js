import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './color-button.css'

export default class ColorButton extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    onClick: PropTypes.func
  }

  static defaultProps = {
    onClick: (name) => { console.debug('ColorButton - clicked', name) }
  }

  get handleClick () {
    const { name, onClick } = this.props
    return () => {
      onClick(name)
    }
  }

  render () {
    const { name, color } = this.props
    return (
      <button
        onClick={this.handleClick}
        className={`ColorButton ${name}`}
        style={{ backgroundColor: color, backgroundImage: color }}
      />
    )
  }
}
