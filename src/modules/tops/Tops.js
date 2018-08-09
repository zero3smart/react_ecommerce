import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchProducts } from 'ducks/products'
import { likeProduct, unlikeProduct } from 'ducks/product'
import { setFilter, syncFilter } from 'ducks/filters'
import { ProductList } from 'modules/products'
import { ProductFilter } from 'modules/filters'
import './tops.css'

class Tops extends Component {
  static propTypes = {
    filters: PropTypes.object,
    products: PropTypes.array,
    isProductsFetched: PropTypes.bool,
    nextPage: PropTypes.number,
    fetchProducts: PropTypes.func.isRequired,
    syncFilter: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    likeProduct: PropTypes.func.isRequired,
    unlikeProduct: PropTypes.func.isRequired
  }

  static defaultProps = {
    products: [],
    isProductsFetched: false
  }

  componentDidMount () {
    const { isProductsFetched, syncFilter, fetchProducts } = this.props

    // don't need to do initial fetch if products is fetched already
    if (!isProductsFetched) {
      syncFilter()
      fetchProducts(true)
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

  get toggleProductLike () {
    const { likeProduct, unlikeProduct } = this.props
    return (id, favorite) => {
      if (favorite) {
        likeProduct(id)
      } else {
        unlikeProduct(id)
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
    }
  }

  render () {
    const { filters, products, isProductsFetched, nextPage } = this.props

    return (
      <div className='Tops'>
        <ProductFilter filters={filters} onFilterChange={this.handleFilterChange} />
        <ProductList
          show={isProductsFetched}
          products={products}
          nextPage={nextPage}
          onFetch={this.handleFetch}
          onToggleLike={this.toggleProductLike}
          className='Tops-products'
        />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  filters: state.filters.data,
  products: state.products.list,
  isProductsFetched: state.products.fetched,
  nextPage: state.products.nextPage
})

export default connect(
  mapStateToProps,
  {
    fetchProducts,
    syncFilter,
    setFilter,
    likeProduct,
    unlikeProduct
  }
)(Tops)
