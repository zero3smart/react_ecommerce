import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Product, ProductPlaceholder, ProductList } from 'modules/products'
import { fetchProduct, fetchRelatedProducts, resetProduct, setScrollBellowTheFold } from 'ducks/product'
import { history } from 'config/store'
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
    scrollBellowTheFold: PropTypes.bool,
    fetchProduct: PropTypes.func.isRequired,
    fetchRelatedProducts: PropTypes.func.isRequired,
    resetProduct: PropTypes.func.isRequired,
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
            showDots
          />
          <h4 align='center'>You might also like this.</h4>
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
          onFetch={this.handleFetchNext}
          onScrollBellowTheFold={this.handleScrollBellowTheFold}
          extraItem={productBox}
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
  totalCount: state.product.totalCount,
  nextPage: state.product.nextPage,
  scrollBellowTheFold: state.product.scrollBellowTheFold
})

export default connect(
  mapStateToProps,
  {
    fetchProduct,
    fetchRelatedProducts,
    resetProduct,
    setScrollBellowTheFold
  }
)(TopSingle)
