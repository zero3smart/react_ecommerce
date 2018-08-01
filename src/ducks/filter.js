// Actions
const SET_FILTER = 'filters/SET_FILTER'

const defaultState = {

}

// Reducer
export default function reducer (state = defaultState, action = {}) {
  switch (action.type) {
    // do reducer stuff
    default: return state
  }
}

// Actions creator
export function setFilter () {
  return { type: SET_FILTER }
}
