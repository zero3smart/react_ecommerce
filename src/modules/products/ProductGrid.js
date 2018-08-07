import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { BASE_IMG_PATH } from 'config/constants'
import './product-grid.css'

export default class ProductGrid extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    imgSrc: PropTypes.string.isRequired,
    currency: PropTypes.string,
    transition: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object
  }

  static defaultProps = {
    currency: '$',
    active: false,
    className: ''
  }

  render () {
    const { id, name, brand, imgSrc, price, currency, transition, className, style } = this.props

    return (
      <Link to={`/products/${id}`} className={`ProductGrid ${className}`} style={style}>
        <div className='ProductGrid-thumbnail'>
          {
            imgSrc ? (
              <img src={`${BASE_IMG_PATH}imgs/ns_woman_top/${imgSrc}`} alt={name} className='img-responsive' />
            ) : (
              <div className='ProductGrid-noImage' />
            )
          }
        </div>
        <div className='ProductGrid-detail'>
          <h5>{brand}</h5>
          <div className='ProductGrid-price'>{currency}{price}</div>
          <p>{transition}</p>
        </div>
      </Link>
    )
  }
}
