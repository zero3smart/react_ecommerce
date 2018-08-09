import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FilterPanel from './FilterPanel'
import FloatButton from './FloatButton'
import Transition from 'ui-kits/transitions/Transition'
import './product-filter.css'

export default class ProductFilter extends Component {
  static propTypes = {
    filters: PropTypes.object,
    onFilterChange: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  get handleFilterToggle () {
    return () => {
      this.setState({
        expanded: !this.state.expanded
      })
    }
  }

  render () {
    const { filters, onFilterChange } = this.props
    const { expanded } = this.state
    return (
      <div className='ProductFilter'>
        <Transition timeout={{ enter: 100, exit: 300 }} show={expanded}>
          <FilterPanel filters={filters} onFilterChange={onFilterChange} onClose={this.handleFilterToggle} />
        </Transition>
        <Transition timeout={{ enter: 100, exit: 1500 }} show={!expanded} transition='unstyled'>
          <FloatButton filters={filters} onClick={this.handleFilterToggle} />
        </Transition>
      </div>
    )
  }
}
