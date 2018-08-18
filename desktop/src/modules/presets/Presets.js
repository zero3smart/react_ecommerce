import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import camelCase from 'lodash-es/camelCase'
import isNil from 'lodash-es/isNil'
import classNames from 'classnames'
import { history } from 'config/store'
import { fetchPresets, setFilter, likePreset, unlikePreset, syncFilter } from 'yesplz@ducks/filters'
import { fetchProducts, enableInitialFetch } from 'yesplz@ducks/products'
import Transition from 'yesplz@ui-kits/transitions/Transition'
import { DotLoader } from 'yesplz@ui-kits/loaders'
import { CloseButton } from 'yesplz@ui-kits/buttons'
import Preset from 'yesplz@modules/presets/Preset'
import { ProductList } from 'yesplz@modules/products'
import './presets.css'

export class Presets extends Component {
  static propTypes = {
    // presets
    presets: PropTypes.array,
    isPresetsFetched: PropTypes.bool,
    activePresetName: PropTypes.string,
    presetBaseURI: PropTypes.string,
    // products
    products: PropTypes.array,
    isProductsFetched: PropTypes.bool,
    nextPage: PropTypes.number,
    // misc
    extraItem: PropTypes.element,
    style: PropTypes.object,
    // actions
    fetchPresets: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    likePreset: PropTypes.func.isRequired,
    unlikePreset: PropTypes.func.isRequired,
    syncFilter: PropTypes.func.isRequired,
    fetchProducts: PropTypes.func.isRequired,
    enableInitialFetch: PropTypes.func.isRequired
  }

  static defaultProps = {
    presets: [],
    isPresetsFetched: false,
    presetBaseURI: '/presets'
  }

  constructor (props) {
    super(props)
    this.state = {
      splitView: false
    }
  }

  componentDidMount () {
    const { fetchPresets, activePresetName, isProductsFetched, syncFilter, fetchProducts } = this.props
    fetchPresets()

    // don't need to do initial fetch if products is fetched already
    if (!isProductsFetched) {
      // make sure the filter is synced with localStorage data
      syncFilter()
      fetchProducts(true)
    }

    // if active preset name exist, fetch product with new data
    if (!isNil(activePresetName)) {
      fetchProducts(true)
    }
  }

  componentWillUnmount () {
    if (this.scrollTopTimeout) {
      clearTimeout(this.scrollTopTimeout)
    }
  }

  get handlePresetClick () {
    const { presetBaseURI, setFilter, fetchProducts, enableInitialFetch } = this.props
    return (filters, filterName) => {
      setFilter(filters)
      // fetch products from the beginning after filter applied
      enableInitialFetch()
      fetchProducts(true)
      // enable split view to show product list
      history.push(`${presetBaseURI}/${filterName}`)

      // scroll preset list to top
      this.scrollWrapperTo(0)
    }
  }

  scrollWrapperTo (scrollTop) {
    if (this.presetList) {
      this.scrollTopTimeout = setTimeout(() => {
        this.presetList.scrollTop = scrollTop
      }, 300)
    }
  }

  get togglePresetLike () {
    const { likePreset, unlikePreset } = this.props
    return (preset, favorite) => {
      if (favorite) {
        likePreset(preset)
      } else {
        unlikePreset(preset)
      }
    }
  }

  /**
   * only applicable on next fetch, if available
   */
  get handleFetch () {
    const { fetchProducts } = this.props
    return (next) => {
      fetchProducts().then(() => {
        next()
      })
    }
  }

  get handleSplitViewClose () {
    const { presetBaseURI } = this.props
    return () => {
      history.push(presetBaseURI)
    }
  }

  get getPresetListRef () {
    return element => {
      this.presetList = element
    }
  }

  render () {
    const { isPresetsFetched, presets, extraItem, isProductsFetched, products, nextPage, activePresetName, style } = this.props
    const splitView = !isNil(activePresetName)

    return (
      <div id={splitView ? undefined : 'MainScroll'} className='Presets' style={style}>
        {extraItem}
        {!isPresetsFetched && <DotLoader visible style={styles.loader} />}
        {/* presets list */}
        {
          splitView && (
            <div className='PresetsInnerHead'>
              <CloseButton onClick={this.handleSplitViewClose} />
            </div>
          )
        }
        <div className={classNames('PresetsInnerWrapper', { splitView })}>
          <div className='PresetsInnerWrapper-presets' ref={this.getPresetListRef}>
            <Transition show transition='fadeInUp'>
              {
                presets.map((preset, index) => {
                  const fade = splitView && preset.name.trim() !== (activePresetName || '').trim()
                  return (
                    <Preset
                      key={preset.name}
                      id={`${camelCase(preset.name)}${index}`}
                      name={preset.name}
                      collar={preset.collar}
                      coretype={preset.coretype}
                      neckline={preset.neckline}
                      shoulder={preset.shoulder}
                      sleeveLength={preset.sleeve_length}
                      topLength={preset.top_length}
                      pattern={preset.pattern}
                      solid={preset.solid}
                      details={preset.details}
                      color={preset.color}
                      favorite={preset.favorite}
                      onClick={this.handlePresetClick}
                      onToggleLike={this.togglePresetLike}
                      style={{ animationDelay: `${50 * index}ms`, opacity: fade ? 0.25 : 1, order: fade ? 1 : 0 }}
                    />
                  )
                })
              }
            </Transition>
          </div>
          {/* products lists, only activated on splitView */}
          {
            splitView && (
              <ProductList
                id={splitView ? 'MainScroll' : undefined}
                show={isProductsFetched}
                products={products}
                nextPage={nextPage}
                showSalePrice
                className='PresetsInnerWrapper-productList'
                onFetch={this.handleFetch}
              />
            )
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  // presets
  presets: props.presets || state.filters.presets,
  isPresetsFetched: props.show || state.filters.presetsFetched,
  activePresetName: props.match.params.presetName,
  // products
  filters: state.filters.data,
  products: state.products.list,
  isProductsFetched: state.products.fetched,
  nextPage: state.products.nextPage
})

export default connect(
  mapStateToProps,
  {
    fetchPresets,
    setFilter,
    likePreset,
    unlikePreset,
    syncFilter,
    fetchProducts,
    enableInitialFetch
  }
)(Presets)

const styles = {
  loader: {
    position: 'absolute',
    margin: 'auto',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 100,
    height: 30
  }
}
