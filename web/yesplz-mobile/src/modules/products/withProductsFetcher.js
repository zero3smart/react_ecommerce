import { connect } from 'react-redux'
import { compose } from 'redux'
import withProductLike from '@yesplz/core-web/hoc/withProductLike'
import { fetchProducts } from '@yesplz/core-redux/ducks/products'

const mapStateToProps = (state, props) => {
  const currentCategory = state.products[props.category]

  return {
    products: currentCategory.data,
    filters: {
      ...state.filters.data,
      ...state.filters.secondary
    },
    maxCount: currentCategory.limitPerPage
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  onInit (category, limitPerPage) {
    dispatch(fetchProducts(category, props.filters, limitPerPage, true))
  },
  onFilter (category, filters, limitPerPage) {
    dispatch(fetchProducts(category, filters, limitPerPage, true))
  },
  onFetchNext (category, limitPerPage) {
    return dispatch(fetchProducts(category, props.filters, limitPerPage))
  },
  onToggleLike (data, favorite) {
    props.toggleProductLike(data, favorite)
  }
})

/**
 * enhance component with products fetcher
 * @param {Object} customFilters
 */
export default function withProductsFetcher (WrappedComponent) {
  return compose(
    withProductLike(),
    connect(mapStateToProps, mapDispatchToProps)
  )(WrappedComponent)
}
