import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash-es/isEqual'
import ProductGrid from './ProductGrid'
import Transition from 'ui-kits/transitions/Transition'
import { ScrollFetcher } from 'ui-kits/fetchers'
import { DotLoader } from 'ui-kits/loaders'
import ProductsNotFound from './ProductsNotFound'
import { PRODUCT_COUNT_PER_PAGE } from 'config/constants'
import { withProductLike } from 'hoc'
import { productGroupsSelector } from './selectors'
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
    willBeEmptyList: PropTypes.bool,
    showOriginalPrice: PropTypes.bool,
    combined: PropTypes.bool,
    onFetch: PropTypes.func.isRequired,
    toggleProductLike: PropTypes.func.isRequired,
    onScrollBellowTheFold: PropTypes.func.isRequired,
    onScrollChange: PropTypes.func.isRequired,
    style: PropTypes.object,
    loaderStyle: PropTypes.object
  }

  static defaultProps = {
    products: [],
    nextPage: 0,
    willBeEmptyList: false,
    show: false,
    combined: false, // when activated, it won't separate matching and close matching.
    children: childRenderer,
    extraItem: undefined,
    showOriginalPrice: false,
    style: {},
    onFetch: (next) => { next() },
    onScrollBellowTheFold: (scrollState) => {},
    onScrollChange: (scrollTop) => {}
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
    const { onScrollBellowTheFold, onScrollChange } = this.props
    return (top) => {
      onScrollChange(top)
      // check whether scroll position is going under the fold
      if (top > window.innerHeight) {
        onScrollBellowTheFold(true)
      } else {
        onScrollBellowTheFold(false)
      }
    }
  }

  render () {
    const {
      id,
      products,
      nextPage,
      show,
      children,
      className,
      extraItem,
      showOriginalPrice,
      onFetch,
      willBeEmptyList,
      style,
      loaderStyle,
      toggleProductLike,
      combined
    } = this.props
    const { useMinimumAnimation } = this.state

    // get loaded products count
    const currentPage = (nextPage - 1)
    const loadedProductsCount = PRODUCT_COUNT_PER_PAGE * (currentPage < 0 ? 0 : currentPage)

    // get products
    // when `combined` is `true`, product list should render all products without separating the score
    let productList = null
    if (combined) {
      productList = renderProducts(products, children, showOriginalPrice, toggleProductLike, useMinimumAnimation, loadedProductsCount)
    } else {
      const { matchingProducts, closeMatchingProducts } = productGroupsSelector(products)
      productList = (
        <React.Fragment>
          {renderProducts(matchingProducts, children, showOriginalPrice, toggleProductLike, useMinimumAnimation, loadedProductsCount)}
          {closeMatchingProducts.length > 0 ? <h4 className='animated fadeIn' style={styles.subTitle}>The next close matching</h4> : <div style={{ display: 'none' }} />}
          {renderProducts(closeMatchingProducts, children, showOriginalPrice, toggleProductLike, useMinimumAnimation, loadedProductsCount)}
        </React.Fragment>
      )
    }

    return (
      <ScrollFetcher
        id={id}
        onFetch={onFetch}
        onScroll={this.handleScroll}
        className={className}
        style={{ ...styles.wrapper, overflowY: willBeEmptyList ? 'hidden' : 'scroll', ...style }}
        disableInitalFetch
      >
        {willBeEmptyList && <ProductsNotFound style={styles.notFound} />}
        {extraItem}
        <div className='ProductList-wrapper'>
          {!show && <DotLoader visible style={loaderStyle || styles.loader} />}
          <Transition show={show} transition={useMinimumAnimation ? 'fadeIn' : 'fadeInUp'}>
            {productList}
          </Transition>
        </div>
      </ScrollFetcher>
    )
  }
}

export default withProductLike(ProductList)

const renderProducts = (products, children, showOriginalPrice, toggleProductLike, useMinimumAnimation, loadedProductsCount) => (
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
      onToggleLike: toggleProductLike,
      style: {
        // `ProducGrid` need be showed directly in each page
        animationDelay: `${useMinimumAnimation ? 0 : 50 * (index - loadedProductsCount)}ms`
      }
    }
    return children(props)
  })
)

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
  },
  notFound: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3
  },
  subTitle: {
    flexBasis: '100%',
    marginBottom: 10,
    order: 1,
    padding: '0px 10px'
  }
}
