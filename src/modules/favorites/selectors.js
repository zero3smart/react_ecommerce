import { createSelector } from 'reselect'
import filter from 'lodash-es/filter'

// getters
const getProducts = (state) => (state.products.list)
const getFavoriteProducts = (products) => (
  filter(products, 'favorite')
)

// selectors
export const favoriteProductsSelector = createSelector(getProducts, getFavoriteProducts)
