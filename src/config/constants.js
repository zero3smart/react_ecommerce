// api
export const BASE_API_PATH = process.env.REACT_APP_BASE_API_PATH || '/'

// product count that will be showed for each page
export const PRODUCT_COUNT_PER_PAGE = process.env.REACT_APP_PRODUCT_PER_PAGE || 10

// name: [Min, Max, Default State, SVG file prefix]
// state -1 is all,
export const PROP_CONST = {
  coretype: [0, 3, 2, 'top_core'],
  collar: [0, 2, 0, 'top_collar'],
  top_length: [0, 2, 1, 'length'],
  neckline: [0, 2, 1, 'neckline'],
  shoulder: [0, 4, 1, 'shoulder'],
  sleeve_length: [0, 5, 3, 'sleeves'], // Actual max value to pass to REST is 4. length 5 means length 4 & tightness 1
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

export const THUMBNAIL_Y_OFFSET = 320 - 5 // Affected by tn_y in merge_svg_asset.py
