/**
 * enhance react component with product like handler
 */
import React, { Component } from 'react'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { likeProduct, unlikeProduct } from 'ducks/product'
import { withTrackingConsumer } from 'hoc'

export default () => WrappedComponent => {
  class ProductLikeHOC extends Component {
    static propTypes = {
      likeProduct: PropTypes.func.isRequired,
      unlikeProduct: PropTypes.func.isRequired,
      tracker: PropTypes.object.isRequired
    }

    get toggleProductLike () {
      const { likeProduct, unlikeProduct, tracker } = this.props
      return (data, favorite) => {
        if (favorite) {
          likeProduct(data, tracker)
        } else {
          unlikeProduct(data, tracker)
        }
      }
    }

    render () {
      return <WrappedComponent {...this.props} toggleProductLike={this.toggleProductLike} />
    }
  }

  return compose(connect(null, { likeProduct, unlikeProduct }), withTrackingConsumer())(ProductLikeHOC)
}
