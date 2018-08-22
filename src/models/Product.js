import { FAVORITE_PRODUCTS } from 'config/constants'
import uniqBy from 'lodash-es/uniqBy'
import reject from 'lodash-es/reject'
import map from 'lodash-es/map'

const { localStorage } = window

export default class Product {
  /**
   * get favorite products from local storage
   */
  static getFavoriteProducts () {
    return JSON.parse(localStorage.getItem(FAVORITE_PRODUCTS)) || []
  }

  /**
   * get favorite product ids from local storage
   */
  static getFavoriteProductIds () {
    return map(Product.getFavoriteProducts(), 'product_id')
  }

  /**
   * save productId to list of favorit product in local storage
   * @param {object} product
   */
  static like (product) {
    let favoriteProducts = Product.getFavoriteProducts()
    favoriteProducts = uniqBy([ ...favoriteProducts, { ...product, favorite: true } ], 'product_id')
    localStorage.setItem(FAVORITE_PRODUCTS, JSON.stringify(favoriteProducts))
  }

  /**
   * remove productId from list of favorit product in local storage
   * @param {string} productId
   */
  static unlike (productId) {
    let favoriteProducts = Product.getFavoriteProducts()
    favoriteProducts = reject(favoriteProducts, { product_id: productId })

    localStorage.setItem(FAVORITE_PRODUCTS, JSON.stringify(favoriteProducts))
  }
}