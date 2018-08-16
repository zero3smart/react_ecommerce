import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash-es/isEqual'
import ProductGrid from './ProductGrid'
import Transition from 'ui-kits/transitions/Transition'
import { ScrollFetcher } from 'ui-kits/fetchers'
import { DotLoader } from 'ui-kits/loaders'
import { PRODUCT_COUNT_PER_PAGE } from 'config/constants'

export default class ProductList extends Component {
  static propTypes = {
    id: PropTypes.string,
    products: PropTypes.array,
    nextPage: PropTypes.number,
    show: PropTypes.bool,
    className: PropTypes.string,
    extraItem: PropTypes.element,
    showSalePrice: PropTypes.bool,
    onFetch: PropTypes.func.isRequired,
    onToggleLike: PropTypes.func.isRequired,
    onScrollBellowTheFold: PropTypes.func.isRequired
  }

  static defaultProps = {
    products: [],
    nextPage: 0,
    show: false,
    extraItem: undefined,
    showSalePrice: false,
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

  render () {
    const { id, products, nextPage, show, className, extraItem, showSalePrice, onFetch, onToggleLike } = this.props
    const { useMinimumAnimation } = this.state

    // get loaded products count
    const currentPage = (nextPage - 1)
    const loadedProductsCount = PRODUCT_COUNT_PER_PAGE * (currentPage < 0 ? 0 : currentPage)

    return (
      <ScrollFetcher id={id} onFetch={onFetch} onScroll={this.handleScroll} className={className} disableInitalFetch>
        {extraItem}
        {!show && <DotLoader visible style={styles.loader} />}
        <Transition show={show} transition={useMinimumAnimation ? 'fadeIn' : 'fadeInUp'}>
          {
            products.map((product, index) => (
              <ProductGrid
                key={product.product_id}
                id={product.product_id}
                name={product.name}
                brand={product.brand}
                price={product.price}
                originalPrice={showSalePrice ? product.original_price : undefined}
                favorite={product.favorite}
                imgSrc={product.front_img}
                onToggleLike={onToggleLike}
                style={{
                  // `ProducGrid` need be showed directly in each page
                  animationDelay: `${useMinimumAnimation ? 0 : 50 * (index - loadedProductsCount)}ms`
                }}
              />
            ))
          }
        </Transition>
      </ScrollFetcher>
    )
  }
}

const styles = {
  loader: {
    marginTop: '2vh'
  }
}
