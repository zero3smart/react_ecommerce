import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FabricFilters } from 'modules/filters'
import { BodyPart } from 'models'
import './preset.css'

export default class Preset extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    collar: PropTypes.number,
    coretype: PropTypes.number,
    details: PropTypes.number,
    neckline: PropTypes.number,
    pattern: PropTypes.number,
    shoulder: PropTypes.number,
    sleeveLength: PropTypes.number,
    solid: PropTypes.number,
    color: PropTypes.string,
    topLength: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func.isRequired
  }

  static defaultProps = {
    name: 'unknown',
    collar: 0,
    coretype: 0,
    details: 0,
    neckline: 0,
    pattern: 0,
    shoulder: 0,
    sleeveLength: 0,
    solid: 0,
    topLength: 0,
    color: null
  }

  get bodyPartFilters () {
    const { collar, coretype, neckline, shoulder, sleeveLength, topLength } = this.props
    return {
      collar, coretype, neckline, shoulder, sleeve_length: sleeveLength, top_length: topLength
    }
  }

  get fabricFilters () {
    const { details, pattern, solid, color } = this.props
    return { details, pattern, solid, color }
  }

  componentDidMount () {
    const { id } = this.props
    // initialize body part
    this.bodyPart = new BodyPart(`#${id}`, {
      defaultState: this.bodyPartFilters,
      disableEvent: true
    })
  }

  get handleClick () {
    const { onClick } = this.props
    return () => {
      const filters = {
        ...this.bodyPartFilters,
        ...this.fabricFilters
      }
      onClick(filters)
    }
  }

  render () {
    const { id, name, className, style } = this.props

    return (
      <div onClick={this.handleClick} className={classNames('Preset', { [className]: className })} style={style}>
        <h2>{name}</h2>
        <svg id={id} />
        <div className='Preset-filter'>
          <FabricFilters {...this.fabricFilters} disableEvent />
        </div>
      </div>
    )
  }
}
