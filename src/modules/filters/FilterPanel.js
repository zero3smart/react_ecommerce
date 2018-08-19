import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash-es/isEqual'
import closeSvgSrc from 'assets/svg/close.svg'
import FabricFilters from './FabricFilters'
import { VisualFilter } from 'models'
import { LikeButton } from 'ui-kits/buttons'
import './filter-panel.css'

export default class FilterPanel extends Component {
  static propTypes = {
    filters: PropTypes.object,
    favorite: PropTypes.bool,
    className: PropTypes.string,
    onFilterChange: PropTypes.func,
    onFilterLike: PropTypes.func,
    onClose: PropTypes.func,
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
    const { filters, useVerticalThumb } = this.props
    // initialize visual filter
    this.visualFilter = new VisualFilter('#VisualFilter', {
      defaultState: filters,
      onFilterChange: this.handleBodyPartFilter,
      onSVGLoaded: this.handleSVGLoaded,
      useVerticalThumb: useVerticalThumb
    })
  }

  componentDidUpdate (prevProps, prevState) {
    const { filters } = this.props
    const { svgLoaded } = this.state
    if (!isEqual(svgLoaded, prevState.svgLoaded) || !isEqual(filters, prevProps.filters)) {
      this.visualFilter.updateState(filters)
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
    const { favorite, onClose, className, closable } = this.props

    return (
      <div className={`FilterPanel ${className}`}>
        <LikeButton active={favorite} onClick={this.toggleLike} />
        {
          !closable ? null : (
            <div className='FilterPanel-close' onClick={onClose}>
              <img src={closeSvgSrc} alt='Close Filter' />
            </div>
          )
        }
        <svg id='VisualFilter' />
        <FabricFilters kind='inline' onChange={this.handleFabricFilter} {...this.fabricFilters} />
      </div>
    )
  }
}
