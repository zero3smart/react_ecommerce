import axios from 'axios'
import omit from 'lodash/omit'
import { PRODUCT_COUNT_PER_PAGE } from '@yesplz/core-web/config/constants'
import { Product, Preset, VisualFilter } from '@yesplz/core-models'
import {
  SET_PRODUCTS, APPEND_PRODUCTS, ENABLE_INITIAL_FETCH, SET_RECOMMENDED_PRODUCTS,
  SET_ACTIVE_CATEGORY, SET_FAVORITE_PRODUCTS
} from './reducer'
import { getProducts, getRecommendedProducts } from './api'

// Actions creator
export function setProducts (category, products = [], totalCount = 0, favoriteProductIds = [], countPerPage) {
  return { type: SET_PRODUCTS, payload: { category, products, totalCount, favoriteProductIds, countPerPage } }
}

export function appendProducts (category, products = [], favoriteProductIds = [], countPerPage) {
  return { type: APPEND_PRODUCTS, payload: { category, products, favoriteProductIds, countPerPage } }
}

export function enableInitialFetch () {
  return { type: ENABLE_INITIAL_FETCH }
}

export function setRecommendedProducts (products = [], favoriteProductIds = []) {
  return { type: SET_RECOMMENDED_PRODUCTS, payload: { products, favoriteProductIds } }
}

export function setActiveCategory (activeCategory) {
  return { type: SET_ACTIVE_CATEGORY, payload: { activeCategory } }
}

// Side effects, only as applicable

/**
 * fetch product list
 * @param {string} category
 * @param {string} limitPerPage
 * @param {boolean} initialFetch
 */
export function fetchProducts (
  category, limitPerPage = PRODUCT_COUNT_PER_PAGE, initialFetch = false
) {
  return async (dispatch, getState) => {
    try {
      const { products, filters } = getState()
      const activeCategory = category || products.activeCategory
      // on initial fetch, set page should always start from 0
      const nextOffset = initialFetch ? 0 : products[activeCategory].nextOffset

      const response = await getProducts(activeCategory, {
        offset: nextOffset,
        limit_per_pid: 1,
        ...omit(filters.data, 'offset', 'limit') // use page and count per page defined from the system
      }, limitPerPage)

      const favoriteProductIds = Product.getFavoriteProductIds()

      // if not initial fetch, append the product
      if (initialFetch) {
        dispatch(setProducts(activeCategory, response.products, response.total_cnt, favoriteProductIds, limitPerPage))
      } else {
        dispatch(appendProducts(activeCategory, response.products, favoriteProductIds, limitPerPage))
      }

      return response
    } catch (e) {
      console.log('Error!', e)
    }
  }
}

/**
 * calculate and get recommended products based on current filter, favorite presets and favorite products
 * @param {number} limitPerPage number of products to be fetched
 */
export function fetchRecommendedProducts (limitPerPage = 90, category) {
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

      const response = await getRecommendedProducts(data, limitPerPage, category)

      dispatch(setRecommendedProducts(response.products, favoriteProductIds))
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
  return async (dispatch, getState) => {
    const { products } = getState()
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

        const response = await axios.get(`/categories/${products.activeCategory}/${finalProductId}`)
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
