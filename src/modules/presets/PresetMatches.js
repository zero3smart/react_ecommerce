import React, { Component } from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash-es/omit'
import ProductGrid from 'modules/products/ProductGrid'
import { withProductLike } from 'hoc'
import './preset-matches.css'

class PresetMatches extends Component {
  static propTypes = {
    products: PropTypes.array,
    preset: PropTypes.object,
    toggleProductLike: PropTypes.func,
    onClick: PropTypes.func.isRequired
  }

  static defaultProps = {
    products: []
  }

  get handleClick () {
    const { preset, onClick } = this.props
    return () => {
      onClick(omit(preset, 'name'), preset.name)
    }
  }

  render () {
    const { products, toggleProductLike } = this.props

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
              favorite={product.favorite}
              imgSrc={product.front_img}
              rawData={product}
              onToggleLike={toggleProductLike}
              disableLike
            />
          ))
        }
        <div className='PresetLink' onClick={this.handleClick}>+ More</div>
      </div>
    )
  }
}

export default withProductLike(PresetMatches)
