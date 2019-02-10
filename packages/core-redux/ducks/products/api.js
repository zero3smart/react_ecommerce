import axios from 'axios'
import { PRODUCT_COUNT_PER_PAGE, PRD_CATEGORY } from '@yesplz/core-web/config/constants'

/**
 * get products using a specific filter
 * @param {object} filters
 * @param {object} count
 */
export async function getProducts (category = PRD_CATEGORY, filters = {}, limit = PRODUCT_COUNT_PER_PAGE) {
  try {
    const response = await axios.get(`/categories/${category}`, {
      params: {
        limit_per_pid: 1,
        limit,
        ...filters
      }
    })

    return response.data
  } catch (e) {
    console.log('Error!', e)
  }
}

/**
 * get recommended products
 * @param {number} limitPerPage
 * @param {string} category
 */
export async function getRecommendedProducts (data = [], limitPerPage, category) {
  let url = '/allcategories/recommends'

  if (category) {
    url = `/categories/${category}/recommends`
  }

  try {
    const response = await axios.post(url, data, {
      params: {
        offset: 0,
        limit: limitPerPage
      }
    })

    return response.data
  } catch (e) {
    console.error('Error!', e)
  }
}
