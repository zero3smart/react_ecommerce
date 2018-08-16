import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { history } from 'config/store'
import { FilterPanel } from 'yesplz@modules/filters'
import { fetchProducts } from 'yesplz@ducks/products'
import { setFilter, syncFilter, syncFavoritePresets, saveFilterAsPreset, deleteFilterFromPreset } from 'yesplz@ducks/filters'
import { CUSTOM_PRESET_NAME } from 'yesplz@config/constants'
import { isFilterSavedSelector } from 'yesplz@modules/filters/selectors'
import './product-filter.css'

class ProductFilter extends Component {
  static propTypes = {
    filters: PropTypes.object,
    isFilterSaved: PropTypes.bool,
    router: PropTypes.object,
    setFilter: PropTypes.func.isRequired,
    fetchProducts: PropTypes.func.isRequired,
    syncFilter: PropTypes.func.isRequired,
    syncFavoritePresets: PropTypes.func.isRequired,
    saveFilterAsPreset: PropTypes.func.isRequired,
    deleteFilterFromPreset: PropTypes.func.isRequired
  }

  componentDidMount () {
    const { syncFilter, syncFavoritePresets } = this.props
    syncFilter()
    syncFavoritePresets()
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

  get isProductDetailPage () {
    const { router } = this.props
    return /^\/products\//.test(router.location.pathname)
  }

  get handleFilterLike () {
    const { saveFilterAsPreset, deleteFilterFromPreset } = this.props
    return (filters, favorite) => {
      if (favorite) {
        saveFilterAsPreset(filters, CUSTOM_PRESET_NAME)
      } else {
        deleteFilterFromPreset(CUSTOM_PRESET_NAME)
      }
    }
  }

  render () {
    const { filters, isFilterSaved } = this.props
    return (
      <div className='ProductFilter'>
        <FilterPanel
          favorite={isFilterSaved}
          filters={filters}
          onFilterChange={this.handleFilterChange}
          onFilterLike={this.handleFilterLike}
          closable={Boolean(false)}
          useVerticalThumb={Boolean(false)} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  filters: state.filters.data,
  isFilterSaved: isFilterSavedSelector(state, { customPresetName: CUSTOM_PRESET_NAME }),
  router: state.router
})

export default connect(
  mapStateToProps,
  {
    fetchProducts,
    syncFilter,
    syncFavoritePresets,
    setFilter,
    saveFilterAsPreset,
    deleteFilterFromPreset
  }
)(ProductFilter)

