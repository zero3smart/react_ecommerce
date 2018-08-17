import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { BASE_IMG_PATH } from 'config/constants'
import { Button, LikeButton } from 'ui-kits/buttons'
import Slider from 'react-slick'
import './product.css'

export default class Product extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    imgSrc: PropTypes.string.isRequired,
    extraImgs: PropTypes.array,
    currency: PropTypes.string,
    favorite: PropTypes.bool,
    description: PropTypes.string,
    link: PropTypes.string,
    showArrows: PropTypes.bool,
    showDots: PropTypes.bool,
    onToggleLike: PropTypes.func
  }

  static defaultProps = {
    currency: '$',
    product: {},
    extraImgs: [],
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
    const { id, favorite, onToggleLike } = this.props
    return (e) => {
      e.preventDefault()
      onToggleLike(id, !favorite)
    }
  }

  render () {
    const { id, name, brand, imgSrc, extraImgs, price, currency, description, favorite, link } = this.props

    return (
      <div id={id} className='Product'>
        <LikeButton active={favorite} onClick={this.toggleLike} />
        <div className='Product-images'>
          <Slider {...this.sliderSettings}>
            {imgSrc && <img src={`${BASE_IMG_PATH}imgs/ns_woman_top/${imgSrc}`} alt={name} className='img-responsive' />}
            {renderExtraImages(extraImgs, name)}
          </Slider>
        </div>
        <div className='Product-detail'>
          <h3>{brand}</h3>
          <h4>{name}</h4>
          <p>{description}</p>
          <div className='Product-price'>{currency}{price}</div>
        </div>
        <div className='Product-footer'>
          <Button to={link}>Buy Now</Button>
        </div>
      </div>
    )
  }
}

const renderExtraImages = (imgs = [], name = '') => (
  imgs.map((imgSrc, index) => (
    <img key={imgSrc} src={`${BASE_IMG_PATH}imgs/ns_woman_top/${imgSrc}`} alt={name} className='img-responsive' />
  ))
)
