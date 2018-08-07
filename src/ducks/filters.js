// Actions
const SET_FILTER = 'filters/SET_FILTER'

const defaultState = {
  filters: {}
}

// Reducer
export default function reducer (state = defaultState, action = {}) {
  const { type, payload } = action
  switch (type) {
    case SET_FILTER:
      return { ...state, filters: payload.filters }
    // do reducer stuff
    default: return state
  }
}

// Actions creator
export function setFilter (filters) {
  return { type: SET_FILTER, payload: { filters } }
}
