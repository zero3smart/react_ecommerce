import React, { Component } from 'react'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import withTrackingProvider from 'yesplz@hoc/withTrackingProvider'
import { fetchProducts } from 'yesplz@ducks/products'
import { ProductList } from 'yesplz@modules/products'
import { syncFilter } from 'yesplz@ducks/filters'
import { InfoBanner } from 'yesplz@ui-kits/banners'
import { VisualFilter } from 'modules/visual-filter'
import './tops.css'

class Tops extends Component {
  static propTypes = {
    products: PropTypes.array,
    totalCount: PropTypes.number,
    isProductsFetched: PropTypes.bool,
    onboarding: PropTypes.bool,
    nextPage: PropTypes.number,
    syncFilter: PropTypes.func.isRequired,
    fetchProducts: PropTypes.func.isRequired
  }

  static defaultProps = {
    products: [],
    isProductsFetched: false
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

  render () {
    const { products, isProductsFetched, nextPage, onboarding } = this.props

    return (
      <div className={classNames('Tops', { onboarding })}>
        <InfoBanner style={styles.infoBanner}>
          <h1>Let’s find a style.</h1>
        </InfoBanner>
        <VisualFilter />
        <ProductList
          id='MainScroll'
          show={isProductsFetched}
          products={products}
          nextPage={nextPage}
          showOriginalPrice
          className='Tops-products'
          onFetch={this.handleFetch}
          closeMatchingMessage='Not the exact, but the next close matching'
        />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  filters: state.filters.data,
  products: state.products.list,
  totalCount: state.products.totalCount,
  isProductsFetched: state.products.fetched,
  nextPage: state.products.nextPage,
  onboarding: state.filters.onboarding
})

export default compose(
  connect(mapStateToProps, { fetchProducts, syncFilter }),
  withTrackingProvider('Products Search')
)(Tops)

const styles = {
  infoBanner: {
    padding: '30px 70px 30px'
  }
}
