// Actions
const SET_PRODUCTS = 'filters/SET_PRODUCTS'

const defaultState = {
  list: []
}

// Reducer
export default function reducer (state = defaultState, action = {}) {
  const { type, payload } = action
  switch (type) {
    case SET_PRODUCTS:
      return { ...state, list: payload.products }
    default: return state
  }
}

// Actions creator
export function setProducts (products = []) {
  return { type: SET_PRODUCTS, payload: { products } }
}

// side effects, only as applicable
export function fetchProducts () {
  return dispatch => {
    dispatch(setProducts([ { id: '1', name: 'Product 1' } ]))
  }
}
