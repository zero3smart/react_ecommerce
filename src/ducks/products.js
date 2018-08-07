import axios from 'axios'
import { PRODUCT_COUNT_PER_PAGE } from 'config/constants'

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
      return { ...state, list: payload.products, fetched: true, totalCount: payload.totalCount, nextPage: 1 }
    case APPEND_PRODUCTS:
      return { ...state, list: [...state.list, ...payload.products], nextPage: state.nextPage + 1 }
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
