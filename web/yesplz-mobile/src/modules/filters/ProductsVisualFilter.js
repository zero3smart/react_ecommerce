import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import CloseSvg from '@yesplz/core-web/assets/svg/close-black.svg'
import { FloatButton } from '@yesplz/core-web/modules/filters'
import { isFilterSavedSelector } from '@yesplz/core-web/modules/filters/selectors'
import Transition from '@yesplz/core-web/ui-kits/transitions/Transition'
import { fetchProducts } from '@yesplz/core-redux/ducks/products'
import { setFilter, syncFilter, syncFavoritePresets, saveFilterAsPreset, deleteFilterFromPreset, setLastBodyPart, toggleVisualFilter, setOnboarding } from '@yesplz/core-redux/ducks/filters'
import { CUSTOM_PRESET_NAME } from '@yesplz/core-web/config/constants'
import VisualFilterPanel from 'modules/filters/VisualFilterPanel'
import './ProductsVisualFilter.scss'

export class ProductsVisualFilter extends Component {
  static propTypes = {
    filters: PropTypes.object,
    isFilterSaved: PropTypes.bool,
    lastBodyPart: PropTypes.string,
    activeCategory: PropTypes.string,
    router: PropTypes.object,
    expanded: PropTypes.bool,
    hidden: PropTypes.bool,
    scrollBellowTheFold: PropTypes.bool,
    onboarding: PropTypes.bool,
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

  static defaultProps = {
    expanded: false,
    hidden: false,
    onboarding: false
  }

  componentDidMount () {
    const { syncFilter, syncFavoritePresets } = this.props
    syncFilter()
    syncFavoritePresets()
  }

  get handleFilterToggle () {
    const { expanded, toggleVisualFilter } = this.props
    return () => {
      toggleVisualFilter(!expanded)
    }
  }

  get handleFilterChange () {
    const { fetchProducts, setFilter } = this.props
    return (filters) => {
      // set filter to store
      setFilter(filters)
      // fetch products based selected filter
      fetchProducts(undefined, undefined, undefined, true)
      // set wrapper scrolltop to 0
      document.documentElement.scrollTop = 0
    }
  }

  get isProductDetailPage () {
    const { router } = this.props
    return /^\/products\/([a-z])+\/.+/.test(router.location.pathname)
  }

  get handleFilterLike () {
    const { activeCategory, saveFilterAsPreset, deleteFilterFromPreset } = this.props
    return (filters, favorite) => {
      const filtersWithCategory = {
        ...filters,
        category: activeCategory
      }

      if (favorite) {
        saveFilterAsPreset(filtersWithCategory, CUSTOM_PRESET_NAME)
      } else {
        deleteFilterFromPreset(filtersWithCategory, CUSTOM_PRESET_NAME)
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
    const {
      activeCategory, filters, scrollBellowTheFold, isFilterSaved, lastBodyPart,
      expanded, hidden, onboarding
    } = this.props

    return (
      <div
        className={classNames('ProductsVisualFilter', {
          allowHide: this.isProductDetailPage,
          pullDown: !scrollBellowTheFold,
          onboarding,
          expanded,
          'is-hidden': hidden,
          animated: !onboarding })}
      >
        <div className='ProductsVisualFilter-backdrop' onClick={this.handleFilterToggle} />
        <Transition
          timeout={{ enter: 100, exit: 300 }}
          transition='fadeInUp'
          show={expanded}
          disableUnmount // we need this, so it won't repeat svgs build. Increase framerate when opening VF.
        >
          <div className='ProductsVisualFilter-panelWrapper'>
            <div className='ProductsVisualFilter-header'>
              <div className='ProductsVisualFilter-close' onClick={this.handleFilterToggle}>
                <img src={CloseSvg} />
              </div>
            </div>
            <VisualFilterPanel
              category={activeCategory}
              favorite={isFilterSaved}
              filters={filters}
              lastBodyPart={lastBodyPart}
              onFilterChange={this.handleFilterChange}
              onFilterLike={this.handleFilterLike}
              onBodyPartChange={this.handleBodyPartChange}
              onFinishedOnboarding={this.handleFinishOnboarding} />
          </div>
        </Transition>
        <Transition timeout={{ enter: 100, exit: 100 }} show={!expanded} transition='fadeInUp'>
          <FloatButton category={activeCategory} onClick={this.handleFilterToggle} />
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
)(ProductsVisualFilter)
