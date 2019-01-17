import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import FilterPanel from './FilterPanel'
import FloatButton from './FloatButton'
import { history } from 'config/store'
import Transition from '@yesplz/core-web/ui-kits/transitions/Transition'
import { fetchProducts } from 'ducks/products'
import { setFilter, syncFilter, syncFavoritePresets, saveFilterAsPreset, deleteFilterFromPreset, setLastBodyPart, toggleVisualFilter, setOnboarding } from 'ducks/filters'
import { isFilterSavedSelector } from './selectors'
import { CUSTOM_PRESET_NAME } from 'config/constants'
import './product-filter.css'

export class ProductFilter extends Component {
  static propTypes = {
    filters: PropTypes.object,
    isFilterSaved: PropTypes.bool,
    lastBodyPart: PropTypes.string,
    router: PropTypes.object,
    expanded: PropTypes.bool,
    scrollBellowTheFold: PropTypes.bool,
    onboarding: PropTypes.bool,
    hideMiniOnboarding: PropTypes.bool,
    useVerticalThumb: PropTypes.bool,
    setFilter: PropTypes.func.isRequired,
    fetchProducts: PropTypes.func.isRequired,
    syncFilter: PropTypes.func.isRequired,
    syncFavoritePresets: PropTypes.func.isRequired,
    saveFilterAsPreset: PropTypes.func.isRequired,
    deleteFilterFromPreset: PropTypes.func.isRequired,
    setLastBodyPart: PropTypes.func.isRequired,
    toggleVisualFilter: PropTypes.func.isRequired,
    setOnboarding: PropTypes.func.isRequired
  }

  componentDidMount () {
    const { syncFilter, syncFavoritePresets } = this.props
    syncFilter()
    syncFavoritePresets()
  }

  get handleFilterToggle () {
    const { expanded, router, toggleVisualFilter } = this.props
    return () => {
      // will move to products page when clicking on the visual filter button
      if (router.location.pathname !== '/products') {
        history.push('/products')
      } else {
        toggleVisualFilter(!expanded)
      }
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
      // if (this.props.router.location.pathname !== '/products') {
      //   history.push('/products')
      // }
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
        deleteFilterFromPreset(filters, CUSTOM_PRESET_NAME)
      }
    }
  }

  get handleBodyPartChange () {
    const { setLastBodyPart } = this.props
    return (bodyPart) => {
      setLastBodyPart(bodyPart)
    }
  }

  get handleFinishOnboarding () {
    const { setOnboarding } = this.props
    return () => {
      setOnboarding(false)
    }
  }

  render () {
    const { filters, scrollBellowTheFold, isFilterSaved, lastBodyPart, expanded, onboarding, hideMiniOnboarding, useVerticalThumb } = this.props

    return (
      <div
        className={classNames('ProductFilter', {
          allowHide: this.isProductDetailPage,
          pullDown: !scrollBellowTheFold,
          onboarding,
          expanded,
          animated: !onboarding })}
      >
        <Transition timeout={{ enter: 100, exit: 300 }} show={expanded}>
          <FilterPanel
            favorite={isFilterSaved}
            filters={filters}
            lastBodyPart={lastBodyPart}
            hideMiniOnboarding={hideMiniOnboarding}
            useVerticalThumb={useVerticalThumb}
            onFilterChange={this.handleFilterChange}
            onClose={this.handleFilterToggle}
            onFilterLike={this.handleFilterLike}
            onBodyPartChange={this.handleBodyPartChange}
            onFinishedOnboarding={this.handleFinishOnboarding} />
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
  router: state.router,
  expanded: state.filters.expanded,
  onboarding: state.filters.onboarding
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
    setLastBodyPart,
    toggleVisualFilter,
    setOnboarding
  }
)(ProductFilter)
