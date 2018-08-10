import React, { Component } from 'react'
import PropTypes from 'prop-types'
import map from 'lodash-es/map'
import without from 'lodash-es/without'
import includes from 'lodash-es/includes'
import classNames from 'classnames'
import { FABRIC_COLORS } from 'config/constants'
import { ColorButton } from 'ui-kits/buttons'
import './color-pallete.css'

export default class ColorPallete extends Component {
  static propTypes = {
    values: PropTypes.array,
    onColorClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    style: PropTypes.object
  }

  static defaultProps = {
    values: []
  }

  constructor (props) {
    super(props)
    this.state = {
      values: []
    }
  }

  componentDidMount () {
    const { values } = this.props
    this.setState({ values })
  }

  get handleClick () {
    const { onColorClick } = this.props
    const { values } = this.state
    return (name) => {
      const colorPicked = values.indexOf(name) > -1
      let newValues = null
      // if color picked, remove it from the picked list
      // else, addit to the picked list
      if (colorPicked) {
        newValues = without(values, name)
      } else {
        newValues = [ ...values, name ]
      }

      console.debug('newValues', values, name, newValues)
      this.setState({
        values: newValues
      })

      onColorClick(newValues)
    }
  }

  render () {
    const { values, className, style } = this.props
    return (
      <div className={classNames('ColorPallete', { [className]: className })} style={style}>
        {
          map(FABRIC_COLORS, (color, name) => (
            <ColorButton active={includes(values, name)} key={name} name={name} color={color} onClick={this.handleClick} />
          ))
        }
      </div>
    )
  }
}
