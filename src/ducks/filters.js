import { FILTERS } from 'config/constants'
const { localStorage } = window

// Actions
const SET_FILTER = 'filters/SET_FILTER'

const defaultState = {}

// Reducer
export default function reducer (state = defaultState, action = {}) {
  const { type, payload } = action
  switch (type) {
    case SET_FILTER:
      return { ...state, ...payload.filters }
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

/**
 * sync filters data from local storage to store
 */
export function syncFilter () {
  const filters = JSON.parse(localStorage.getItem(FILTERS))
  return { type: SET_FILTER, payload: { filters } }
}
