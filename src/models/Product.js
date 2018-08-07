import { FAVORITE_PRODUCTS } from 'config/constants'
import uniq from 'lodash-es/uniq'
import without from 'lodash-es/without'

const { localStorage } = window

export default class Product {
  /**
   * get favorite product ids from local storage
   */
  static getFavoriteProductIds () {
    return JSON.parse(localStorage.getItem(FAVORITE_PRODUCTS)) || []
  }

  /**
   * save productId to list of favorit product in local storage
   * @param {string} productId
   */
  static like (productId) {
    let favoriteProductIds = Product.getFavoriteProductIds()
    favoriteProductIds = uniq([ ...favoriteProductIds, productId ])
    localStorage.setItem(FAVORITE_PRODUCTS, JSON.stringify(favoriteProductIds))
  }

  /**
   * remove productId from list of favorit product in local storage
   * @param {string} productId
   */
  static unlike (productId) {
    let favoriteProductIds = Product.getFavoriteProductIds()
    favoriteProductIds = without(favoriteProductIds, productId)

    localStorage.setItem(FAVORITE_PRODUCTS, JSON.stringify(favoriteProductIds))
  }
}
