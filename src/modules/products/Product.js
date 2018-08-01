import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchSingleProduct, setActiveProduct } from 'ducks/products'
import { BASE_API_PATH } from 'config/constants'
import { Button } from 'ui-kits/buttons'
import './product.css'

class Product extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    imgSrc: PropTypes.string.isRequired,
    currency: PropTypes.string,
    product: PropTypes.object,
    fetchSingleProduct: PropTypes.func.isRequired,
    setActiveProduct: PropTypes.func.isRequired
  }

  static defaultProps = {
    currency: '$',
    product: {}
  }

  componentDidMount () {
    const { id, fetchSingleProduct } = this.props

    // fetch single top data
    fetchSingleProduct(id)
  }

  componentWillUnmount () {
    this.props.setActiveProduct({})
  }

  render () {
    const { id, name, brand, imgSrc, price, currency, product } = this.props

    return (
      <div className='Product'>
        <div className='Product-images'>
          {imgSrc && <img src={`${BASE_API_PATH}/imgs/ns_woman_top/${imgSrc}`} alt={name} className='img-responsive' />}
        </div>
        <div className='Product-detail'>
          <h3>{brand}</h3>
          <h4>{name}</h4>
          <p>{product.description}</p>
          <div className='Product-price'>{currency}{price}</div>
        </div>
        <div className='Product-footer'>
          <Button to={`products/${id}/buy`}>Buy Now</Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  product: state.products.activeProduct
})

export default connect(
  mapStateToProps,
  {
    fetchSingleProduct,
    setActiveProduct
  }
)(Product)
