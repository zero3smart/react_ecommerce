import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import isEqual from 'lodash-es/isEqual'
import ProductGrid from './ProductGrid'
import Transition from 'ui-kits/transitions/Transition'
import { ScrollFetcher } from 'ui-kits/fetchers'
import { DotLoader } from 'ui-kits/loaders'
import { likeProduct, unlikeProduct } from 'ducks/product'
import { PRODUCT_COUNT_PER_PAGE } from 'config/constants'
import './product-list.css'

const childRenderer = (props) => (
  <ProductGrid {...props} />
)

class ProductList extends Component {
  static propTypes = {
    id: PropTypes.string,
    products: PropTypes.array,
    nextPage: PropTypes.number,
    show: PropTypes.bool,
    children: PropTypes.func,
    className: PropTypes.string,
    extraItem: PropTypes.element,
    showOriginalPrice: PropTypes.bool,
    onFetch: PropTypes.func.isRequired,
    likeProduct: PropTypes.func.isRequired,
    unlikeProduct: PropTypes.func.isRequired,
    onScrollBellowTheFold: PropTypes.func.isRequired,
    loaderStyle: PropTypes.object
  }

  static defaultProps = {
    products: [],
    nextPage: 0,
    show: false,
    children: childRenderer,
    extraItem: undefined,
    showOriginalPrice: false,
    onFetch: (next) => { next() },
    onScrollBellowTheFold: (scrollState) => {}
  }

  constructor (props) {
    super(props)
    this.state = {
      useMinimumAnimation: false
    }
  }

  componentDidUpdate (prevProps) {
    // use minimum animation on second load, e.g: using filter, etc
    if (!this.state.useMinimumAnimation && this.props.show) {
      this.setState({
        useMinimumAnimation: true
      })
    }
  }

  shouldComponentUpdate (nextProps) {
    // don't rerender on `useMinimumAnimation` update
    return !isEqual(this.props, nextProps)
  }

  get handleScroll () {
    const { onScrollBellowTheFold } = this.props
    return (top) => {
      // check whether scroll position is going under the fold
      if (top > window.innerHeight) {
        onScrollBellowTheFold(true)
      } else {
        onScrollBellowTheFold(false)
      }
    }
  }

  get toggleProductLike () {
    const { likeProduct, unlikeProduct } = this.props
    return (data, favorite) => {
      if (favorite) {
        likeProduct(data)
      } else {
        unlikeProduct(data.product_id)
      }
    }
  }

  render () {
    const { id, products, nextPage, show, children, className, extraItem, showOriginalPrice, onFetch, loaderStyle } = this.props
    const { useMinimumAnimation } = this.state

    // get loaded products count
    const currentPage = (nextPage - 1)
    const loadedProductsCount = PRODUCT_COUNT_PER_PAGE * (currentPage < 0 ? 0 : currentPage)

    return (
      <ScrollFetcher id={id} onFetch={onFetch} onScroll={this.handleScroll} className={className} style={styles.wrapper} disableInitalFetch>
        {extraItem}
        <div className='ProductList-wrapper'>
          {!show && <DotLoader visible style={loaderStyle || styles.loader} />}
          <Transition show={show} transition={useMinimumAnimation ? 'fadeIn' : 'fadeInUp'}>
            {
              products.map((product, index) => {
                const props = {
                  key: product.product_id,
                  id: product.product_id,
                  name: product.name,
                  brand: product.brand,
                  price: product.price,
                  originalPrice: product.original_price,
                  showOriginalPrice: showOriginalPrice,
                  favorite: product.favorite,
                  imgSrc: product.front_img,
                  rawData: product,
                  onToggleLike: this.toggleProductLike,
                  style: {
                    // `ProducGrid` need be showed directly in each page
                    animationDelay: `${useMinimumAnimation ? 0 : 50 * (index - loadedProductsCount)}ms`
                  }
                }
                return children(props)
              })
            }
          </Transition>
        </div>
      </ScrollFetcher>
    )
  }
}

export default connect(null, { likeProduct, unlikeProduct })(ProductList)

const styles = {
  wrapper: {
    position: 'relative'
  },
  loader: {
    position: 'absolute',
    margin: 'auto',
    top: 10,
    right: 0,
    bottom: 0,
    left: 0,
    width: 100,
    height: 30
  }
}
