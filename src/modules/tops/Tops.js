import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchProducts } from 'ducks/products'
import { setFilter } from 'ducks/filters'
import { ProductGrid } from 'modules/products'
import { ProductFilter } from 'modules/filters'
import Transition from 'ui-kits/transitions/Transition'
import { ScrollFetcher } from 'ui-kits/fetchers'
import { PRODUCT_COUNT_PER_PAGE } from 'config/constants'
import './tops.css'

class Tops extends Component {
  static propTypes = {
    products: PropTypes.array,
    isProductsFetched: PropTypes.bool,
    nextPage: PropTypes.number,
    fetchProducts: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired
  }

  static defaultProps = {
    products: [],
    isProductsFetched: false
  }

  componentDidMount () {
    const { isProductsFetched, fetchProducts } = this.props

    // don't need to do initial fetch if products is fetched already
    if (!isProductsFetched) {
      fetchProducts()
    }
  }

  /**
   * only applicable on next fetch, if available
   */
  get handleFetch () {
    const { fetchProducts } = this.props
    return (next) => {
      fetchProducts().then(() => {
        next()
      })
    }
  }

  get handleFilterChange () {
    const { fetchProducts, setFilter } = this.props
    return (filters) => {
      // set filter to store
      setFilter(filters)
      // fetch products based selected filter
      // start index 0 / reset product list
      fetchProducts(filters, 0)
    }
  }

  render () {
    const { products, isProductsFetched, nextPage } = this.props

    // get loaded products count
    const currentPage = (nextPage - 1)
    const loadedProductsCount = PRODUCT_COUNT_PER_PAGE * (currentPage < 0 ? 0 : currentPage)

    return (
      <div className='Tops'>
        <ProductFilter onFilterChange={this.handleFilterChange} />
        <ScrollFetcher onFetch={this.handleFetch} className='Tops-products' disableInitalFetch>
          <Transition show={isProductsFetched} transition='fadeInUp' >
            {
              products.map((product, index) => (
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
  products: state.products.list,
  isProductsFetched: state.products.fetched,
  nextPage: state.products.nextPage
})

export default connect(mapStateToProps, { fetchProducts, setFilter })(Tops)
