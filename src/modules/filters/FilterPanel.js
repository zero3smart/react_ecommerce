import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash-es/isEqual'
import closeSvgSrc from 'assets/svg/close.svg'
import FabricFilters from './FabricFilters'
import { VisualFilter } from 'models'
import './filter-panel.css'

export default class FilterPanel extends PureComponent {
  static propTypes = {
    filters: PropTypes.object,
    className: PropTypes.string,
    onFilterChange: PropTypes.func,
    onClose: PropTypes.func
  }

  static defaultProps = {
    filters: {},
    className: '',
    onFilterChange: (filters) => { console.debug('FilterPanel - filter changed', filters) },
    onClose: () => { console.debug('FilterPanel - close button clicked') }
  }

  constructor (props) {
    super(props)
    this.state = {
      svgLoaded: false
    }
  }

  componentDidMount () {
    const { filters } = this.props
    // initialize visual filter
    this.visualFilter = new VisualFilter('#VisualFilter', {
      defaultState: filters,
      onFilterChange: this.handleBodyPartFilter,
      useVerticalThumb: true
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
    const { filters, onFilterChange } = this.props
    return (bodyPartFilters) => {
      onFilterChange({ ...filters, ...bodyPartFilters })
    }
  }

  get handleFabricFilter () {
    const { filters, onFilterChange } = this.props
    return (fabricFilters) => {
      onFilterChange({ ...filters, ...fabricFilters })
    }
  }

  render () {
    const { onClose, className } = this.props

    return (
      <div className={`FilterPanel ${className}`}>
        <div className='FilterPanel-close' onClick={onClose}>
          <img src={closeSvgSrc} alt='Close Filter' />
        </div>
        <svg id='VisualFilter' />
        <FabricFilters kind='inline' onChange={this.handleFabricFilter} {...this.fabricFilters} />
      </div>
    )
  }
}
