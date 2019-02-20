// api
export const BASE_API_PATH = process.env.REACT_APP_BASE_API_PATH || '/api/'
export const BASE_IMG_PATH = process.env.REACT_APP_BASE_IMG_PATH || '/'
export const DEBUG_PARAM = 'dbg'
export const PRD_CATEGORY = process.env.REACT_APP_PRD_CATEGORY || 'wtop'

// local storage
export const FAVORITE_PRESETS = 'favorite_presets'
export const FILTERS = 'filters'
export const LAST_BODY_PART = 'last_body_part'
export const ONBOARDING_COMPLETED = 'onboarding_completed'

// platforms
export const IS_MOBILE = JSON.parse(process.env.REACT_APP_IS_MOBILE)

// presets
export const CUSTOM_PRESET_NAME = 'Custom Preset'

// product count that will be showed for each page
export const PRODUCT_COUNT_PER_PAGE = parseInt(process.env.REACT_APP_PRODUCT_PER_PAGE, 10) || 10

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

// categories
export const CATEGORY_TOPS = 'wtop'
export const CATEGORY_SHOES = 'wshoes'
export const CATEGORY_PANTS = 'wpants'

// product list filters
export const FILTER_OCASIONS = [
  {
    name: 'work',
    label: 'Work'
  },
  {
    name: 'casual',
    label: 'Casual'
  },
  {
    name: 'workout',
    label: 'Workout'
  }
]
export const FILTER_TYPES = [
  {
    name: 'wtop',
    label: 'Top'
  },
  {
    name: 'wpants',
    label: 'Jeans'
  },
  {
    name: 'wshoes',
    label: 'Shoes'
  }
]
export const FILTER_SALES = [
  {
    name: '30%',
    label: '30%'
  },
  {
    name: '50%',
    label: '50%'
  },
  {
    name: '70%',
    label: '70%'
  }
]
export const FILTER_PRICES = [
  {
    name: '-50',
    label: 'UNDER $50'
  },
  {
    name: '50-100',
    label: '$50 - $100'
  },
  {
    name: '100-150',
    label: '$100 - $150'
  },
  {
    name: '150-300',
    label: '$150 - $300'
  },
  {
    name: '300-',
    label: '$300+'
  }
]

// end of product list filters
export const CATEGORIES_LABELS = {
  wtop: 'Tops',
  wpants: 'Jeans',
  wshoes: 'Shoes'
}
