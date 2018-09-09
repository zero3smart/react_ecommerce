import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash-es/isEqual'
import SecondaryFilters from './SecondaryFilters'
import { VisualFilter } from 'models'
import { LikeButton, CloseButton } from 'ui-kits/buttons'
import './filter-panel.css'

export default class FilterPanel extends Component {
  static propTypes = {
    filters: PropTypes.object,
    favorite: PropTypes.bool,
    lastBodyPart: PropTypes.string,
    className: PropTypes.string,
    onFilterChange: PropTypes.func,
    onFilterLike: PropTypes.func,
    onClose: PropTypes.func,
    onBodyPartChange: PropTypes.func,
    useVerticalThumb: PropTypes.bool,
    closable: PropTypes.bool
  }

  static defaultProps = {
    filters: {},
    favorite: false,
    className: '',
    useVerticalThumb: true,
    closable: true,
    onFilterChange: (filters) => { console.debug('FilterPanel - filter changed', filters) },
    onFilterLike: (filters, favorite) => { console.debug('FilterPanel - filter like changed', filters, favorite) },
    onClose: () => { console.debug('FilterPanel - close button clicked') }
  }

  constructor (props) {
    super(props)
    this.state = {
      svgLoaded: false
    }
  }

  componentDidMount () {
    const { filters, useVerticalThumb, lastBodyPart, onBodyPartChange } = this.props
    // initialize visual filter
    this.visualFilter = new VisualFilter('#VisualFilter', {
      defaultState: filters,
      swipeable: true,
      onFilterChange: this.handleBodyPartFilter,
      onPropChange: onBodyPartChange,
      onSVGLoaded: this.handleSVGLoaded,
      useVerticalThumb: useVerticalThumb
    })

    this.visualFilter.setLastBodyPart(lastBodyPart)
  }

  componentDidUpdate (prevProps, prevState) {
    const { filters, lastBodyPart } = this.props
    const { svgLoaded } = this.state
    if (!isEqual(svgLoaded, prevState.svgLoaded) || !isEqual(filters, prevProps.filters)) {
      this.visualFilter.updateState(filters)
    }
    // when body part changed update visual filter lastBodyPart
    if (lastBodyPart !== prevProps.lastBodyPart) {
      this.visualFilter.setLastBodyPart(lastBodyPart)
    }
  }

  get handleSVGLoaded () {
    return () => {
      this.setState({
        svgLoaded: true
      })
    }
  }

  get fabricFilters () {
    const { details, pattern, solid, color } = this.props.filters
    return { details, pattern, solid, color }
  }

  get handleBodyPartFilter () {
    return (bodyPartFilters) => {
      const { filters, onFilterChange } = this.props
      onFilterChange({ ...filters, ...bodyPartFilters })
    }
  }

  get handleFabricFilter () {
    const { filters, onFilterChange } = this.props
    return (fabricFilters) => {
      onFilterChange({ ...filters, ...fabricFilters })
    }
  }

  get toggleLike () {
    const { filters, onFilterLike, favorite } = this.props
    return (e) => {
      e.preventDefault()
      e.stopPropagation()

      onFilterLike(filters, !favorite)
    }
  }

  render () {
    const { filters, favorite, onClose, className, closable } = this.props

    return (
      <div className={`FilterPanel ${className}`}>
        <LikeButton active={favorite} onClick={this.toggleLike} />
        {
          !closable ? null : (
            <div className='FilterPanel-close' onClick={onClose}>
              <CloseButton />
            </div>
          )
        }
        <svg id='VisualFilter' />
        <SecondaryFilters sale={filters.sale} fabricFilters={this.fabricFilters} onChange={this.handleFabricFilter} />
      </div>
    )
  }
}
