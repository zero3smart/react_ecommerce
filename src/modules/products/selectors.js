import { createSelectorCreator, defaultMemoize } from 'reselect'
import isEqual from 'lodash-es/isEqual'

const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
)

// product group
const getProductGroups = (products) => {
  // Separate matching products and close matching products
  // Any matching result lower than the score threshold (`95` default) should be close matching
  return products.reduce((groups, product) => {
    if (product.score < 95) {
      return {
        ...groups,
        closeMatchingProducts: [...groups.closeMatchingProducts, product]
      }
    } else {
      return {
        ...groups,
        matchingProducts: [...groups.matchingProducts, product]
      }
    }
  }, { matchingProducts: [], closeMatchingProducts: [] })
}

export const productGroupsSelector = createDeepEqualSelector(
  products => products,
  getProductGroups
)
