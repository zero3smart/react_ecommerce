// api
export const BASE_API_PATH = process.env.REACT_APP_BASE_API_PATH || '/api/'
export const BASE_IMG_PATH = process.env.REACT_APP_BASE_IMG_PATH || '/'

// local storage
export const FAVORITE_PRODUCTS = 'favorite_products'
export const FAVORITE_PRESETS = 'favorite_presets'
export const FILTERS = 'filters'

// presets
export const CUSTOM_PRESET_NAME = 'Custom Preset'

// product count that will be showed for each page
export const PRODUCT_COUNT_PER_PAGE = process.env.REACT_APP_PRODUCT_PER_PAGE || 10

// fabric colors dictionary
export const FABRIC_COLORS = {
  red: '#E03E3E',
  beige: '#ECD5C0',
  purple: '#7F3EE0',
  blue: '#3E60E0',
  green: '#3EE059',
  yellow: '#E0D03E',
  black: '#000000',
  brown: '#663300',
  pink: '#F0A4BD',
  pastel: 'linear-gradient(-145deg, #FEF7A3 4%, #E8F7AC 21%, #83F5D7 52%, #F19EC2 98%, #C683F2 98%)',
  metal: 'linear-gradient(-180deg, #FCF53C 0%, #F89020 49%, #F8F120 67%, #F89420 86%, #F8E71C 100%)',
  orange: '#E08F3E',
  grey: '#999999',
  white: '#FFFFFF'
}

// name: [Min, Max, Default State, SVG file prefix]
// state -1 is all,
export const PROP_CONST = {
  coretype: [0, 3, 2, 'top_core'],
  collar: [0, 2, 0, 'top_collar'],
  top_length: [0, 2, 1, 'length'],
  neckline: [0, 2, 1, 'neckline'],
  shoulder: [0, 4, 1, 'shoulder'],
  sleeve_length: [0, 5, 3, 'sleeves'],
  solid: [0, 1, 0, 'solid'],
  pattern: [0, 1, 0, 'pattern'],
  details: [0, 1, 0, 'details'],
  color: [0, 1, 0, 'color']
}

export const THUMBNAIL_IMG_X_OFFSET = {
  4: 103,
  5: 67,
  6: 43,
  7: 3
}

export const THUMBNAIL_X_OFFSET = 400 - 6 // Affected by tn_x in merge_svg_asset.py
export const THUMBNAIL_Y_OFFSET = 320 - 5 // Affected by tn_y in merge_svg_asset.py
export const THUMBNAIL_HIGHLITER_SIZE = {
  width: 62,
  height: 61
}
export const THUMBNAIL_PADDING = 20
