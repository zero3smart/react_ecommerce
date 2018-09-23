import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FabricFilters } from 'modules/filters'
import { VisualFilter } from 'models'
import { LikeButton } from 'ui-kits/buttons'
import './preset.css'

const filterProps = PropTypes.oneOfType([
  PropTypes.number, PropTypes.string
])

export default class Preset extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    presetKey: PropTypes.string,
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
    favorite: PropTypes.bool,
    style: PropTypes.object,
    onClick: PropTypes.func.isRequired,
    onToggleLike: PropTypes.func.isRequired
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
    this.bodyPart = new VisualFilter(`#${id}-svg`, {
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

  get toggleLike () {
    const { presetKey, name, favorite, onToggleLike } = this.props
    return (e) => {
      e.preventDefault()
      e.stopPropagation()

      const preset = {
        key: presetKey,
        name,
        ...this.bodyPartFilters,
        ...this.fabricFilters
      }

      onToggleLike(preset, !favorite)
    }
  }

  render () {
    const { id, name, className, favorite, style } = this.props

    return (
      <div id={id} onClick={this.handleClick} className={classNames('Preset', { [className]: className })} style={style}>
        <h2>{name}</h2>
        <div className='Preset-svg'>
          <LikeButton active={favorite} onClick={this.toggleLike} />
          <svg id={`${id}-svg`} />
        </div>
        <div className='Preset-filter'>
          <FabricFilters {...this.fabricFilters} disableEvent />
        </div>
      </div>
    )
  }
}
