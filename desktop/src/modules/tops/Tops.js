import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchProducts } from 'yesplz@ducks/products'
import { ProductList } from 'yesplz@modules/products'
import { VisualFilter } from 'modules/visual-filter'
import './tops.css'

class Tops extends Component {
  static propTypes = {
    products: PropTypes.array,
    isProductsFetched: PropTypes.bool,
    nextPage: PropTypes.number,
    fetchProducts: PropTypes.func.isRequired
  }

  static defaultProps = {
    products: [],
    isProductsFetched: false
  }

  componentDidMount () {
    const { isProductsFetched, fetchProducts } = this.props

    // don't need to do initial fetch if products is fetched already
    if (!isProductsFetched) {
      fetchProducts(true)
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

  render () {
    const { products, isProductsFetched, nextPage } = this.props

    return (
      <div className='Tops'>
        <VisualFilter />
        <ProductList
          id='MainScroll'
          show={isProductsFetched}
          products={products}
          nextPage={nextPage}
          showSalePrice
          className='Tops-products'
          onFetch={this.handleFetch}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  filters: state.filters.data,
  products: state.products.list,
  isProductsFetched: state.products.fetched,
  nextPage: state.products.nextPage
})

export default connect(mapStateToProps, { fetchProducts })(Tops)
