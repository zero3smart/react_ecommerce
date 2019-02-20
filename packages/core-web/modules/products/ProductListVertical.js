import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Button } from '@yesplz/core-web/ui-kits/buttons'
import { FetchMore } from '@yesplz/core-web/ui-kits/fetchers'
import ProductGrid from './ProductGrid'
import './ProductListVertical.scss'

class ProductListVertical extends PureComponent {
  static propTypes = {
    category: PropTypes.string,
    products: PropTypes.array,
    maxCount: PropTypes.number,
    limitPerPage: PropTypes.number,
    productBasePath: PropTypes.string,
    enableFetchNext: PropTypes.bool,
    fetchNextText: PropTypes.string,
    onInit: PropTypes.func.isRequired,
    useScrollFetcher: PropTypes.bool,
    useTwoColumnsView: PropTypes.bool,
    onFetchNext: PropTypes.func.isRequired,
    onToggleLike: PropTypes.func.isRequired
  }

  static defaultProps = {
    products: [],
    maxCount: 100,
    limitPerPage: 10,
    enableFetchNext: false,
    fetchNextText: 'See More',
    useScrollFetcher: false,
    useTwoColumnsView: false,
    onInit: (category, limitPerPage) => { console.debug('Unhandled `onInit` prop', category, limitPerPage) },
    onFetchNext: () => { console.debug('Unhandled `onFetchNext` prop') },
    onToggleLike: () => { console.debug('Unhandled `onToggleLike` prop') }
  }

  constructor (props) {
    super(props)
    this.handleFetch = this.handleFetch.bind(this)
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

  handleFetch () {
    const { products, maxCount, category, limitPerPage, onFetchNext } = this.props

    if (products.length < maxCount) {
      return onFetchNext(category, limitPerPage)
    }

    return Promise.resolve()
  }

  render () {
    const { products, category, maxCount, productBasePath, enableFetchNext, fetchNextText, useScrollFetcher, useTwoColumnsView, onToggleLike } = this.props

    return (
      <div className={classNames('ProductListVertical', { 'ProductListVertical--twoColumns': useTwoColumnsView })}>
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
              productBasePath: productBasePath || `/products/${product.category || category}`,
              showOriginalPrice: true,
              style: { marginBottom: 20 }
            }}
          />
        ))}
        {
          enableFetchNext ? (
            useScrollFetcher ? (
              <FetchMore finished={products.length >= maxCount} onFetch={this.handleFetch} />
            ) : (
              <Button kind='secondary' onClick={this.handleFetch} style={styles.button}>
                {fetchNextText}
              </Button>
            )
          ) : null
        }
      </div>
    )
  }
}

const styles = {
  button: {
    width: '100%',
    textTransform: 'uppercase'
  }
}

export default ProductListVertical
