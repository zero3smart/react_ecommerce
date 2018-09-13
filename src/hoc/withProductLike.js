/**
 * enhance react component with product like handler
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { likeProduct, unlikeProduct } from 'ducks/product'

export default (WrappedComponent) => {
  class ProductLikeHOC extends Component {
    static propTypes = {
      likeProduct: PropTypes.func.isRequired,
      unlikeProduct: PropTypes.func.isRequired
    }

    get toggleProductLike () {
      const { likeProduct, unlikeProduct } = this.props
      return (data, favorite) => {
        if (favorite) {
          likeProduct(data)
        } else {
          unlikeProduct(data.product_id)
        }
      }
    }

    render () {
      return <WrappedComponent {...this.props} toggleProductLike={this.toggleProductLike} />
    }
  }

  return connect(null, { likeProduct, unlikeProduct })(ProductLikeHOC)
}
