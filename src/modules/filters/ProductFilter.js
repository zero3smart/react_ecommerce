import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FilterPanel from './FilterPanel'
import FloatButton from './FloatButton'
import Transition from 'ui-kits/transitions/Transition'
import './product-filter.css'

export default class ProductFilter extends Component {
  static propTypes = {
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
    const { onFilterChange } = this.props
    const { expanded } = this.state
    return (
      <div className='ProductFilter'>
        <Transition show>
          {
            expanded ? (
              <FilterPanel onFilterChange={onFilterChange} onClose={this.handleFilterToggle} />
            ) : (
              <FloatButton onClick={this.handleFilterToggle} />
            )
          }
        </Transition>
      </div>
    )
  }
}
