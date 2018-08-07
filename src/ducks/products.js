import axios from 'axios'
import isNil from 'lodash-es/isNil'
import omit from 'lodash-es/omit'
import { PRODUCT_COUNT_PER_PAGE } from 'config/constants'
import { LIKE_PRODUCT, UNLIKE_PRODUCT } from './product'
import { mapProductFavorites, updateProductFavorite } from './helpers'
import { Product } from 'models'

// Actions
const SET_PRODUCTS = 'products/SET_PRODUCTS'
const APPEND_PRODUCTS = 'products/APPEND_PRODUCTS'

const defaultState = {
  list: [],
  fetched: false,
  nextPage: 0,
  totalCount: 0
}

// Reducer
export default function reducer (state = defaultState, action = {}) {
  const { type, payload } = action
  switch (type) {
    case SET_PRODUCTS:
      return {
        ...state,
        list: mapProductFavorites(payload.favoriteProductIds, payload.products),
        fetched: true,
        totalCount: payload.totalCount,
        nextPage: 1
      }
    case APPEND_PRODUCTS:
      let newProductList = mapProductFavorites(payload.favoriteProductIds, payload.products)
      return {
        ...state,
        list: [...state.list, ...newProductList],
        nextPage: state.nextPage + 1
      }
    case LIKE_PRODUCT:
      return { ...state, list: updateProductFavorite(payload.productId, true, state.list) }
    case UNLIKE_PRODUCT:
      return { ...state, list: updateProductFavorite(payload.productId, false, state.list) }
    default: return state
  }
}

// Actions creator
export function setProducts (products = [], totalCount = 0, favoriteProductIds = []) {
  return { type: SET_PRODUCTS, payload: { products, totalCount, favoriteProductIds } }
}

export function appendProducts (products = [], favoriteProductIds = []) {
  return { type: APPEND_PRODUCTS, payload: { products, favoriteProductIds } }
}

// Side effects, only as applicable

/**
 * fetch product list based on specific filter
 * @param {number} page
 */
export function fetchProducts (page = null) {
  return async (dispatch, getState) => {
    try {
      const { products, filters } = getState()
      const nextPage = isNil(page) ? products.nextPage : page

      const response = await axios.get('/products/woman_top', {
        params: {
          page: nextPage,
          cnt_per_page: PRODUCT_COUNT_PER_PAGE,
          ...omit(filters.data, 'page', 'cnt_per_page') // use page and count per page defined from the system
        }
      })

      const favoriteProductIds = Product.getFavoriteProductIds()
      // if next page is more than 0, append products to the list
      // else, reset the product
      if (nextPage > 0) {
        dispatch(appendProducts(response.data.products, favoriteProductIds))
      } else {
        dispatch(setProducts(response.data.products, response.data.total_cnt, favoriteProductIds))
      }

      return response
    } catch (e) {
      console.log('Error!', e)
    }
  }
}
