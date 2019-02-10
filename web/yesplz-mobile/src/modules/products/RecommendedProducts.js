import { connect } from 'react-redux'
import { compose } from 'redux'
import ProductListVertical from '@yesplz/core-web/modules/products/ProductListVertical'
import withProductLike from '@yesplz/core-web/hoc/withProductLike'
import { fetchRecommendedProducts } from '@yesplz/core-redux/ducks/products'

const mapStateToProps = (state, props) => {
  return {
    products: state.products.recommendedList
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  onInit (_, limitPerPage) {
    dispatch(fetchRecommendedProducts(limitPerPage))
  },
  onToggleLike (data, favorite) {
    props.toggleProductLike(data, favorite)
  }
})

export default compose(
  withProductLike(),
  connect(mapStateToProps, mapDispatchToProps)
)(ProductListVertical)
