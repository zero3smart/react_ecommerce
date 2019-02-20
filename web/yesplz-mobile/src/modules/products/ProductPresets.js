import React, { PureComponent } from 'react'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import omit from 'lodash/omit'

import { CATEGORY_TOPS } from '@yesplz/core-web/config/constants'
import { fetchPresets, syncFavoriteProducts } from '@yesplz/core-redux/ducks/products'
import withProductLike from '@yesplz/core-web/hoc/withProductLike'
import StatefulCategorizedProducts from './StatefulCategorizedProducts'

class ProductPresets extends PureComponent {
  static propTypes = {
    category: PropTypes.string,
    presets: PropTypes.array,
    favoriteProducts: PropTypes.array,
    fetchPresets: PropTypes.func.isRequired,
    syncFavoriteProducts: PropTypes.func.isRequired,
    toggleProductLike: PropTypes.func.isRequired
  }

  static defaultProps = {
    category: CATEGORY_TOPS,
    presets: [],
    favoriteProducts: []
  }

  componentDidMount () {
    const { category, fetchPresets, syncFavoriteProducts } = this.props

    fetchPresets(category)
    syncFavoriteProducts()
  }

  render () {
    const { category, presets, favoriteProducts, toggleProductLike } = this.props

    return presets.map(preset => (
      <StatefulCategorizedProducts
        key={preset.name}
        title={preset.name}
        category={category}
        favoriteProducts={favoriteProducts}
        filters={omit(preset, ['name', 'category'])}
        limitPerPage={10}
        onProductLike={toggleProductLike}
      />
    ))
  }
}

const mapStateToProps = (state, props) => ({
  presets: state.products[props.category].presets,
  favoriteProducts: state.products.favoriteList
})

export default compose(
  connect(mapStateToProps, { fetchPresets, syncFavoriteProducts }),
  withProductLike()
)(ProductPresets)
