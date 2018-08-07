import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchProducts } from 'ducks/products'
import { likeProduct, unlikeProduct } from 'ducks/product'
import { setFilter } from 'ducks/filters'
import { ProductList } from 'modules/products'
import { ProductFilter } from 'modules/filters'
import './tops.css'

class Tops extends Component {
  static propTypes = {
    products: PropTypes.array,
    isProductsFetched: PropTypes.bool,
    nextPage: PropTypes.number,
    fetchProducts: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    likeProduct: PropTypes.func.isRequired,
    unlikeProduct: PropTypes.func.isRequired
  }

  static defaultProps = {
    products: [],
    isProductsFetched: false
  }

  componentDidMount () {
    const { isProductsFetched, fetchProducts } = this.props

    // don't need to do initial fetch if products is fetched already
    if (!isProductsFetched) {
      fetchProducts()
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
      // start index 0 / reset product list
      fetchProducts(filters, 0)
    }
  }

  render () {
    const { products, isProductsFetched, nextPage } = this.props

    return (
      <div className='Tops'>
        <ProductFilter onFilterChange={this.handleFilterChange} />
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
  products: state.products.list,
  isProductsFetched: state.products.fetched,
  nextPage: state.products.nextPage
})

export default connect(
  mapStateToProps,
  {
    fetchProducts,
    setFilter,
    likeProduct,
    unlikeProduct
  }
)(Tops)
