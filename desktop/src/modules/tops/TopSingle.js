import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ProductPlaceholder } from 'modules/products'
import { Product, ProductList } from 'yesplz@modules/products'
import { fetchProduct, fetchRelatedProducts, resetProduct } from 'yesplz@ducks/product'
import './top-single.css'

class TopSingle extends Component {
  static propTypes = {
    isProductFetched: PropTypes.bool,
    isRelatedProductsFetched: PropTypes.bool,
    productId: PropTypes.string.isRequired,
    product: PropTypes.object.isRequired,
    relatedProducts: PropTypes.array.isRequired,
    totalCount: PropTypes.number.isRequired,
    nextPage: PropTypes.number,
    fetchProduct: PropTypes.func.isRequired,
    fetchRelatedProducts: PropTypes.func.isRequired,
    resetProduct: PropTypes.func.isRequired
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
    const { productId, relatedProducts, fetchRelatedProducts, totalCount } = this.props
    return (next) => {
      if (relatedProducts.length < totalCount) {
        // fetch next related products
        this.relatedsRequest = fetchRelatedProducts(productId)
        this.relatedsRequest.then(() => {
          next()
        })
      } else {
        next()
      }
    }
  }

  render () {
    const { product, relatedProducts, nextPage, isProductFetched, isRelatedProductsFetched } = this.props
    let productBox = <ProductPlaceholder />

    if (isProductFetched) {
      productBox = (
        <div className='TopSingle-top-wrapper'>
          <Product
            id={product.product_id}
            name={product.name}
            brand={product.brand}
            price={product.price}
            originalPrice={product.original_price}
            imgSrc={product.front_img}
            extraImgs={product.extra_imgs}
            description={product.description}
            favorite={product.favorite}
            link={product.src_url}
            retailer={product.retailer}
            sizes={product.sizes}
            extraInfo={product.extra_info}
            rawData={product}
            showArrows
            showDots
          />
          <h2>You might also like this.</h2>
        </div>
      )
    }

    return (
      <div className='TopSingle'>
        <ProductList
          id='MainScroll'
          show={isRelatedProductsFetched}
          products={relatedProducts}
          nextPage={nextPage}
          extraItem={productBox}
          showOriginalPrice
          onFetch={this.handleFetchNext}
          onScrollBellowTheFold={this.handleScrollBellowTheFold}
          className='TopSingle-products'
          loaderStyle={styles.productsLoader}
          closeMatchingMessage='Our next best suggestion.'
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
  totalCount: state.product.totalCount,
  nextPage: state.product.nextPage
})

export default connect(
  mapStateToProps,
  {
    fetchProduct,
    fetchRelatedProducts,
    resetProduct
  }
)(TopSingle)

const styles = {
  productsLoader: {
    position: 'static',
    marginTop: '10%',
    marginBottom: '10%'
  }
}
