import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchProducts } from 'yesplz@ducks/products'
import { ProductList } from 'yesplz@modules/products'
import { syncFilter } from 'yesplz@ducks/filters'
import { VisualFilter } from 'modules/visual-filter'
import './tops.css'

class Tops extends Component {
  static propTypes = {
    products: PropTypes.array,
    totalCount: PropTypes.number,
    isProductsFetched: PropTypes.bool,
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
    const { products, isProductsFetched, nextPage } = this.props

    return (
      <div className='Tops'>
        <VisualFilter />
        <ProductList
          id='MainScroll'
          show={isProductsFetched}
          products={products}
          nextPage={nextPage}
          showOriginalPrice
          className='Tops-products'
          onFetch={this.handleFetch}
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
  nextPage: state.products.nextPage
})

export default connect(mapStateToProps, { fetchProducts, syncFilter })(Tops)
