import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Product, ProductPlaceholder, ProductGrid } from 'yesplz@modules/products'
import { fetchProduct, fetchRelatedProducts, resetProduct, likeProduct, unlikeProduct } from 'yesplz@ducks/product'
import Transition from 'yesplz@ui-kits/transitions/Transition'
import './top-single.css'

class TopSingle extends Component {
  static propTypes = {
    isProductFetched: PropTypes.bool,
    isRelatedProductsFetched: PropTypes.bool,
    productId: PropTypes.string.isRequired,
    product: PropTypes.object.isRequired,
    relatedProducts: PropTypes.array.isRequired,
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
    const { product, relatedProducts, isProductFetched, isRelatedProductsFetched } = this.props
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
      <div id='MainScroll' className='TopSingle'>
        {productBox}
        <h2>You might also like this.</h2>
        <div className='TopSingle-relateds'>
          <Transition show={isRelatedProductsFetched} transition='fadeInUp'>
            {
              relatedProducts.map((product, index) => (
                <ProductGrid
                  key={product.product_id}
                  id={product.product_id}
                  name={product.name}
                  brand={product.brand}
                  price={product.price}
                  originalPrice={product.original_price}
                  favorite={product.favorite}
                  imgSrc={product.front_img}
                  onToggleLike={this.toggleProductLike}
                  style={{
                    // `ProducGrid` need be showed directly in each page
                    animationDelay: `${50 * index}ms`
                  }}
                />
              ))
            }
          </Transition>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  product: state.product.data,
  productId: props.match.params.productId,
  isProductFetched: state.product.fetched,
  isRelatedProductsFetched: state.product.relatedProductsFetched,
  relatedProducts: (state.product.relatedProducts || []).slice(0, 5)
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
