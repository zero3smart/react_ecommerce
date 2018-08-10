import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './color-button.css'

export default class ColorButton extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    active: PropTypes.bool,
    onClick: PropTypes.func
  }

  static defaultProps = {
    active: false,
    onClick: (name) => { console.debug('ColorButton - clicked', name) }
  }

  get handleClick () {
    const { name, onClick } = this.props
    return () => {
      onClick(name)
    }
  }

  render () {
    const { name, color, active } = this.props
    return (
      <button
        onClick={this.handleClick}
        className={classNames('ColorButton', { [name]: name, active })}
        style={{ backgroundColor: color, backgroundImage: color }}
      />
    )
  }
}
