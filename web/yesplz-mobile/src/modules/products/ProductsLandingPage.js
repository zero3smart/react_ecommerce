import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import includes from 'lodash/includes'
import findKey from 'lodash/findKey'

import history from '@yesplz/core-web/config/history'
import { AdvancedPresetList } from '@yesplz/core-web/modules/presets'
import ProductsVisualFilter from 'modules/filters/ProductsVisualFilter'
import { CATEGORY_TOPS, CATEGORY_SHOES, CATEGORY_PANTS, CATEGORIES_LABELS } from '@yesplz/core-web/config/constants'
import { withTrackingProvider } from '@yesplz/core-web/hoc'
import MobilePicker from '@yesplz/core-web/ui-kits/selects/MobilePicker'
import { PageTitle, GroupTitle } from '@yesplz/core-web/ui-kits/misc'
import { Button } from '@yesplz/core-web/ui-kits/buttons'

import { NewProducts, ProductPresets, ProductsFilter, RecommendedProducts } from 'modules/products'
import { NotFound } from 'modules/base'
import './ProductsLandingPage.scss'

class ProductsLandingPage extends PureComponent {
  static propTypes = {
    match: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      categorySwitchOpened: false,
      valueGroups: {
        category: CATEGORIES_LABELS[props.match.params.category || CATEGORY_TOPS]
      },
      isFilterVisible: false
    }
    this.handleTitleClick = this.handleTitleClick.bind(this)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
    this.handleCategoryPick = this.handleCategoryPick.bind(this)
    this.handleClosePicker = this.handleClosePicker.bind(this)
    this.handleFilterButtonClick = this.handleFilterButtonClick.bind(this)
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

  handleCloseFilter () {
    this.setState({
      isFilterVisible: false
    })
  }

  render () {
    const { valueGroups, categorySwitchOpened, isFilterVisible } = this.state

    if (!includes([CATEGORY_TOPS, CATEGORY_SHOES, CATEGORY_PANTS], this.currentCategory)) {
      return <NotFound />
    }

    return (
      <div
        key={this.currentCategory}
        className='ProductsLandingPage'
        style={{ overflow: 'hidden' }}>
        <div className='container'>
          <PageTitle
            className={classNames('ProductsLandingPage-title', { 'is-opened': categorySwitchOpened })}
            showSwitch
            onFilterClick={this.handleFilterButtonClick}
            onTitleClick={this.handleTitleClick}
          >
            {CATEGORIES_LABELS[this.currentCategory]}
          </PageTitle>

          <GroupTitle>New Arrivals</GroupTitle>
          <NewProducts
            category={this.currentCategory}
            limitPerPage={3}
            isVertical />
          <Button kind='secondary' to={`/products/${this.currentCategory}/list`} style={styles.button}>See all new tops</Button>

          <ProductPresets category={this.currentCategory} />

          <h2 className='SubHeader'>Editors Picks</h2>
          <AdvancedPresetList
            presetMatchesCount={3}
            activeCategory={this.currentCategory}
            useMinimalPreset />

          <h2 className='SubHeader'>Explore</h2>
          <RecommendedProducts
            limitPerPage={3}
            category={this.currentCategory}
            enableFetchNext
            useScrollFetcher
          />
        </div>
        <MobilePicker
          isVisible={categorySwitchOpened}
          optionGroups={this.optionGroups}
          valueGroups={valueGroups}
          onChange={this.handleCategoryChange}
          onPick={this.handleCategoryPick}
          onClose={this.handleClosePicker}
        />
        <ProductsFilter activeCategory={this.currentCategory} isVisible={isFilterVisible} onSubmit={this.handleCloseFilter} onClose={this.handleCloseFilter} />
        <ProductsVisualFilter activeCategory={this.currentCategory} />
      </div>
    )
  }
}

const styles = {
  button: {
    width: '100%',
    textTransform: 'uppercase'
  }
}

export default withTrackingProvider()(ProductsLandingPage)
