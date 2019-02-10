import { connect } from 'react-redux'
import { compose } from 'redux'
import ProductListHorizontal from '@yesplz/core-web/modules/products/ProductListHorizontal'
import withProductLike from '@yesplz/core-web/hoc/withProductLike'
import { fetchProducts } from '@yesplz/core-redux/ducks/products'

const mapStateToProps = (state, props) => {
  const currentCategory = state.products[props.category]

  return {
    products: currentCategory.data,
    maxCount: currentCategory.limitPerPage
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  onInit (category, limitPerPage) {
    dispatch(fetchProducts(category, limitPerPage, true))
  },
  onFetchNext (category, limitPerPage) {
    return dispatch(fetchProducts(category, limitPerPage))
  },
  onToggleLike (data, favorite) {
    props.toggleProductLike(data, favorite)
  }
})

export default compose(
  withProductLike(),
  connect(mapStateToProps, mapDispatchToProps)
)(ProductListHorizontal)
