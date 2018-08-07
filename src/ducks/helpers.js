import findIndex from 'lodash-es/findIndex'
import includes from 'lodash-es/includes'

/**
 * update favorite of a product in product list
 * @param {string} productId
 * @param {boolean} favorite
 * @param {Object[]} products
 * @return {Object[]} products
 */
export function updateProductFavorite (productId, favorite = false, products = []) {
  const productIndex = findIndex(products, { product_id: productId })
  if (products.length === 0 || productIndex === -1) {
    return products
  }
  const newProductData = { ...products[productIndex], favorite }
  return updateListByIndex(products, productIndex, newProductData)
}

/**
 * map favorite product ids to product list
 * @param {string[]} favoriteProductIds
 * @param {Object[]} products
 * @return {Object[]} products
 */
export function mapProductFavorites (favoriteProductIds, products = []) {
  if (products.length === 0) {
    return products
  }
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
