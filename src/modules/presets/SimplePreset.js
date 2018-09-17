/**
 * SimplePreset
 * simple version of preset, only contain bodypart image and title
 */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { VisualFilter } from 'models'
import './simple-preset.css'

const filterProps = PropTypes.oneOfType([
  PropTypes.number, PropTypes.string
])

export default class SimplePreset extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    collar: filterProps,
    coretype: filterProps,
    details: filterProps,
    neckline: filterProps,
    pattern: filterProps,
    shoulder: filterProps,
    sleeveLength: filterProps,
    solid: filterProps,
    color: filterProps,
    topLength: filterProps,
    className: filterProps,
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
    color: null,
    favorite: false
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
    this.bodyPart = new VisualFilter(`#${id}`, {
      defaultState: this.bodyPartFilters,
      disableEvent: true,
      hideThumbnail: true,
      hideMiniOnboarding: true
    })
  }

  get handleClick () {
    const { name, onClick } = this.props
    return () => {
      const filters = {
        ...this.bodyPartFilters,
        ...this.fabricFilters
      }
      onClick(filters, name)
    }
  }

  render () {
    const { id, name, className, style } = this.props

    return (
      <div onClick={this.handleClick} className={classNames('SimplePreset', { [className]: className })} style={style}>
        <h5>{name}</h5>
        <div className='SimplePreset-svg'>
          <svg id={id} />
        </div>
      </div>
    )
  }
}
