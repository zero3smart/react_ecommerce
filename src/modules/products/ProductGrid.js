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
    showOriginalPrice: PropTypes.bool,
    imgSrc: PropTypes.string.isRequired,
    currency: PropTypes.string,
    className: PropTypes.string,
    extraInfo: PropTypes.string,
    favorite: PropTypes.bool,
    productBasePath: PropTypes.string,
    rawData: PropTypes.object,
    disableLike: PropTypes.bool,
    onToggleLike: PropTypes.func,
    style: PropTypes.object
  }

  static defaultProps = {
    currency: '$',
    active: false,
    favorite: false,
    showOriginalPrice: false,
    disableLike: false,
    className: '',
    productBasePath: '/products',
    onToggleLike: (data, favorite) => { console.debug('ProductGrid - favorite', data) }
  }

  constructor (props) {
    super(props)
    this.state = {
      liked: false
    }
  }

  get toggleLike () {
    const { rawData, favorite, onToggleLike } = this.props
    return (e) => {
      e.preventDefault()
      onToggleLike(rawData, !favorite)
    }
  }

  render () {
    const { id, name, brand, imgSrc, price, originalPrice, currency, className, favorite, showOriginalPrice, productBasePath, disableLike, style, extraInfo } = this.props

    // sale is available if original price is different with price
    const isSale = originalPrice && originalPrice !== price
    return (
      <Link to={`${productBasePath}/${id}`} className={`ProductGrid ${className}`} style={style} title={`${name} - ${brand}${extraInfo}`}>
        {!disableLike && <LikeButton active={favorite} onClick={this.toggleLike} />}
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
          <h5 dangerouslySetInnerHTML={{ __html: brand }} />
          <div className='ProductGrid-price-tag'>
            {isSale && showOriginalPrice && <div className='ProductGrid-original-price'>{currency}{originalPrice}</div>}
            <div className={classNames('ProductGrid-price', { sale: isSale })}>
              {currency}{price}
            </div>
          </div>
        </div>
      </Link>
    )
  }
}
