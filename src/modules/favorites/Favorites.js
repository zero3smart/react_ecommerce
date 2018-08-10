import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Tabs from 'ui-kits/navigations/Tabs'
import { fetchProducts, syncFavoriteProducts } from 'ducks/products'
import { likeProduct, unlikeProduct } from 'ducks/product'
import { setFilter, syncFilter, syncFavoritePresets } from 'ducks/filters'
import { ProductList } from 'modules/products'
import { Presets } from 'modules/presets'
import './favorites.css'

class Favorites extends Component {
  static propTypes = {
    favoriteType: PropTypes.string,
    products: PropTypes.array,
    presets: PropTypes.array,
    isProductsFetched: PropTypes.bool,
    nextPage: PropTypes.number,
    fetchProducts: PropTypes.func.isRequired,
    syncFilter: PropTypes.func.isRequired,
    syncFavoritePresets: PropTypes.func.isRequired,
    syncFavoriteProducts: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    likeProduct: PropTypes.func.isRequired,
    unlikeProduct: PropTypes.func.isRequired
  }

  componentDidMount () {
    const { isProductsFetched, syncFilter, syncFavoritePresets, syncFavoriteProducts, fetchProducts } = this.props

    // don't need to do initial fetch if products is fetched already
    if (!isProductsFetched) {
      syncFilter()
      fetchProducts(true)
    }
    syncFavoritePresets()
    syncFavoriteProducts()
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
    const { products, presets, isProductsFetched, nextPage, favoriteType } = this.props

    const showFits = favoriteType === 'fits'
    const banner = (
      <Tabs kind='capsule' style={showFits ? styles.fitsTabs : styles.tabs}>
        <NavLink to='/favorites/fits'>fits</NavLink>
        <NavLink to='/favorites/clothing'>clothing</NavLink>
      </Tabs>
    )

    return (
      <div className='Favorites'>
        {
          showFits ? (
            <Presets presets={presets} extraItem={banner} style={styles.presets} />
          ) : (
            <ProductList
              show={isProductsFetched}
              products={products}
              nextPage={nextPage}
              onToggleLike={this.toggleProductLike}
              extraItem={banner}
              className='Favorites-products'
            />
          )
        }
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  favoriteType: props.match.params.favoriteType,
  products: state.products.favoriteLists,
  presets: state.filters.favoritePresets,
  isProductsFetched: state.products.fetched,
  nextPage: state.products.nextPage
})

export default connect(
  mapStateToProps,
  {
    fetchProducts,
    syncFilter,
    syncFavoritePresets,
    syncFavoriteProducts,
    setFilter,
    likeProduct,
    unlikeProduct
  }
)(Favorites)

const styles = {
  tabs: {
    marginTop: 10,
    marginBottom: 25
  },
  fitsTabs: {
    marginTop: 20,
    marginRight: 5,
    marginBottom: 25,
    marginLeft: 5
  },
  presets: {
    height: '100%'
  }
}
