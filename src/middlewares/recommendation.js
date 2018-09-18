import includes from 'lodash-es/includes'
import { fetchRecommendedProducts } from 'ducks/products'
import { LIKE_PRODUCT, UNLIKE_PRODUCT } from 'ducks/product'

const recommendation = store => next => action => {
  const { type } = action

  // when products is liked / unlike, re-fetch the recommended products
  if (includes([LIKE_PRODUCT, UNLIKE_PRODUCT], type)) {
    store.dispatch(fetchRecommendedProducts())
  }

  return next(action)
}

export default recommendation
