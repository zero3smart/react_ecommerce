import React, { Component } from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash-es/omit'
import ProductGrid from '@yesplz/core-web/modules/products/ProductGrid'
import { withProductLike } from '../../hoc'
import './preset-matches.css'

class PresetMatches extends Component {
  static propTypes = {
    products: PropTypes.array,
    preset: PropTypes.object,
    toggleProductLike: PropTypes.func,
    onClick: PropTypes.func.isRequired,
    onToggleLike: PropTypes.func
  }

  static defaultProps = {
    products: [],
    onToggleLike: (data, favorite) => { console.debug('PresetMatches - favorite', data) }
  }

  get handleClick () {
    const { preset, onClick } = this.props
    return () => {
      onClick(omit(preset, 'name'), preset.name)
    }
  }

  get handleToggleLike () {
    const { toggleProductLike, onToggleLike } = this.props
    return (data, favorite) => {
      toggleProductLike(data, favorite)
      onToggleLike(data, favorite)
    }
  }

  render () {
    const { products, preset } = this.props

    return (
      <div className='PresetMatches'>
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
              productBasePath={`/preset-products/${preset.name}`}
              rawData={product}
              onToggleLike={this.handleToggleLike}
            />
          ))
        }
        <div className='PresetLink' onClick={this.handleClick}>+ More</div>
      </div>
    )
  }
}

export default withProductLike()(PresetMatches)
