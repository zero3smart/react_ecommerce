import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ArrowLine from '../../ui-kits/icons/ArrowLine'
import ProductGrid from './ProductGrid'

class ProductListVertical extends PureComponent {
  static propTypes = {
    category: PropTypes.string,
    products: PropTypes.array,
    maxCount: PropTypes.number,
    limitPerPage: PropTypes.number,
    productBasePath: PropTypes.string,
    onToggleLike: PropTypes.func.isRequired,
    onInit: PropTypes.func.isRequired
  }

  static defaultProps = {
    products: [],
    maxCount: 100,
    limitPerPage: 10,
    productBasePath: '/products',
    onInit: (category, limitPerPage) => { console.debug('Unhandled `onInit` prop', category, limitPerPage) },
    onToggleLike: () => { console.debug('Unhandled `onToggleLike` prop') }
  }

  componentDidMount () {
    const { category, limitPerPage } = this.props
    this.props.onInit(category, limitPerPage)
  }

  get sliderSettings () {
    return {
      dots: false,
      arrows: false,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    }
  }

  render () {
    const { products, productBasePath, onToggleLike } = this.props

    return (
      <div className='ProductListVertical'>
        {products.map(product => (
          <ProductGrid
            {...{
              key: product.product_id,
              id: product.product_id,
              name: product.name,
              brand: product.brand,
              price: product.price,
              originalPrice: product.original_price,
              extraInfo: product.extra_info,
              category: product.category,
              favorite: product.favorite,
              imgSrc: product.front_img_sm,
              rawData: product,
              onToggleLike: onToggleLike,
              productBasePath: productBasePath,
              showOriginalPrice: true,
              style: { marginBottom: 20 }
            }}
          />
        ))}
      </div>
    )
  }
}

export default ProductListVertical
