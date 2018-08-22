import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import isNil from 'lodash-es/isNil'
import FilterPanel from './FilterPanel'
import FloatButton from './FloatButton'
import { history } from 'config/store'
import Transition from 'ui-kits/transitions/Transition'
import { fetchProducts } from 'ducks/products'
import { setFilter, syncFilter, syncFavoritePresets, saveFilterAsPreset, deleteFilterFromPreset, setLastBodyPart } from 'ducks/filters'
import { isFilterSavedSelector } from './selectors'
import { CUSTOM_PRESET_NAME } from 'config/constants'
import './product-filter.css'

class ProductFilter extends Component {
  static propTypes = {
    filters: PropTypes.object,
    isFilterSaved: PropTypes.bool,
    lastBodyPart: PropTypes.string,
    router: PropTypes.object,
    scrollBellowTheFold: PropTypes.bool,
    setFilter: PropTypes.func.isRequired,
    fetchProducts: PropTypes.func.isRequired,
    syncFilter: PropTypes.func.isRequired,
    syncFavoritePresets: PropTypes.func.isRequired,
    saveFilterAsPreset: PropTypes.func.isRequired,
    deleteFilterFromPreset: PropTypes.func.isRequired,
    setLastBodyPart: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      expanded: isNil(window.localStorage.getItem('onboarding_completed')) || false
    }
  }

  componentDidMount () {
    const { syncFilter, syncFavoritePresets } = this.props
    syncFilter()
    syncFavoritePresets()
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
      // set wrapper scrolltop to 0
      const scrollWrapper = document.getElementById('MainScroll')
      if (scrollWrapper) {
        scrollWrapper.scrollTop = 0
      }
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

  get handleBodyPartChange () {
    const { setLastBodyPart } = this.props
    return (bodyPart) => {
      setLastBodyPart(bodyPart)
    }
  }

  render () {
    const { filters, scrollBellowTheFold, isFilterSaved, lastBodyPart } = this.props
    const { expanded } = this.state

    return (
      <div className={classNames('ProductFilter animated', { allowHide: this.isProductDetailPage, pullDown: !scrollBellowTheFold })}>
        <Transition timeout={{ enter: 100, exit: 300 }} show={expanded}>
          <FilterPanel
            favorite={isFilterSaved}
            filters={filters}
            lastBodyPart={lastBodyPart}
            onFilterChange={this.handleFilterChange}
            onClose={this.handleFilterToggle}
            onFilterLike={this.handleFilterLike}
            onBodyPartChange={this.handleBodyPartChange} />
        </Transition>
        <Transition timeout={{ enter: 100, exit: 1500 }} show={!expanded} transition='unstyled'>
          <FloatButton filters={filters} onClick={this.handleFilterToggle} />
        </Transition>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  filters: state.filters.data,
  isFilterSaved: isFilterSavedSelector(state, { customPresetName: CUSTOM_PRESET_NAME }),
  lastBodyPart: state.filters.lastBodyPart,
  scrollBellowTheFold: state.product.scrollBellowTheFold,
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
    deleteFilterFromPreset,
    setLastBodyPart
  }
)(ProductFilter)
