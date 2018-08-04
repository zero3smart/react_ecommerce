import React, { Component } from 'react'
import FilterPanel from './FilterPanel'
import FloatButton from './FloatButton'
import Transition from 'ui-kits/transitions/Transition'
import './product-filter.css'

export default class ProductFilter extends Component {
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

  componentDidMount () {

  }

  render () {
    const { expanded } = this.state
    return (
      <div className='ProductFilter'>
        <Transition show>
          {
            expanded ? (
              <FilterPanel onClose={this.handleFilterToggle} />
            ) : (
              <FloatButton onClick={this.handleFilterToggle} />
            )
          }
        </Transition>
      </div>
    )
  }
}
