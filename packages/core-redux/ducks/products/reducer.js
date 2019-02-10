import uniqBy from 'lodash/uniqBy'
import {
  CATEGORY_TOPS, CATEGORY_SHOES, CATEGORY_PANTS,
  PRODUCT_COUNT_PER_PAGE, PRD_CATEGORY
} from '@yesplz/core-web/config/constants'
import { LIKE_PRODUCT, UNLIKE_PRODUCT } from '../product'
import { mapProductFavorites, updateProductFavorite } from '../helpers'

// Actions
export const SET_PRODUCTS = 'products/SET_PRODUCTS'
export const APPEND_PRODUCTS = 'products/APPEND_PRODUCTS'
export const ENABLE_INITIAL_FETCH = 'products/ENABLE_INITIAL_FETCH'
export const SET_FAVORITE_PRODUCTS = 'products/SET_FAVORITE_PRODUCTS'
export const SET_RECOMMENDED_PRODUCTS = 'products/SET_RECOMMENDED_PRODUCTS'
export const SET_ACTIVE_CATEGORY = 'products/SET_ACTIVE_CATEGORY'

const defaultState = {
  [CATEGORY_TOPS]: {
    data: [],
    nextOffset: 0,
    totalCount: 0,
    fetched: false,
    willBeEmptyList: false
  },
  [CATEGORY_SHOES]: {
    data: [],
    nextOffset: 0,
    totalCount: 0,
    fetched: false,
    willBeEmptyList: false
  },
  [CATEGORY_PANTS]: {
    data: [],
    nextOffset: 0,
    totalCount: 0,
    fetched: false,
    willBeEmptyList: false
  },
  favoriteList: [],
  recommendedList: [],
  activeCategory: PRD_CATEGORY
}

// Reducer
export default function reducer (state = defaultState, action = {}) {
  const { type, payload } = action
  switch (type) {
    case SET_PRODUCTS:
      let updatedState = {}
      const list = mapProductFavorites(payload.favoriteProductIds, payload.products)

      // if list is updated with new set of data (filters change) and the date is empty,
      // don't update it directly, but instead, set `willBeEmptyList` flag to true.
      // we need this to warn user about empty result from current filters,
      // but still keeping the previous data set in the background.
      if (state.fetched && list.length === 0) {
        updatedState = {
          willBeEmptyList: true
        }
      } else {
        updatedState = {
          [payload.category]: {
            data: list,
            willBeEmptyList: list.length === 0,
            fetched: true,
            totalCount: payload.totalCount,
            nextOffset: payload.countPerPage || PRODUCT_COUNT_PER_PAGE
          }
        }
      }

      return {
        ...state,
        ...updatedState
      }
    case APPEND_PRODUCTS:
      let newProductList = mapProductFavorites(payload.favoriteProductIds, payload.products)
      return {
        ...state,
        [payload.category]: {
          ...state[payload.category],
          data: uniqBy([...state[payload.category].data, ...newProductList], 'product_id'),
          nextOffset: state[payload.category].nextOffset + (payload.countPerPage || PRODUCT_COUNT_PER_PAGE)
        }
      }
    case LIKE_PRODUCT:
      return {
        ...state,
        [payload.category]: {
          ...state[payload.category],
          data: updateProductFavorite(payload.productId, true, state[payload.category].data)
        },
        recommendedList: updateProductFavorite(payload.productId, true, state.recommendedList)
      }
    case UNLIKE_PRODUCT:
      return {
        ...state,
        [payload.category]: {
          ...state[payload.category],
          data: updateProductFavorite(payload.productId, false, state[payload.category].data)
        },
        recommendedList: updateProductFavorite(payload.productId, false, state.recommendedList)
      }
    case ENABLE_INITIAL_FETCH:
      return { ...state, fetched: false, nextOffset: 0 }
    case SET_FAVORITE_PRODUCTS:
      return { ...state, favoriteList: payload.favoriteProducts }
    case SET_RECOMMENDED_PRODUCTS:
      return {
        ...state,
        recommendedList: mapProductFavorites(payload.favoriteProductIds, payload.products)
      }
    case SET_ACTIVE_CATEGORY:
      return {
        ...state,
        activeCategory: payload.activeCategory
      }
    default: return state
  }
}
