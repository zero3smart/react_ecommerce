import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FabricFilters } from 'modules/filters'
import { VisualFilter } from 'models'
import { LikeButton } from 'ui-kits/buttons'
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
    this.bodyPart = new VisualFilter(`#${id}`, {
      defaultState: this.bodyPartFilters,
      disableEvent: true,
      hideThumbnail: true
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

  get toggleLike () {
    const { name, favorite, onToggleLike } = this.props
    return (e) => {
      e.preventDefault()
      e.stopPropagation()
      onToggleLike(name, !favorite)
    }
  }

  render () {
    const { id, name, className, favorite, style } = this.props

    return (
      <div onClick={this.handleClick} className={classNames('Preset', { [className]: className })} style={style}>
        <h2>{name}</h2>
        <div className='Preset-svg'>
          <LikeButton active={favorite} onClick={this.toggleLike} />
          <svg id={id} />
        </div>
        <div className='Preset-filter'>
          <FabricFilters {...this.fabricFilters} disableEvent />
        </div>
      </div>
    )
  }
}
