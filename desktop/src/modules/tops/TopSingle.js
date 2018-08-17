import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Product, ProductPlaceholder, ProductList } from 'yesplz@modules/products'
import { fetchProduct, fetchRelatedProducts, resetProduct, likeProduct, unlikeProduct, setScrollBellowTheFold } from 'yesplz@ducks/product'
import { history } from 'config/store'
import './top-single.css'

class TopSingle extends Component {
  static propTypes = {
    isProductFetched: PropTypes.bool,
    isRelatedProductsFetched: PropTypes.bool,
    productId: PropTypes.string.isRequired,
    product: PropTypes.object.isRequired,
    relatedProducts: PropTypes.array.isRequired,
    nextPage: PropTypes.number,
    scrollBellowTheFold: PropTypes.bool,
    fetchProduct: PropTypes.func.isRequired,
    fetchRelatedProducts: PropTypes.func.isRequired,
    resetProduct: PropTypes.func.isRequired,
    likeProduct: PropTypes.func.isRequired,
    unlikeProduct: PropTypes.func.isRequired,
    setScrollBellowTheFold: PropTypes.func.isRequired
  }

  componentDidMount () {
    const { productId, fetchProduct, fetchRelatedProducts } = this.props

    // fetch product and related product data
    this.productRequest = fetchProduct(productId)
    this.relatedsRequest = fetchRelatedProducts(productId)
  }

  componentDidUpdate (prevProps) {
    const { productId, fetchProduct, fetchRelatedProducts, resetProduct } = this.props

    // if productId changed, fetch new product and related product data
    if (prevProps.productId !== this.props.productId) {
      resetProduct()
      this.productRequest = fetchProduct(productId)
      this.relatedsRequest = fetchRelatedProducts(productId)
    }
  }

  componentWillUnmount () {
    const { resetProduct } = this.props
    // cancel requests
    this.productRequest.cancel()
    this.relatedsRequest.cancel()

    // reset store data
    resetProduct()
  }

  /**
   * only applicable on next fetch, if available
   */
  get handleFetchNext () {
    const { productId, fetchRelatedProducts } = this.props
    return (next) => {
      // fetch next related products
      this.relatedsRequest = fetchRelatedProducts(productId)
      this.relatedsRequest.then(() => {
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

  get handleScrollBellowTheFold () {
    const { scrollBellowTheFold, setScrollBellowTheFold } = this.props
    return (scrollState) => {
      // boolean can only be compared by casting it to string (js)
      if (scrollState.toString() !== scrollBellowTheFold.toString()) {
        history.push('#')
        setScrollBellowTheFold(scrollState)
      }
    }
  }

  render () {
    const { product, relatedProducts, isProductFetched, isRelatedProductsFetched, nextPage } = this.props
    let productBox = <ProductPlaceholder />

    if (isProductFetched) {
      productBox = (
        <Product
          id={product.product_id}
          name={product.name}
          brand={product.brand}
          price={product.price}
          imgSrc={product.front_img}
          extraImgs={product.extra_imgs}
          description={product.description}
          favorite={product.favorite}
          link={product.src_url}
          onToggleLike={this.toggleProductLike}
          showArrows
        />
      )
    }

    return (
      <div className='TopSingle'>
        {productBox}
        <ProductList
          id='MainScroll'
          show={isRelatedProductsFetched}
          products={relatedProducts}
          nextPage={nextPage}
          onFetch={this.handleFetchNext}
          onToggleLike={this.toggleProductLike}
          onScrollBellowTheFold={this.handleScrollBellowTheFold}
          className='TopSingle-products'
        />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  product: state.product.data,
  productId: props.match.params.productId,
  isProductFetched: state.product.fetched,
  isRelatedProductsFetched: state.product.relatedProductsFetched,
  relatedProducts: state.product.relatedProducts,
  nextPage: state.product.nextPage,
  scrollBellowTheFold: state.product.scrollBellowTheFold
})

export default connect(
  mapStateToProps,
  {
    fetchProduct,
    fetchRelatedProducts,
    resetProduct,
    likeProduct,
    unlikeProduct,
    setScrollBellowTheFold
  }
)(TopSingle)
