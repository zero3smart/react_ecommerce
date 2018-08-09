import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import FilterPanel from './FilterPanel'
import FloatButton from './FloatButton'
import { history } from 'config/store'
import Transition from 'ui-kits/transitions/Transition'
import { fetchProducts } from 'ducks/products'
import { setFilter, syncFilter } from 'ducks/filters'
import './product-filter.css'

class ProductFilter extends Component {
  static propTypes = {
    filters: PropTypes.object,
    router: PropTypes.object,
    setFilter: PropTypes.func.isRequired,
    fetchProducts: PropTypes.func.isRequired,
    syncFilter: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  componentDidMount () {
    const { syncFilter } = this.props
    syncFilter()
  }

  get handleFilterToggle () {
    return () => {
      this.setState({
        expanded: !this.state.expanded
      })
    }
  }

  get handleFilterChange () {
    const { fetchProducts, setFilter } = this.props
    return (filters) => {
      // set filter to store
      setFilter(filters)
      // fetch products based selected filter
      fetchProducts(true)
      // if it's not in Tops page, redirect to Tops page
      if (this.props.router.location.pathname !== '/') {
        history.push('/')
      }
    }
  }

  render () {
    const { filters } = this.props
    const { expanded } = this.state
    return (
      <div className='ProductFilter'>
        <Transition timeout={{ enter: 100, exit: 300 }} show={expanded}>
          <FilterPanel filters={filters} onFilterChange={this.handleFilterChange} onClose={this.handleFilterToggle} />
        </Transition>
        <Transition timeout={{ enter: 100, exit: 1500 }} show={!expanded} transition='unstyled'>
          <FloatButton filters={filters} onClick={this.handleFilterToggle} />
        </Transition>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  filters: state.filters.data,
  router: state.router
})

export default connect(
  mapStateToProps,
  {
    fetchProducts,
    syncFilter,
    setFilter
  }
)(ProductFilter)
