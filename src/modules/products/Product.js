import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { BASE_IMG_PATH } from 'config/constants'
import { Button, LikeButton } from 'ui-kits/buttons'
import { withProductLike } from 'hoc'
import Slider from 'react-slick'
import './product.css'

class Product extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    imgSrc: PropTypes.string.isRequired,
    extraImgs: PropTypes.array,
    currency: PropTypes.string,
    favorite: PropTypes.bool,
    description: PropTypes.string,
    extraInfo: PropTypes.string,
    link: PropTypes.string,
    retailer: PropTypes.string,
    sizes: PropTypes.array,
    rawData: PropTypes.object,
    showArrows: PropTypes.bool,
    showDots: PropTypes.bool,
    tracker: PropTypes.object,
    toggleProductLike: PropTypes.func.isRequired
  }

  static defaultProps = {
    currency: '$',
    product: {},
    extraImgs: [],
    sizes: [],
    showArrows: false,
    showDots: false
  }

  componentDidMount () {
    const { tracker, id, brand } = this.props

    tracker.registerTrackLinks('#BuyNow', 'Buy Now Button', { product_id: id, brand: brand })
  }

  get sliderSettings () {
    const { showArrows, showDots } = this.props
    return {
      dots: showDots,
      arrows: showArrows,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    }
  }

  get toggleLike () {
    const { rawData, favorite, toggleProductLike } = this.props
    return (e) => {
      e.preventDefault()
      toggleProductLike(rawData, !favorite)
    }
  }

  render () {
    const { id, name, brand, imgSrc, extraImgs, price, originalPrice, currency, favorite, link, retailer, sizes } = this.props

    // sale is available if original price is different with price
    const isSale = originalPrice && originalPrice !== price
    const isOutOfStock = price === 0

    return (
      <div id={id} className='Product'>
        <div className='Product-images'>
          <div className='LikeButton-wrapper'>
            <LikeButton active={favorite} onClick={this.toggleLike} />
          </div>
          <Slider {...this.sliderSettings}>
            {imgSrc && <img src={`${BASE_IMG_PATH}imgs/ns_woman_top/${imgSrc}`} alt={name} className='img-responsive' />}
            {renderExtraImages(extraImgs, name)}
          </Slider>
        </div>
        <div className='Product-detail'>
          <h3 dangerouslySetInnerHTML={{ __html: brand }} />
          <h4 dangerouslySetInnerHTML={{ __html: name }} />
          {
            !isOutOfStock && (
              <div className='Product-pricing'>
                {isSale && <div className='Product-original-price'>{currency}{originalPrice}</div>}
                <div className={classNames('Product-price', { sale: isSale })}>{currency}{price}</div>
              </div>
            )
          }
          {retailer && <p className='Product-retailer'>from {retailer}</p>}
          {!isOutOfStock && <p>Available Sizes:</p>}
          <ul className='Product-sizes'>
            {sizes.map(size => (
              <li key={size}>{size}</li>
            ))}
          </ul>
        </div>
        <div className='Product-footer'>
          {isOutOfStock ? <p className='Product-out-of-stock'>Out of Stock</p> : <Button id='BuyNow' to={link}>Buy Now</Button>}
        </div>
      </div>
    )
  }
}

export default withProductLike()(Product)

const renderExtraImages = (imgs = [], name = '') => (
  imgs.map((imgSrc, index) => (
    <img key={imgSrc} src={`${BASE_IMG_PATH}imgs/ns_woman_top/${imgSrc}`} alt={name} className='img-responsive' />
  ))
)
