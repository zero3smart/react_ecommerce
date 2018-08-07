import axios from 'axios'
import { PRODUCT_COUNT_PER_PAGE } from 'config/constants'
import { createCancelableAsyncAction } from 'utils/async'
import { Product } from 'models'

// Actions
const SET_PRODUCT = 'product/SET_PRODUCT'
const RESET_PRODUCT = 'product/RESET_PRODUCT'
const SET_RELATED_PRODUCTS = 'product/SET_RELATED_PRODUCTS'
const APPEND_RELATED_PRODUCTS = 'product/APPEND_PRODUCTS'
export const LIKE_PRODUCT = 'product/LIKE_PRODUCT'
export const UNLIKE_PRODUCT = 'product/UNLIKE_PRODUCT'

const defaultState = {
  data: {}, // active product
  fetched: false,
  // related products
  relatedProducts: [],
  relatedProductsFetched: false,
  nextPage: 0,
  totalCount: 0
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
        relatedProducts: payload.products,
        relatedProductsFetched: true,
        totalCount: payload.totalCount,
        nextPage: 1
      }
    case APPEND_RELATED_PRODUCTS:
      return {
        ...state,
        relatedProducts: [...state.relatedProducts, ...payload.products],
        nextPage: state.nextPage + 1
      }
    case LIKE_PRODUCT:
      return { ...state, data: { ...state.data, favorite: true } }
    case UNLIKE_PRODUCT:
      return { ...state, data: { ...state.data, favorite: false } }
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

export function appendRelatedProducts (products = []) {
  return { type: APPEND_RELATED_PRODUCTS, payload: { products } }
}

export function setRelatedProducts (products = [], totalCount) {
  return { type: SET_RELATED_PRODUCTS, payload: { products, totalCount } }
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

      //  put it on store as `data`
      if (!requestStatus.isCancelled) {
        dispatch(setProduct(response.data.products[0]))
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

      // if request is not cancelled, save data to store
      if (!requestStatus.isCancelled) {
        // if next page is more than 0, append related products to the list
        // else, reset the product
        if (product.nextPage > 0) {
          dispatch(appendRelatedProducts(response.data.products))
        } else {
          dispatch(setRelatedProducts(response.data.products, response.data.total_cnt))
        }
      }

      return response
    } catch (e) {
      console.log('Error!', e)
    }
  }
})

export function likeProduct (productId) {
  return (dispatch) => {
    Product.like(productId)
    dispatch({ type: LIKE_PRODUCT, payload: { productId } })
  }
}

export function unlikeProduct (productId) {
  return (dispatch) => {
    Product.unlike(productId)
    dispatch({ type: UNLIKE_PRODUCT, payload: { productId } })
  }
}
