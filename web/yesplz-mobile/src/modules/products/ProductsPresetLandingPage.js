import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'

import classNames from 'classnames'
import includes from 'lodash/includes'
import findKey from 'lodash/findKey'

// Redux
import { fetchPresets } from '@yesplz/core-redux/ducks/products'

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

// utls
import { formatPresetName, parsePresetName } from '@yesplz/core-web/utils/index'

import './ProductsLandingPage.scss'

class ProductsLandingPage extends PureComponent {
  static propTypes = {
    match: PropTypes.object,
    presets: PropTypes.array,
    fetchPresets: PropTypes.func.isRequired
  }

  static defaultProps = {
    presets: []
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

  componentDidMount () {
    this.props.fetchPresets(this.currentCategory)
  }

  get currentCategory () {
    const { match } = this.props
    return match.params.category || CATEGORY_TOPS
  }

  get currentPreset () {
    const { match } = this.props
    return match.params.presetName || ''

    // const preset = presets.find(preset => formatPresetName(preset.name) === match.params.presetName)
    // return preset ? preset.name : ''
  }

  get optionGroups () {
    return {
      preset: this.props.presets.map(preset => preset.name)
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
    const { presets } = this.props
    const presetName = presets.find(preset => preset.name === valueGroups.preset).name

    history.push(`/preset-products/${this.currentCategory}/${formatPresetName(presetName)}`)
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
            {parsePresetName(this.currentPreset)}
            {/* {CATEGORIES_LABELS[this.currentCategory]} */}
          </PageTitle>

          {/* <GroupTitle>New Arrivals</GroupTitle> */}
          {/* <NewProducts
            category={this.currentCategory}
            limitPerPage={3}
            isVertical
          />
          <Button kind='secondary' to={`/products/${this.currentCategory}/list`} style={styles.button}>See all new {CATEGORIES_LABELS[this.currentCategory]}</Button> */}

          <ProductPresets
            category={this.currentCategory}
            presetName={this.currentPreset}
          />

          <h2 className='SubHeader'>Editors Picks</h2>
          <AdvancedPresetList
            presetMatchesCount={3}
            activeCategory={this.currentCategory}
            useMinimalPreset
          />

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
        <ProductsVisualFilter hidden={isFilterVisible} activeCategory={this.currentCategory} />
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

const mapStateToProps = (state, props) => ({
  presets: state.products[props.match.params.category].presets
})

export default compose(
  connect(mapStateToProps, { fetchPresets }),
  withTrackingProvider()
)(ProductsLandingPage)
// export default withTrackingProvider()(ProductsLandingPage)
