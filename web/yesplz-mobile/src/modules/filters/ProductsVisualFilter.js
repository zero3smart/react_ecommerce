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
import { CUSTOM_PRESET_NAME, CATEGORIES_LABELS, CATEGORY_TOPS } from '@yesplz/core-web/config/constants'
import VisualFilterPanel from 'modules/filters/VisualFilterPanel'
import ListView from 'modules/filters/ListView'
import CategoryPicker from 'ui-kits/navigations/CategoryPicker'
import './ProductsVisualFilter.scss'
import { withRouter } from 'react-router-dom'

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
    setOnboarding: PropTypes.func.isRequired,
    history: PropTypes.func,
    defaultColType: PropTypes.string,
    onColTypeChange: PropTypes.func,
    location: PropTypes.object,
    match: PropTypes.object
  }

  static defaultProps = {
    expanded: false,
    hidden: false,
    onboarding: false,
    defaultColType: 'signle'
  }

  constructor (props) {
    super(props)
    this.state = {
      isCategoryPickerVisible: false,
      colType: props.defaultColType
    }
    this.openCategoryPicker = this.openCategoryPicker.bind(this)
    this.closeCategoryPicker = this.closeCategoryPicker.bind(this)
  }

  componentDidMount () {
    const { syncFilter, syncFavoritePresets } = this.props
    syncFilter()
    syncFavoritePresets()
  }

  get handleFilterToggle () {
    const { expanded, toggleVisualFilter } = this.props
    if (expanded) {
      window.scrollTo(0, 0)
    }
    return () => {
      toggleVisualFilter(!expanded)
    }
  }

  onSearchPage = () => {
    const { match } = this.props
    const category = match.params.category || CATEGORY_TOPS
    this.props.history.push(`/products/${category}/list?listingView=double`)
    this.props.toggleVisualFilter(true)
  }

  get handleFilterChange () {
    const { fetchProducts, setFilter } = this.props
    return (filters) => {
      // set filter to store
      setFilter(filters)
      // fetch products based selected filter
      // fetchProducts(undefined, undefined, undefined, true)
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

  openCategoryPicker () {
    this.setState({
      isCategoryPickerVisible: true
    })
  }

  closeCategoryPicker () {
    this.setState({
      isCategoryPickerVisible: false
    })
  }

  onColTypeChange = (col) => {
    this.setState({
      colType: col
    })
    this.props.onColTypeChange(col)
  }

  get isListProductPage () {
    return () => {
      const { location } = this.props
      return /^\/products\/(wtop|wpants|wshoes)\/list$/.test(location.pathname)
    }
  }

  setCategory = (c) => {
    this.props.setFilter({ ...this.props.filters, category: c })
  }

  render () {
    const {
      activeCategory, filters, scrollBellowTheFold, isFilterSaved, lastBodyPart,
      expanded, hidden
    } = this.props
    const { isCategoryPickerVisible, colType } = this.state

    return (
      <div
        className={classNames('ProductsVisualFilter', {
          allowHide: this.isProductDetailPage,
          pullDown: !scrollBellowTheFold,
          // onboarding,
          expanded,
          'is-hidden': hidden,
          // animated: !onboarding
          animated: true })}
      >
        <div className='ProductsVisualFilter-backdrop' onClick={this.handleFilterToggle} />
        <Transition
          timeout={{ enter: 100, exit: 300 }}
          transition='fadeInUp'
          show={expanded}
        >
          <div className='ProductsVisualFilter-panelWrapper'>
            <div className='ProductsVisualFilter-header'>
              {/* <span style={{ width: 40 }} /> */}
              <ListView colType={colType} onChange={this.onColTypeChange} />
              <div
                onClick={this.openCategoryPicker}
                className={classNames('ProductsVisualFilter-categoryToggle', { 'is-active': isCategoryPickerVisible })}>
                {CATEGORIES_LABELS[activeCategory]}
              </div>
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
          {
            !this.isListProductPage() ? <FloatButton category={activeCategory} onClick={() => this.onSearchPage()} /> : <FloatButton category={activeCategory} onClick={this.handleFilterToggle} />
          }
        </Transition>
        <CategoryPicker
          isVisible={isCategoryPickerVisible}
          category={activeCategory}
          onClose={this.closeCategoryPicker}
          setCategory={this.setCategory}
          hideBackdrop
        />
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

export default withRouter(
  connect(
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
)
