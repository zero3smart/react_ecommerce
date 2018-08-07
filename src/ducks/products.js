import axios from 'axios'
import findIndex from 'lodash-es/findIndex'
import includes from 'lodash-es/includes'
import { PRODUCT_COUNT_PER_PAGE } from 'config/constants'
import { LIKE_PRODUCT, UNLIKE_PRODUCT } from './product'
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

// Reducer helpers

/**
 * update favorite of a product in product list
 * @param {string} productId
 * @param {boolean} favorite
 * @param {Object[]} products
 * @return {Object[]} products
 */
function updateProductFavorite (productId, favorite = false, products = []) {
  const productIndex = findIndex(products, { product_id: productId })
  const newProductData = { ...products[productIndex], favorite }
  return updateListByIndex(products, productIndex, newProductData)
}

/**
 * map favorite product ids to product list
 * @param {string[]} favoriteProductIds
 * @param {Object[]} products
 * @return {Object[]} products
 */
function mapProductFavorites (favoriteProductIds, products = []) {
  return products.map((product) => ({
    ...product,
    favorite: includes(favoriteProductIds, product.product_id)
  }))
}

/**
 * update list by given index
 * @param {Object[]} list
 * @param {number} objectIndex
 * @param {Object} object
 */
export function updateListByIndex (list, objectIndex, object) {
  return [ ...list.slice(0, objectIndex), object, ...list.slice(objectIndex + 1) ]
}
