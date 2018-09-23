// api
export const BASE_API_PATH = process.env.REACT_APP_BASE_API_PATH || '/api/'
export const BASE_IMG_PATH = process.env.REACT_APP_BASE_IMG_PATH || '/'
export const DEBUG_PARAM = 'dbg'

// local storage
export const FAVORITE_PRODUCTS = 'favorite_products'
export const FAVORITE_PRESETS = 'favorite_presets'
export const FILTERS = 'filters'
export const LAST_BODY_PART = 'last_body_part'
export const ONBOARDING_COMPLETED = 'onboarding_completed'

// platforms
export const IS_MOBILE = JSON.parse(process.env.REACT_APP_IS_MOBILE)

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
export const PROP_ORDERS = ['collar', 'shoulder', 'neckline', 'sleeve_length', 'coretype', 'top_length']

export const ENABLE_BODYPART_ALL_BTN = false

export const THUMBNAIL_IMG_X_OFFSET = {
  3: 132, // only in without ALL BTN
  4: (ENABLE_BODYPART_ALL_BTN) ? 103 : 97,
  5: (ENABLE_BODYPART_ALL_BTN) ? 67 : 63,
  6: (ENABLE_BODYPART_ALL_BTN) ? 43 : 30,
  7: 3 // only in with ALL BTN
}

export const VERT_THUMBNAIL_X_OFFSET = 400 - 6 // Affected by tn_x in merge_svg_asset.py
export const VERT_THUMBNAIL_Y_OFFSET = (ENABLE_BODYPART_ALL_BTN) ? 0 : 30

export const HORZ_THUMBNAIL_Y_OFFSET = 330 - 5 // Affected by tn_y in merge_svg_asset.py
export const THUMBNAIL_TOUCH_AREA_SIZE = {
  width: 62,
  height: 62
}
export const THUMBNAIL_HIGHLITER_SIZE = {
  width: 62,
  height: 61
}
