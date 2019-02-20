/**
 * AdvancedPreset
 * a preset card with 4 matching result thumbnail
 */
import React, { Component } from 'react'
import Slider from 'react-slick'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'
import { getProducts } from '@yesplz/core-redux/ducks/products'
import { mapProductFavorites } from '@yesplz/core-redux/ducks/helpers'
import ProductGrid from '@yesplz/core-web/modules/products/ProductGrid'
import { Product } from '@yesplz/core-models'
import Preset from './Preset'
import MinimalPreset from './MinimalPreset'
import { withProductLike } from '../../hoc'
import { GroupTitle } from '../../ui-kits/misc'
import './AdvancedPreset.scss'

class AdvancedPreset extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    preset: PropTypes.object.isRequired,
    activeCategory: PropTypes.string.isRequired,
    presetMatchesCount: PropTypes.number,
    useMinimalPreset: PropTypes.bool,
    onClick: PropTypes.func,
    onToggleLike: PropTypes.func,
    toggleProductLike: PropTypes.func
  }

  static defaultProps = {
    presetMatchesCount: 4,
    useMinimalPreset: false
  }

  constructor (props) {
    super(props)
    this.state = {
      products: []
    }
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

  async componentDidMount () {
    const { preset, presetMatchesCount, activeCategory } = this.props

    // get 4 products relevant to the preset
    const response = await getProducts(activeCategory, omit(preset, 'favorite', 'name'), presetMatchesCount)
    this.setState({
      products: mapProductFavorites(Product.getFavoriteProductIds(), response.products)
    })
  }

  get handleToggleLike () {
    return (data, favorite) => {
      const { toggleProductLike } = this.props
      const { products } = this.state

      toggleProductLike(data, favorite)
      this.setState({
        products: mapProductFavorites(Product.getFavoriteProductIds(), products)
      })
    }
  }

  render () {
    const { id, preset, useMinimalPreset, activeCategory, onClick, onToggleLike } = this.props
    const { products } = this.state

    return (
      <div className='AdvancedPreset'>
        <GroupTitle>{preset.name}</GroupTitle>
        <Slider {...this.sliderSettings}>
          {
            useMinimalPreset ? (
              <MinimalPreset
                key={preset.name}
                id={id}
                name={preset.name}
                coretype={preset.coretype}
                neckline={preset.neckline}
                shoulder={preset.shoulder}
                sleeveLength={preset.sleeve_length}
                topLength={preset.top_length}
                pattern={preset.pattern}
                solid={preset.solid}
                details={preset.details}
                color={preset.color}
                favorite={preset.favorite}
                category={activeCategory}
                onClick={onClick}
                onToggleLike={onToggleLike}
              />
            ) : (
              <Preset
                key={preset.name}
                id={id}
                name={preset.name}
                coretype={preset.coretype}
                neckline={preset.neckline}
                shoulder={preset.shoulder}
                sleeveLength={preset.sleeve_length}
                topLength={preset.top_length}
                pattern={preset.pattern}
                solid={preset.solid}
                details={preset.details}
                color={preset.color}
                favorite={preset.favorite}
                category={activeCategory}
                onClick={onClick}
                onToggleLike={onToggleLike}
              />
            )
          }
          {
            products.map((product) => (
              <ProductGrid
                key={product.product_id}
                id={product.product_id}
                name={product.name}
                brand={product.brand}
                price={product.price}
                originalPrice={product.original_price}
                extraInfo={product.extra_info}
                favorite={product.favorite}
                imgSrc={product.front_img_sm}
                category={product.category}
                productBasePath={`/preset-products/${preset.name}`}
                rawData={product}
                onToggleLike={this.handleToggleLike}
                className='PresetMatches-productGrid'
              />
            ))
          }
        </Slider>
      </div>
    )
  }
}

export default withProductLike()(AdvancedPreset)
