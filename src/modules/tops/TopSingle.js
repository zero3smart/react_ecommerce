import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { PRODUCT_COUNT_PER_PAGE } from 'config/constants'
import Transition from 'ui-kits/transitions/Transition'
import { ScrollFetcher } from 'ui-kits/fetchers'
import { Product, ProductGrid, ProductPlaceholder } from 'modules/products'
import { fetchProduct, fetchRelatedProducts, resetProduct } from 'ducks/singleProduct'
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
    const { productId, fetchRelatedProducts } = this.props
    return (next) => {
      // fetch next related products
      this.relatedsRequest = fetchRelatedProducts(productId)
      this.relatedsRequest.then(() => {
        next()
      })
    }
  }

  render () {
    const { product, relatedProducts, isProductFetched, isRelatedProductsFetched, nextPage } = this.props

    // get loaded products count
    const currentPage = (nextPage - 1)
    const loadedProductsCount = PRODUCT_COUNT_PER_PAGE * (currentPage < 0 ? 0 : currentPage)

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
            />
          ) : (
            <ProductPlaceholder />
          )
        }
        <ScrollFetcher onFetch={this.handleFetchNext} className='TopSingle-products' disableInitalFetch>
          <Transition show={isRelatedProductsFetched} transition='fadeInUp' >
            {
              relatedProducts.map((product, index) => (
                <ProductGrid
                  key={product.product_id}
                  id={product.product_id}
                  name={product.name}
                  brand={product.brand}
                  price={product.price}
                  imgSrc={product.front_img}
                  style={{
                    // `ProducGrid` need be showed directly in each page
                    animationDelay: `${50 * (index - loadedProductsCount)}ms`
                  }}
                />
              ))
            }
          </Transition>
        </ScrollFetcher>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  product: state.singleProduct.data,
  productId: props.match.params.productId,
  isProductFetched: state.singleProduct.fetched,
  isRelatedProductsFetched: state.singleProduct.relatedProductsFetched,
  relatedProducts: state.singleProduct.relatedProducts,
  nextPage: state.singleProduct.nextPage
})

export default connect(mapStateToProps, { fetchProduct, fetchRelatedProducts, resetProduct })(TopSingle)
