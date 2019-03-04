import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import queryString from 'query-string'
import includes from 'lodash/includes'
import findKey from 'lodash/findKey'

import history from '@yesplz/core-web/config/history'
import { CATEGORY_TOPS, CATEGORY_SHOES, CATEGORY_PANTS, CATEGORIES_LABELS } from '@yesplz/core-web/config/constants'
import { withTrackingProvider } from '@yesplz/core-web/hoc'
import MobilePicker from '@yesplz/core-web/ui-kits/selects/MobilePicker'
import { PageTitle } from '@yesplz/core-web/ui-kits/misc'

import { Products, ProductsFilter } from 'modules/products'
import ProductsVisualFilter from 'modules/filters/ProductsVisualFilter'
import { NotFound } from 'modules/base'
import './ProductsPage.scss'

class ProductsPage extends PureComponent {
  static propTypes = {
    match: PropTypes.object,
    location: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      categorySwitchOpened: false,
      valueGroups: {
        category: CATEGORIES_LABELS[props.match.params.category || CATEGORY_TOPS]
      },
      isFilterVisible: false,
      useTwoColumnsView: false
    }
    this.handleTitleClick = this.handleTitleClick.bind(this)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
    this.handleCategoryPick = this.handleCategoryPick.bind(this)
    this.handleClosePicker = this.handleClosePicker.bind(this)
    this.handleFilterButtonClick = this.handleFilterButtonClick.bind(this)
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this)
    this.handleCloseFilter = this.handleCloseFilter.bind(this)
  }

  get currentCategory () {
    const { match } = this.props
    return match.params.category || CATEGORY_TOPS
  }

  get optionGroups () {
    return {
      category: [
        'Tops',
        'Jeans',
        'Shoes'
      ]
    }
  }

  get listingView () {
    const { location } = this.props
    const qsValues = queryString.parse(location.search)

    return qsValues.listingView
  }

  componentDidMount () {
    this.setState({
      useTwoColumnsView: this.listingView === 'double'
    })
  }

  // Update the value in response to user picking event
  handleCategoryChange (name, value) {
    this.setState(({valueGroups}) => ({
      valueGroups: {
        ...valueGroups,
        [name]: value
      }
    }))
  }

  handleTitleClick () {
    const { categorySwitchOpened } = this.state
    this.setState({
      categorySwitchOpened: !categorySwitchOpened
    })
  }

  handleCategoryPick () {
    const { valueGroups } = this.state
    const categoryKey = findKey(CATEGORIES_LABELS, label => label === valueGroups.category)

    history.push(`/products/${categoryKey}`)
    this.handleClosePicker()
  }

  handleClosePicker () {
    this.setState({
      categorySwitchOpened: false
    })
  }

  handleFilterButtonClick () {
    this.setState({
      isFilterVisible: true
    })
  }

  handleSubmitFilter (productListConfig) {
    this.setState({
      useTwoColumnsView: productListConfig.colType === 'double'
    })
    this.handleCloseFilter()
  }

  handleCloseFilter () {
    this.setState({
      isFilterVisible: false
    })
  }

  render () {
    const { valueGroups, categorySwitchOpened, isFilterVisible, useTwoColumnsView } = this.state

    if (!includes([CATEGORY_TOPS, CATEGORY_SHOES, CATEGORY_PANTS], this.currentCategory)) {
      return <NotFound />
    }

    return (
      <div
        key={this.currentCategory}
        className='ProductsPage'
        style={{ overflow: 'hidden' }}>
        <div className='container'>
          <PageTitle
            className={classNames('ProductsPage-title', { 'is-opened': categorySwitchOpened })}
            showSwitch
            onFilterClick={this.handleFilterButtonClick}
            onTitleClick={this.handleTitleClick}
          >
            {CATEGORIES_LABELS[this.currentCategory]}
          </PageTitle>

          <Products category={this.currentCategory} limitPerPage={20} useTwoColumnsView={useTwoColumnsView} />
        </div>
        <MobilePicker
          isVisible={categorySwitchOpened}
          optionGroups={this.optionGroups}
          valueGroups={valueGroups}
          onChange={this.handleCategoryChange}
          onPick={this.handleCategoryPick}
          onClose={this.handleClosePicker}
        />
        <ProductsFilter
          defaultColType={this.listingView}
          activeCategory={this.currentCategory}
          isVisible={isFilterVisible}
          onSubmit={this.handleSubmitFilter}
          onClose={this.handleCloseFilter}
        />
        <ProductsVisualFilter activeCategory={this.currentCategory} />
      </div>
    )
  }
}

export default withTrackingProvider()(ProductsPage)
