import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchProducts } from 'ducks/products'
import { likeProduct, unlikeProduct } from 'ducks/product'
import { setFilter, syncFilter } from 'ducks/filters'
import { ProductList } from 'modules/products'
import { FlatBanner } from 'ui-kits/banners'
import './feedbacks.css'

class Feedbacks extends Component {
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

  /**
   * only applicable on next fetch, if available
   */
  get handleFetchNext () {
    const { fetchProducts } = this.props
    return (next) => {
      fetchProducts().then(() => {
        next()
      })
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
    const { products, isProductsFetched, nextPage } = this.props
    const banner = (
      <FlatBanner style={styles.banner}>
        <div style={styles.bannerContent}>
          <h2>Tell us how we can do better!</h2>
          <p><a href='mailto:hello@yesplz.us'>hello@yesplz.us</a></p>
        </div>
      </FlatBanner>
    )

    return (
      <div className='Feedbacks'>
        <ProductList
          id='MainScroll'
          show={isProductsFetched}
          products={products}
          nextPage={nextPage}
          onFetch={this.handleFetchNext}
          onToggleLike={this.toggleProductLike}
          extraItem={banner}
          className='Feedbacks-products'
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
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
)(Feedbacks)

const styles = {
  banner: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: 30
  },
  bannerContent: {
    textAlign: 'left'
  }
}
