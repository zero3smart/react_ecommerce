import axios from 'axios'
import omit from 'lodash-es/omit'
import uniqBy from 'lodash-es/uniqBy'
import { PRODUCT_COUNT_PER_PAGE } from 'config/constants'
import { LIKE_PRODUCT, UNLIKE_PRODUCT } from './product'
import { mapProductFavorites, updateProductFavorite } from './helpers'
import { Product, Preset, VisualFilter } from 'models'

// Actions
const SET_PRODUCTS = 'products/SET_PRODUCTS'
const APPEND_PRODUCTS = 'products/APPEND_PRODUCTS'
const ENABLE_INITIAL_FETCH = 'products/ENABLE_INITIAL_FETCH'
const SET_FAVORITE_PRODUCTS = 'products/SET_FAVORITE_PRODUCTS'
const SET_RECOMMENDED_PRODUCTS = 'products/SET_RECOMMENDED_PRODUCTS'

const defaultState = {
  list: [],
  favoriteList: [],
  recommendedList: [],
  fetched: false,
  willBeEmptyList: false,
  nextPage: 0,
  totalCount: 0
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
          list,
          willBeEmptyList: list.length === 0,
          fetched: true,
          totalCount: payload.totalCount,
          nextPage: 1
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
        list: uniqBy([...state.list, ...newProductList], 'product_id'),
        nextPage: state.nextPage + 1
      }
    case LIKE_PRODUCT:
      return {
        ...state,
        list: updateProductFavorite(payload.productId, true, state.list),
        recommendedList: updateProductFavorite(payload.productId, true, state.recommendedList)
      }
    case UNLIKE_PRODUCT:
      return {
        ...state,
        list: updateProductFavorite(payload.productId, false, state.list),
        recommendedList: updateProductFavorite(payload.productId, false, state.recommendedList)
      }
    case ENABLE_INITIAL_FETCH:
      return { ...state, fetched: false, nextPage: 0 }
    case SET_FAVORITE_PRODUCTS:
      return { ...state, favoriteList: payload.favoriteProducts }
    case SET_RECOMMENDED_PRODUCTS:
      return { ...state, recommendedList: payload.products }
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

export function setRecommendedProducts (products = []) {
  return { type: SET_RECOMMENDED_PRODUCTS, payload: { products } }
}

// Side effects, only as applicable

/**
 * fetch product list
 * @param {boolean} initialFetch
 */
export function fetchProducts (initialFetch = false) {
  return async (dispatch, getState) => {
    try {
      const { products, filters } = getState()
      // on initial fetch, set page should always start from 0
      const nextPage = initialFetch ? 0 : products.nextPage

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
 * calculate and get recommended products based on current filter, favorite presets and favorite products
 * @param productCount number of products to be fetched
 */
export function fetchRecommendedProducts (productCount = 9) {
  return async dispatch => {
    try {
      const currentFilter = VisualFilter.getFilters()
      const favoritePresets = Preset.getFavoritePresets().map(preset => omit(preset, ['name', 'favorite']))
      const favoriteProductIds = Product.getFavoriteProductIds()
      const data = {
        woman_top: {
          current: currentFilter,
          favorite_fits: favoritePresets,
          favorite_products: favoriteProductIds // ids
        }
      }

      const response = await axios.post('/products/recommend', data, {
        params: {
          page: 0,
          cnt_per_page: productCount
        }
      })
      dispatch(setRecommendedProducts(response.data.products))
      return response.data
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

// Pure async

/**
 * fetch product list using a specific filter
 * @param {object} filters
 * @param {object} count
 */
export async function getProducts (filters = {}, productCount = PRODUCT_COUNT_PER_PAGE) {
  try {
    const response = await axios.get('/products/woman_top', {
      params: {
        ...filters,
        limit_per_pid: 1,
        cnt_per_page: productCount
      }
    })

    return response.data
  } catch (e) {
    console.log('Error!', e)
  }
}
