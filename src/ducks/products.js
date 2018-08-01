import axios from 'axios'
import { PRODUCT_COUNT_PER_PAGE } from 'config/constants'
import { createCancelableAsyncAction } from 'utils/async'

// Actions
const SET_PRODUCTS = 'products/SET_PRODUCTS'
const APPEND_PRODUCTS = 'products/APPEND_PRODUCTS'
const SET_ACTIVE_PRODUCT = 'products/SET_ACTIVE_PRODUCT'

const defaultState = {
  list: [],
  activeProduct: {},
  fetched: false,
  nextPage: 0,
  totalCount: 0
}

// Reducer
export default function reducer (state = defaultState, action = {}) {
  const { type, payload } = action
  switch (type) {
    case SET_PRODUCTS:
      return { ...state, list: payload.products, fetched: true, totalCount: payload.totalCount, nextPage: 1 }
    case APPEND_PRODUCTS:
      return { ...state, list: [...state.list, ...payload.products], nextPage: state.nextPage + 1 }
    case SET_ACTIVE_PRODUCT:
      return { ...state, activeProduct: payload.product }
    default: return state
  }
}

// Actions creator
export function setProducts (products = [], totalCount) {
  return { type: SET_PRODUCTS, payload: { products, totalCount } }
}

export function appendProducts (products = []) {
  return { type: APPEND_PRODUCTS, payload: { products } }
}

export function setActiveProduct (product) {
  return { type: SET_ACTIVE_PRODUCT, payload: { product } }
}

// Side effects, only as applicable

/**
 * fetch product list based on specific filter
 * @param {Object} filters
 * @param {number} page
 */
export function fetchProducts (filters = {}, page = null) {
  return async (dispatch, getState) => {
    try {
      const { products } = getState()
      const nextPage = page || products.nextPage
      const response = await axios.get('/products/woman_top', {
        params: {
          page: nextPage,
          cnt_per_page: PRODUCT_COUNT_PER_PAGE,
          ...filters
          // filter to be implemented later
          // coretype: 2,
          // collar: 0,
          // solid: 0,
          // pattern: 0,
          // details: 0
        }
      })

      // if next page is more than 0, append products to the list
      // else, reset the product
      if (nextPage > 0) {
        dispatch(appendProducts(response.data.products))
      } else {
        dispatch(setProducts(response.data.products, response.data.total_cnt))
      }

      return response
    } catch (e) {
      console.log('Error!', e)
    }
  }
}

/**
 * fetch single product, with cancelable promise support
 * @param {string} productId
 */
export const fetchSingleProduct = createCancelableAsyncAction((productId, requestStatus = {}) => {
  return async dispatch => {
    try {
      const response = await axios.get(`/products/woman_top/${productId}`)

      //  put it on store as `activeProduct`
      if (!requestStatus.isCancelled) {
        dispatch(setActiveProduct(response.data.products[0]))
      }

      return response
    } catch (e) {
      console.log('Error:', e)
    }
  }
})
