import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { BASE_IMG_PATH } from 'config/constants'
import { Button, LikeButton } from 'ui-kits/buttons'
import './product.css'

export default class Product extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    imgSrc: PropTypes.string.isRequired,
    currency: PropTypes.string,
    favorite: PropTypes.bool,
    description: PropTypes.string,
    onToggleLike: PropTypes.func
  }

  static defaultProps = {
    currency: '$',
    product: {}
  }

  get toggleLike () {
    const { id, favorite, onToggleLike } = this.props
    return (e) => {
      e.preventDefault()
      onToggleLike(id, !favorite)
    }
  }

  render () {
    const { id, name, brand, imgSrc, price, currency, description, favorite } = this.props

    return (
      <div className='Product'>
        <div className='Product-images'>
          <LikeButton active={favorite} onClick={this.toggleLike} />
          {imgSrc && <img src={`${BASE_IMG_PATH}imgs/ns_woman_top/${imgSrc}`} alt={name} className='img-responsive' />}
        </div>
        <div className='Product-detail'>
          <h3>{brand}</h3>
          <h4>{name}</h4>
          <p>{description}</p>
          <div className='Product-price'>{currency}{price}</div>
        </div>
        <div className='Product-footer'>
          <Button to={`products/${id}/buy`}>Buy Now</Button>
        </div>
      </div>
    )
  }
}
