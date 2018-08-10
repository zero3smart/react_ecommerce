import axios from 'axios'
import omit from 'lodash-es/omit'
import uniqBy from 'lodash-es/uniqBy'
import { PRODUCT_COUNT_PER_PAGE } from 'config/constants'
import { LIKE_PRODUCT, UNLIKE_PRODUCT } from './product'
import { mapProductFavorites, updateProductFavorite } from './helpers'
import { Product } from 'models'

// Actions
const SET_PRODUCTS = 'products/SET_PRODUCTS'
const APPEND_PRODUCTS = 'products/APPEND_PRODUCTS'
const ENABLE_INITIAL_FETCH = 'products/ENABLE_INITIAL_FETCH'
const SET_FAVORITE_PRODUCTS = 'products/SET_FAVORITE_PRODUCTS'

const defaultState = {
  list: [],
  favoriteLists: [],
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
        list: uniqBy([...state.list, ...newProductList], 'product_id'),
        nextPage: state.nextPage + 1
      }
    case LIKE_PRODUCT:
      return { ...state, list: updateProductFavorite(payload.productId, true, state.list) }
    case UNLIKE_PRODUCT:
      return { ...state, list: updateProductFavorite(payload.productId, false, state.list) }
    case ENABLE_INITIAL_FETCH:
      return { ...state, fetched: false }
    case SET_FAVORITE_PRODUCTS:
      return { ...state, favoriteLists: payload.favoriteProducts }
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

export function enableInitialFetch () {
  return { type: ENABLE_INITIAL_FETCH }
}

// Side effects, only as applicable

/**
 * fetch product list based on specific filter
 * @param {boolean} initialFetch
 */
export function fetchProducts (initialFetch = false) {
  return async (dispatch, getState) => {
    try {
      const { products, filters } = getState()
      const nextPage = products.nextPage

      const response = await axios.get('/products/woman_top', {
        params: {
          page: nextPage,
          cnt_per_page: PRODUCT_COUNT_PER_PAGE,
          limit_per_pid: 1,
          ...omit(filters.data, 'page', 'cnt_per_page') // use page and count per page defined from the system
        }
      })

      const favoriteProductIds = Product.getFavoriteProductIds()

      // if not initial fetch, append the product
      if (initialFetch) {
        dispatch(setProducts(response.data.products, response.data.total_cnt, favoriteProductIds))
      } else {
        dispatch(appendProducts(response.data.products, favoriteProductIds))
      }

      return response
    } catch (e) {
      console.log('Error!', e)
    }
  }
}

/**
 * sync favorite products data from local storage to store
 */
export function syncFavoriteProducts () {
  const favoriteProducts = Product.getFavoriteProducts()
  return { type: SET_FAVORITE_PRODUCTS, payload: { favoriteProducts } }
}
