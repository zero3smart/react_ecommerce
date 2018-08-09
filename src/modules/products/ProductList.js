import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
    onFetch: PropTypes.func.isRequired,
    extraItem: PropTypes.element,
    onToggleLike: PropTypes.func.isRequired,
    onScrollBellowTheFold: PropTypes.func.isRequired
  }

  static defaultProps = {
    products: [],
    nextPage: 0,
    show: false,
    extraItem: undefined,
    onFetch: (next) => { next() },
    onScrollBellowTheFold: (scrollState) => {}
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
    const { id, products, nextPage, show, className, extraItem, onFetch, onToggleLike } = this.props

    // get loaded products count
    const currentPage = (nextPage - 1)
    const loadedProductsCount = PRODUCT_COUNT_PER_PAGE * (currentPage < 0 ? 0 : currentPage)

    return (
      <ScrollFetcher id={id} onFetch={onFetch} onScroll={this.handleScroll} className={className} disableInitalFetch>
        {extraItem}
        {!show && <DotLoader visible style={styles.loader} />}
        <Transition show={show} transition='fadeInUp'>
          {
            products.map((product, index) => (
              <ProductGrid
                key={product.product_id}
                id={product.product_id}
                name={product.name}
                brand={product.brand}
                price={product.price}
                favorite={product.favorite}
                imgSrc={product.front_img}
                onToggleLike={onToggleLike}
                style={{
                  // `ProducGrid` need be showed directly in each page
                  animationDelay: `${50 * (index - loadedProductsCount)}ms`
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
  }
}
