import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './preset.css'

export default class Preset extends Component {
  static propTypes = {
    name: PropTypes.string,
    collar: PropTypes.number,
    coretype: PropTypes.number,
    details: PropTypes.number,
    neckline: PropTypes.number,
    pattern: PropTypes.number,
    shoulder: PropTypes.number,
    sleeveLength: PropTypes.number,
    solid: PropTypes.number,
    topLength: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object
  }

  static defaultProps = {
    PropTypes: 'unknown',
    collar: 0,
    coretype: 0,
    details: 0,
    neckline: 0,
    pattern: 0,
    shoulder: 0,
    sleeve_length: 0,
    solid: 0,
    topLength: 0
  }

  render () {
    const { name, className, style, ...filters } = this.props
    console.debug('filters', filters)
    return (
      <div className={classNames('Preset', { [className]: className })} style={style}>
        <h2>{name}</h2>
        test
      </div>
    )
  }
}
