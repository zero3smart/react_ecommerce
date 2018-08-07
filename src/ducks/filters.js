import axios from 'axios'
import { FILTERS } from 'config/constants'
const { localStorage } = window

// Actions
const SET_FILTER = 'filters/SET_FILTER'
const SET_PRESETS = 'filters/SET_PRESETS'

const defaultState = {
  data: {
    // collar: 2,
    // coretype: 2,
    // details: 1,
    // neckline: 1,
    // pattern: 0,
    // shoulder: 2,
    // sleeve_length: 0,
    // solid: 0,
    // top_length: 1,
  },
  presets: [],
  presetsFetched: false
}

// Reducer
export default function reducer (state = defaultState, action = {}) {
  const { type, payload } = action
  switch (type) {
    case SET_FILTER:
      return { ...state, applied: payload.filters }
    case SET_PRESETS:
      return { ...state, presets: payload.presets, presetsFetched: true }
    // do reducer stuff
    default: return state
  }
}

// Actions creator
export function setFilter (filters) {
  // save to local storage
  localStorage.setItem(FILTERS, JSON.stringify(filters))
  return { type: SET_FILTER, payload: { filters } }
}

export function setPresets (presets) {
  return { type: SET_PRESETS, payload: { presets } }
}

/**
 * sync filters data from local storage to store
 */
export function syncFilter () {
  const filters = JSON.parse(localStorage.getItem(FILTERS))
  return { type: SET_FILTER, payload: { filters } }
}

/**
 * get list of presets available
 */
export function fetchPresets () {
  return async dispatch => {
    try {
      const response = await axios.get('/products/woman_top/preset')
      dispatch(setPresets(response.data))

      return response
    } catch (e) {
      console.log('Error!', e)
    }
  }
}
