import axios from 'axios'
import { PRODUCT_COUNT_PER_PAGE } from 'config/constants'
import { createCancelableAsyncAction } from 'utils/async'
import { mapProductFavorites, updateProductFavorite } from './helpers'
import { syncFavoriteProducts } from 'ducks/products'
import { Product } from 'models'

// Actions
const SET_PRODUCT = 'product/SET_PRODUCT'
const RESET_PRODUCT = 'product/RESET_PRODUCT'
const SET_RELATED_PRODUCTS = 'product/SET_RELATED_PRODUCTS'
const APPEND_RELATED_PRODUCTS = 'product/APPEND_PRODUCTS'
export const LIKE_PRODUCT = 'product/LIKE_PRODUCT'
export const UNLIKE_PRODUCT = 'product/UNLIKE_PRODUCT'
const SET_SCROLL_BELLOW_THE_FOLD = 'products/SET_SCROLL_BELLOW_THE_FOLD'

const defaultState = {
  data: {}, // active product
  fetched: false,
  // related products
  relatedProducts: [],
  relatedProductsFetched: false,
  nextPage: 0,
  totalCount: 0,
  scrollBellowTheFold: false // whether products page scroll position is bellow the fold
}

// Reducer
export default function reducer (state = defaultState, action = {}) {
  const { type, payload } = action
  switch (type) {
    case SET_PRODUCT:
      return {
        ...state,
        data: payload.product,
        fetched: true
      }
    case SET_RELATED_PRODUCTS:
      return {
        ...state,
        relatedProducts: mapProductFavorites(payload.favoriteProductIds, payload.products),
        relatedProductsFetched: true,
        totalCount: payload.totalCount,
        nextPage: 1
      }
    case APPEND_RELATED_PRODUCTS:
      let newProductList = mapProductFavorites(payload.favoriteProductIds, payload.products)
      return {
        ...state,
        relatedProducts: [...state.relatedProducts, ...newProductList],
        nextPage: state.nextPage + 1
      }
    case LIKE_PRODUCT:
      let activeData = state.data

      // if active product matched with liked product, update the favorite value
      if (activeData.product_id === payload.productId) {
        activeData = {
          ...activeData,
          favorite: true
        }
      }

      return {
        ...state,
        data: activeData,
        relatedProducts: updateProductFavorite(payload.productId, true, state.relatedProducts)
      }
    case UNLIKE_PRODUCT: {
      activeData = state.data

      // if active product matched with liked product, update the favorite value
      if (activeData.product_id === payload.productId) {
        activeData = {
          ...activeData,
          favorite: false
        }
      }

      return {
        ...state,
        data: activeData,
        relatedProducts: updateProductFavorite(payload.productId, false, state.relatedProducts)
      }
    }
    case SET_SCROLL_BELLOW_THE_FOLD:
      return { ...state, scrollBellowTheFold: payload.scrollState }
    case RESET_PRODUCT:
      return defaultState
    default: return state
  }
}

// Actions creator
export function setProduct (product) {
  return { type: SET_PRODUCT, payload: { product } }
}

export function resetProduct () {
  return { type: RESET_PRODUCT }
}

export function appendRelatedProducts (products = [], favoriteProductIds = []) {
  return { type: APPEND_RELATED_PRODUCTS, payload: { products, favoriteProductIds } }
}

export function setRelatedProducts (products = [], totalCount = 0, favoriteProductIds = []) {
  return { type: SET_RELATED_PRODUCTS, payload: { products, totalCount, favoriteProductIds } }
}

export function setScrollBellowTheFold (scrollState) {
  return { type: SET_SCROLL_BELLOW_THE_FOLD, payload: { scrollState } }
}

// Side effects, only as applicable

/**
 * fetch single product, with cancelable promise support
 * @param {string} productId
 */
export const fetchProduct = createCancelableAsyncAction((productId, requestStatus = {}) => {
  return async dispatch => {
    try {
      const response = await axios.get(`/products/woman_top/${productId}`)
      const favoriteProductIds = Product.getFavoriteProductIds()

      let product = response.data.products[0]
      product = {
        ...product,
        favorite: favoriteProductIds.indexOf(product.product_id) > -1
      }

      //  put it on store as `data`
      if (!requestStatus.isCancelled) {
        dispatch(setProduct(product, favoriteProductIds))
      }

      return response
    } catch (e) {
      console.log('Error:', e)
    }
  }
})

/**
 * fetch product list based on specific filter
 * @param {Object} filters
 * @param {number} page
 */
export const fetchRelatedProducts = createCancelableAsyncAction((productId, requestStatus = {}) => {
  return async (dispatch, getState) => {
    try {
      const { product } = getState()

      const response = await axios.get('/products/woman_top', {
        params: {
          page: product.nextPage,
          cnt_per_page: PRODUCT_COUNT_PER_PAGE,
          selected_product_id: productId
        }
      })

      const favoriteProductIds = Product.getFavoriteProductIds()
      // if request is not cancelled, save data to store
      if (!requestStatus.isCancelled) {
        // if next page is more than 0, append related products to the list
        // else, reset the product
        if (product.nextPage > 0) {
          dispatch(appendRelatedProducts(response.data.products, favoriteProductIds))
        } else {
          dispatch(setRelatedProducts(response.data.products, response.data.total_cnt, favoriteProductIds))
        }
      }

      return response
    } catch (e) {
      console.log('Error!', e)
    }
  }
})

export function likeProduct (product) {
  return dispatch => {
    Product.like(product)
    // sync favorite products from local storage, temporary solutions before api ready
    dispatch(syncFavoriteProducts())

    dispatch({ type: LIKE_PRODUCT, payload: { productId: product.product_id } })
  }
}

export function unlikeProduct (productId) {
  return (dispatch) => {
    Product.unlike(productId)
    // sync favorite products from local storage, temporary solutions before api ready
    dispatch(syncFavoriteProducts())

    dispatch({ type: UNLIKE_PRODUCT, payload: { productId } })
  }
}
