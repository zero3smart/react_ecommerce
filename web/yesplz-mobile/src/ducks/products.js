import axios from 'axios'
import omit from 'lodash-es/omit'
import uniqBy from 'lodash-es/uniqBy'
import { PRODUCT_COUNT_PER_PAGE, PRD_CATEGORY } from 'config/constants'
import { LIKE_PRODUCT, UNLIKE_PRODUCT } from './product'
import { mapProductFavorites, updateProductFavorite } from './helpers'
import { Product, Preset, VisualFilter } from '@yesplz/core-models'

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
  nextOffset: 0,
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
          nextOffset: PRODUCT_COUNT_PER_PAGE
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
        nextOffset: state.nextOffset + PRODUCT_COUNT_PER_PAGE
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
      return { ...state, fetched: false, nextOffset: 0 }
    case SET_FAVORITE_PRODUCTS:
      return { ...state, favoriteList: payload.favoriteProducts }
    case SET_RECOMMENDED_PRODUCTS:
      return {
        ...state,
        recommendedList: mapProductFavorites(payload.favoriteProductIds, payload.products)
      }
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

export function setRecommendedProducts (products = [], favoriteProductIds = []) {
  return { type: SET_RECOMMENDED_PRODUCTS, payload: { products, favoriteProductIds } }
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
      const nextOffset = initialFetch ? 0 : products.nextOffset

      const response = await axios.get(`/categories/${PRD_CATEGORY}`, {
        params: {
          offset: nextOffset,
          limit: PRODUCT_COUNT_PER_PAGE,
          limit_per_pid: 1,
          ...omit(filters.data, 'offset', 'limit') // use page and count per page defined from the system
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
export function fetchRecommendedProducts (productCount = 90) {
  return async dispatch => {
    try {
      const currentFilter = VisualFilter.getFilters()
      const favoritePresets = Preset.getFavoritePresets().map(preset => omit(preset, ['name', 'favorite']))
      const favoriteProductIds = Product.getFavoriteProductIds()
      const data = {
        wtop: {
          current: currentFilter,
          favorite_fits: favoritePresets,
          favorite_products: favoriteProductIds // ids
        }
      }

      const response = await axios.post(`/categories/${PRD_CATEGORY}/recommends`, data, {
        params: {
          offset: 0,
          limit: productCount
        }
      })

      dispatch(setRecommendedProducts(response.data.products, favoriteProductIds))
      return response.data
    } catch (e) {
      console.log('Error!', e)
    }
  }
}

/**
 * sync favorite products data from local storage to store
 * @param {boolean} syncRemote sync local data with latest backend data
 */
export function syncFavoriteProducts (syncRemote = false) {
  return async dispatch => {
    let favoriteProducts = []
    if (syncRemote) {
      // get favorite product ids and sync the data from backend
      const productIds = Product.getFavoriteProductIds()
      const favoriteProductsPromises = productIds.map(async (productId) => {
        let finalProductId = productId

        // check whether it contains xx_xxx_xxxx format
        // if not, add `ns_` prefix
        const isNewFormat = /^.+?(_).+?(_).+?$/.test(productId)
        if (!isNewFormat) {
          finalProductId = `ns_${productId}`
        }

        const response = await axios.get(`/categories/${PRD_CATEGORY}/${finalProductId}`)
        return {
          ...response.data.products[0],
          favorite: true
        }
      })

      favoriteProducts = await Promise.all(favoriteProductsPromises)

      // update data to local storage
      Product.setFavoriteProducts(favoriteProducts)
    } else {
      favoriteProducts = Product.getFavoriteProducts()
    }

    // update store data
    dispatch({ type: SET_FAVORITE_PRODUCTS, payload: { favoriteProducts } })
  }
}

// Pure async

/**
 * fetch product list using a specific filter
 * @param {object} filters
 * @param {object} count
 */
export async function getProducts (filters = {}, productCount = PRODUCT_COUNT_PER_PAGE) {
  try {
    const response = await axios.get(`/categories/${PRD_CATEGORY}`, {
      params: {
        ...filters,
        limit_per_pid: 1,
        limit: productCount
      }
    })

    return response.data
  } catch (e) {
    console.log('Error!', e)
  }
}
