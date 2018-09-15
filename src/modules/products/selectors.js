import { createSelectorCreator, defaultMemoize } from 'reselect'
import filter from 'lodash-es/filter'
import isEqual from 'lodash-es/isEqual'

const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
)

// filter matching products, score is 95 or above
const getMatchingProducts = products => (
  filter(products, product => product.score >= 95)
)

export const matchingProductsSelector = createDeepEqualSelector(
  products => products,
  getMatchingProducts
)

// close matching products, score bellow 95
const getCloseMatchingProducts = (products) => (
  filter(products, product => product.score < 95)
)

export const closeMatchingProductsSelector = createDeepEqualSelector(
  products => products,
  getCloseMatchingProducts
)
