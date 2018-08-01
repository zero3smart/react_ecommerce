import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchProducts } from 'ducks/products'
import { ProductGrid } from 'modules/products'
import Transition from 'ui-kits/transitions/Transition'
import './tops.css'

class Tops extends Component {
  static propTypes = {
    products: PropTypes.array,
    isProductsFetched: PropTypes.bool,
    productId: PropTypes.string,
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
      fetchProducts()
    }
  }

  render () {
    const { products, productId, isProductsFetched } = this.props

    return (
      <div className='Tops-products'>
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
                active={productId === product.product_id}
                style={{ animationDelay: `${50 * index}ms` }}
              />
            ))
          }
        </Transition>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  products: state.products.list,
  isProductsFetched: state.products.fetched,
  productId: props.match.params.productId
})

export default connect(mapStateToProps, { fetchProducts })(Tops)
