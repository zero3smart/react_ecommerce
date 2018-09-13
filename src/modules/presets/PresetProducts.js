import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchProducts } from 'ducks/products'
import { syncFilter, toggleVisualFilter } from 'ducks/filters'
import { ProductList } from 'modules/products'
import { InfoBanner } from 'ui-kits/banners'
import './preset-products.css'

class PresetProducts extends Component {
  static propTypes = {
    presetName: PropTypes.string,
    products: PropTypes.array,
    totalCount: PropTypes.number,
    isProductsFetched: PropTypes.bool,
    willBeEmptyList: PropTypes.bool,
    nextPage: PropTypes.number,
    visualFilterExpanded: PropTypes.bool,
    syncFilter: PropTypes.func.isRequired,
    fetchProducts: PropTypes.func.isRequired,
    toggleVisualFilter: PropTypes.func.isRequired
  }

  static defaultProps = {
    products: [],
    isProductsFetched: false,
    willBeEmptyList: false
  }

  componentDidMount () {
    const { isProductsFetched, syncFilter, fetchProducts } = this.props

    // don't need to do initial fetch if products is fetched already
    if (!isProductsFetched) {
      // make sure the filter is synced with localStorage data
      syncFilter()
      fetchProducts(true)
    }
  }

  /**
   * only applicable on next fetch, if available
   */
  get handleFetch () {
    const { products, totalCount, fetchProducts } = this.props
    return (next) => {
      if (products.length < totalCount) {
        fetchProducts().then(() => {
          next()
        })
      } else {
        next()
      }
    }
  }

  get handleScrollChange () {
    const { visualFilterExpanded, toggleVisualFilter } = this.props
    return () => {
      // when user scroll the products and visual filter is expanded, close it and show the visual filter hint
      if (visualFilterExpanded) {
        toggleVisualFilter(false)
      }
    }
  }

  render () {
    const { presetName, products, isProductsFetched, nextPage, willBeEmptyList } = this.props

    const bestMatches = products.slice(0, 6)
    const closeMatches = products.slice(6)

    const extra = (
      <React.Fragment>
        <InfoBanner style={styles.infoBanner} className='animated fadeInDown'>
          <p style={{ display: 'inline-block', fontSize: 14 }}>
            Best matching results > <strong className='bigger'>{presetName}</strong>
          </p>
        </InfoBanner>
        <ProductList
          show={isProductsFetched}
          products={bestMatches}
          style={{ overflow: 'hidden' }}
        />
        {isProductsFetched && <h4 className='animated fadeIn' style={styles.subTitle}>The next close matching</h4>}
      </React.Fragment>
    )

    return (
      <div className='PresetProducts'>
        <ProductList
          id='MainScroll'
          show={isProductsFetched}
          products={closeMatches}
          willBeEmptyList={willBeEmptyList}
          nextPage={nextPage}
          onFetch={this.handleFetch}
          className='PresetProducts-list'
          extraItem={extra}
          onScrollChange={this.handleScrollChange}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  presetName: props.match.params.presetName,
  products: state.products.list,
  totalCount: state.products.totalCount,
  willBeEmptyList: state.products.willBeEmptyList,
  isProductsFetched: state.products.fetched,
  nextPage: state.products.nextPage,
  visualFilterExpanded: state.filters.expanded
})

export default connect(mapStateToProps, { fetchProducts, syncFilter, toggleVisualFilter })(PresetProducts)

const styles = {
  infoBanner: {
    margin: '-10px -10px 10px'
  },
  smallVisualFilterButton: {
    display: 'inline-block',
    width: 40,
    height: 40,
    paddingTop: 5,
    marginLeft: 7,
    marginTop: -10,
    position: 'static',
    verticalAlign: 'top'
  },
  subTitle: {
    marginTop: -5,
    marginBottom: 15
  }
}
