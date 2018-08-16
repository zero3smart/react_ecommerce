import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { BASE_IMG_PATH } from 'config/constants'
import { LikeButton } from 'ui-kits/buttons'
import './product-grid.css'

export default class ProductGrid extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    imgSrc: PropTypes.string.isRequired,
    currency: PropTypes.string,
    className: PropTypes.string,
    favorite: PropTypes.bool,
    onToggleLike: PropTypes.func,
    style: PropTypes.object
  }

  static defaultProps = {
    currency: '$',
    active: false,
    favorite: false,
    className: '',
    onToggleLike: (id, favorite) => { console.debug('ProductGrid - favorite', favorite) }
  }

  constructor (props) {
    super(props)
    this.state = {
      liked: false
    }
  }

  get toggleLike () {
    const { id, favorite, onToggleLike } = this.props
    return (e) => {
      e.preventDefault()
      onToggleLike(id, !favorite)
    }
  }

  render () {
    const { id, name, brand, imgSrc, price, originalPrice, currency, className, favorite, style } = this.props

    // sale is available if original price is different with price
    const isSale = originalPrice && originalPrice !== price
    return (
      <Link to={`/products/${id}`} className={`ProductGrid ${className}`} style={style} title={`${name} - ${brand}`}>
        <LikeButton active={favorite} onClick={this.toggleLike} />
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
          <div className='ProductGrid-price-tag'>
            {isSale && <div className='ProductGrid-original-price'>{currency}{originalPrice}</div>}
            <div className={classNames('ProductGrid-price', { sale: isSale })}>
              {currency}{price}
            </div>
          </div>
        </div>
      </Link>
    )
  }
}
