import React, { Component } from 'react'
import PropTypes from 'prop-types'
import map from 'lodash-es/map'
import classNames from 'classnames'
import { FABRIC_COLORS } from 'config/constants'
import { ColorButton } from 'ui-kits/buttons'
import './color-pallete.css'

export default class ColorPallete extends Component {
  static propTypes = {
    onColorClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    style: PropTypes.object
  }

  render () {
    const { onColorClick, className, style } = this.props
    return (
      <div className={classNames('ColorPallete', { [className]: className })} style={style}>
        {
          map(FABRIC_COLORS, (color, name) => (
            <ColorButton key={name} name={name} color={color} onClick={onColorClick} />
          ))
        }
      </div>
    )
  }
}
