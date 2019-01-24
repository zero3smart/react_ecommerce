import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Slider from 'react-slick'
import { BASE_IMG_PATH } from '@yesplz/core-web/config/constants'
import { Button, LikeButton } from '@yesplz/core-web/ui-kits/buttons'
import { withProductLike } from '../../hoc'
import { WideSlider } from '@yesplz/core-web/ui-kits/sliders'
import { IS_MOBILE } from '../../config/constants'
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
    const sliderChildren = [
      imgSrc && (
        <div className='Product-imageWrapper'>
          <div key='primary-slide' style={{ backgroundImage: `url(${BASE_IMG_PATH}/${imgSrc})` }} className='Product-image' />
        </div>
      ),
      ...renderExtraImages(extraImgs, name)
    ]

    return (
      <div id={id} className='Product'>
        <div className='container-wide'>
          <div className='Product-images'>
            <div className='LikeButton-wrapper'>
              <LikeButton active={favorite} onClick={this.toggleLike} />
            </div>
            {
              IS_MOBILE ? (
                <Slider {...this.sliderSettings}>
                  {sliderChildren}
                </Slider>
              ) : (
                <WideSlider>
                  {sliderChildren}
                </WideSlider>
              )
            }
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
      </div>
    )
  }
}

export default withProductLike()(Product)

const renderExtraImages = (imgs = [], name = '') => (
  imgs.map(imgSrc => (
    <div className='Product-imageWrapper'>
      <div key={imgSrc} style={{ backgroundImage: `url(${BASE_IMG_PATH}/${imgSrc})` }} className='Product-image' />
    </div>
  ))
)
