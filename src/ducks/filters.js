import axios from 'axios'
import { FILTERS } from 'config/constants'
import { Preset } from 'models'
import { updatePresetFavorite, mapPresetFavorites } from './helpers'
const { localStorage } = window

// Actions
const SET_FILTER = 'filters/SET_FILTER'
const SET_PRESETS = 'filters/SET_PRESETS'
const LIKE_PRESET = 'filters/LIKE_PRESET'
const UNLIKE_PRESET = 'filters/UNLIKE_PRESET'

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
    // color: 'black,
  },
  presets: [],
  presetsFetched: false
}

// Reducer
export default function reducer (state = defaultState, action = {}) {
  const { type, payload } = action
  switch (type) {
    case SET_FILTER:
      return { ...state, data: payload.filters }
    case SET_PRESETS:
      return {
        ...state,
        presets: mapPresetFavorites(payload.favoritePresets, payload.presets),
        presetsFetched: true
      }
    case LIKE_PRESET:
      return {
        ...state,
        presets: updatePresetFavorite(payload.presetName, true, state.presets)
      }
    case UNLIKE_PRESET:
      return {
        ...state,
        presets: updatePresetFavorite(payload.presetName, false, state.presets)
      }
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

export function setPresets (presets, favoritePresets) {
  return { type: SET_PRESETS, payload: { presets, favoritePresets } }
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

      const favoritePresets = Preset.getFavoritePresets()
      dispatch(setPresets(response.data, favoritePresets))

      return response
    } catch (e) {
      console.log('Error!', e)
    }
  }
}

export function likePreset (presetName) {
  return (dispatch) => {
    Preset.like(presetName)
    dispatch({ type: LIKE_PRESET, payload: { presetName } })
  }
}

export function unlikePreset (presetName) {
  return (dispatch) => {
    Preset.unlike(presetName)
    dispatch({ type: UNLIKE_PRESET, payload: { presetName } })
  }
}
