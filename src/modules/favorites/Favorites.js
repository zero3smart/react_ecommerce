import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchProducts } from 'ducks/products'
import { likeProduct, unlikeProduct } from 'ducks/product'
import { setFilter, syncFilter } from 'ducks/filters'
import { ProductList } from 'modules/products'
import { FlatBanner } from 'ui-kits/banners'
import { favoriteProductsSelector } from './selectors'
import './favorites.css'

class Favorites extends Component {
  static propTypes = {
    products: PropTypes.array,
    isProductsFetched: PropTypes.bool,
    nextPage: PropTypes.number,
    fetchProducts: PropTypes.func.isRequired,
    syncFilter: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    likeProduct: PropTypes.func.isRequired,
    unlikeProduct: PropTypes.func.isRequired
  }

  componentDidMount () {
    const { isProductsFetched, syncFilter, fetchProducts } = this.props

    // don't need to do initial fetch if products is fetched already
    if (!isProductsFetched) {
      syncFilter()
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
      fetchProducts(0)
    }
  }

  render () {
    const { products, isProductsFetched, nextPage } = this.props
    const banner = (
      <FlatBanner style={styles.banner}>
        <h1>Coming Soon!</h1>
      </FlatBanner>
    )
    return (
      <div className='Favorites'>
        <ProductList
          show={isProductsFetched}
          products={products}
          nextPage={nextPage}
          onToggleLike={this.toggleProductLike}
          extraItem={banner}
          className='Favorites-products'
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  products: favoriteProductsSelector(state),
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
)(Favorites)

const styles = {
  banner: {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  }
}
