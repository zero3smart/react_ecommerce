import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Product, ProductPlaceholder, ProductList } from 'modules/products'
import { fetchProduct, fetchRelatedProducts, resetProduct, likeProduct, unlikeProduct } from 'ducks/product'
import './top-single.css'

class TopSingle extends Component {
  static propTypes = {
    isProductFetched: PropTypes.bool,
    isRelatedProductsFetched: PropTypes.bool,
    productId: PropTypes.string.isRequired,
    product: PropTypes.object.isRequired,
    relatedProducts: PropTypes.array.isRequired,
    nextPage: PropTypes.number,
    fetchProduct: PropTypes.func.isRequired,
    fetchRelatedProducts: PropTypes.func.isRequired,
    resetProduct: PropTypes.func.isRequired,
    likeProduct: PropTypes.func.isRequired,
    unlikeProduct: PropTypes.func.isRequired
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

  render () {
    const { product, relatedProducts, isProductFetched, isRelatedProductsFetched, nextPage } = this.props

    return (
      <div className='TopSingle'>
        {
          isProductFetched ? (
            <Product
              id={product.product_id}
              name={product.name}
              brand={product.brand}
              price={product.price}
              imgSrc={product.front_img}
              description={product.description}
              favorite={product.favorite}
              onToggleLike={this.toggleProductLike}
            />
          ) : (
            <ProductPlaceholder />
          )
        }
        <ProductList
          show={isRelatedProductsFetched}
          products={relatedProducts}
          nextPage={nextPage}
          onFetch={this.handleFetchNext}
          onToggleLike={this.toggleProductLike}
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
  nextPage: state.product.nextPage
})

export default connect(
  mapStateToProps,
  {
    fetchProduct,
    fetchRelatedProducts,
    resetProduct,
    likeProduct,
    unlikeProduct
  }
)(TopSingle)
