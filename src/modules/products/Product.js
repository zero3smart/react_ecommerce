import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import includes from 'lodash/includes'
import { BASE_IMG_PATH } from 'config/constants'
import { Button, LikeButton } from 'ui-kits/buttons'
import { likeProduct, unlikeProduct } from 'ducks/product'
import Slider from 'react-slick'
import './product.css'

const AVAILABLE_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
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
    link: PropTypes.string,
    retailer: PropTypes.string,
    sizes: PropTypes.array,
    rawData: PropTypes.object,
    showArrows: PropTypes.bool,
    showDots: PropTypes.bool,
    likeProduct: PropTypes.func.isRequired,
    unlikeProduct: PropTypes.func.isRequired
  }

  static defaultProps = {
    currency: '$',
    product: {},
    extraImgs: [],
    sizes: [],
    showArrows: false,
    showDots: false
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
    const { id, rawData, favorite, likeProduct, unlikeProduct } = this.props
    return (e) => {
      e.preventDefault()
      const willLike = !favorite

      if (willLike) {
        likeProduct(rawData)
      } else {
        unlikeProduct(id)
      }
    }
  }

  render () {
    const { id, name, brand, imgSrc, extraImgs, price, originalPrice, currency, favorite, link, retailer, sizes } = this.props

    // sale is available if original price is different with price
    const isSale = originalPrice && originalPrice !== price
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
          <div className='Product-pricing'>
            {isSale && <div className='Product-original-price'>{currency}{originalPrice}</div>}
            <div className={classNames('Product-price', { sale: isSale })}>{currency}{price}</div>
          </div>
          {retailer && <p className='Product-retailer'>for {retailer}</p>}
          <ul className='Product-sizes'>
            {AVAILABLE_SIZES.map(size => (
              <li key={size} className={classNames({ notAvailable: !includes(sizes, size) })}>{size}</li>
            ))}
          </ul>
        </div>
        <div className='Product-footer'>
          <Button to={link}>Buy Now</Button>
        </div>
      </div>
    )
  }
}

export default connect(null, { likeProduct, unlikeProduct })(Product)

const renderExtraImages = (imgs = [], name = '') => (
  imgs.map((imgSrc, index) => (
    <img key={imgSrc} src={`${BASE_IMG_PATH}imgs/ns_woman_top/${imgSrc}`} alt={name} className='img-responsive' />
  ))
)
