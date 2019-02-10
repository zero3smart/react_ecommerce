import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ArrowLine from '../../ui-kits/icons/ArrowLine'
import SlideFetcher from '../../ui-kits/fetchers/SlideFetcher'
import ProductGrid from './ProductGrid'
import './ProductListHorizontal.scss'

class ProductListHorizontal extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    category: PropTypes.string,
    products: PropTypes.array,
    maxCount: PropTypes.number,
    limitPerPage: PropTypes.number,
    productBasePath: PropTypes.string,
    onInit: PropTypes.func.isRequired,
    onFetchNext: PropTypes.func.isRequired,
    onToggleLike: PropTypes.func.isRequired
  }

  static defaultProps = {
    products: [],
    maxCount: 100,
    limitPerPage: 10,
    productBasePath: '/products',
    onInit: () => { console.debug('Unhandled `onInit` prop') },
    onFetchNext: () => { console.debug('Unhandled `onFetchNext` prop') },
    onToggleLike: () => { console.debug('Unhandled `onToggleLike` prop') }
  }

  constructor (props) {
    super(props)
    this.handleFetch = this.handleFetch.bind(this)
  }

  componentDidMount () {
    const { category, limitPerPage, onInit } = this.props
    onInit(category, limitPerPage)
  }

  handleFetch () {
    const { category, limitPerPage, onFetchNext } = this.props
    return onFetchNext(category, limitPerPage)
  }

  render () {
    const { title, products, productBasePath, onToggleLike } = this.props

    return (
      <div className='ProductListHorizontal'>
        <h4 className='ProductListHorizontal-title'>{title} <ArrowLine width='20px' height='20px' /></h4>
        <SlideFetcher onFetch={this.handleFetch}>
          {
            products.map(product => (
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
                  showOriginalPrice: true
                }}
              />
            ))
          }
        </SlideFetcher>
      </div>
    )
  }
}

export default ProductListHorizontal
