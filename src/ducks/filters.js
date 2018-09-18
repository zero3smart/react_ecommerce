import axios from 'axios'
import isNil from 'lodash-es/isNil'
import { FILTERS } from 'config/constants'
import { Preset, VisualFilter } from 'models'
import { updatePresetFavorite, mapPresetFavorites } from './helpers'
const { localStorage } = window

// Actions
const SET_FILTER = 'filters/SET_FILTER'
const SET_PRESETS = 'filters/SET_PRESETS'
const SET_FAVORITE_PRESETS = 'filters/SET_FAVORITE_PRESETS'
const LIKE_PRESET = 'filters/LIKE_PRESET'
const UNLIKE_PRESET = 'filters/UNLIKE_PRESET'
const SET_LAST_BODY_PART = 'filters/SET_LAST_BODY_PART'
const TOOGLE_VISUAL_FILTER = 'filters/TOOGLE_VISUAL_FILTER'

const defaultState = {
  data: {
    coretype: 2,
    collar: 0,
    top_length: 1,
    neckline: 1,
    shoulder: 4,
    sleeve_length: 0,
    solid: 0,
    pattern: 0,
    details: 0,
    color: null,
    sale: 0
  },
  lastBodyPart: VisualFilter.getLastBodyPart(),
  presets: [],
  favoritePresets: [],
  presetsFetched: false,
  expanded: isNil(window.localStorage.getItem('onboarding_completed')) || false
}

// Reducer
export default function reducer (state = defaultState, action = {}) {
  const { type, payload } = action
  switch (type) {
    case SET_FILTER:
      if (!payload.filters) {
        return state
      }
      return { ...state, data: payload.filters }
    case SET_PRESETS:
      return {
        ...state,
        presets: mapPresetFavorites(payload.favoritePresetNames, payload.presets),
        presetsFetched: true
      }
    case SET_LAST_BODY_PART:
      return {
        ...state,
        lastBodyPart: payload.lastBodyPart
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
    case SET_FAVORITE_PRESETS:
      return {
        ...state,
        favoritePresets: payload.favoritePresets
      }
    case TOOGLE_VISUAL_FILTER:
      return {
        ...state,
        expanded: payload.expanded
      }
    case '@@router/LOCATION_CHANGE':
      // on router change, make visual filter hidden
      return {
        ...state,
        expanded: false
      }
    default: return state
  }
}

// Actions creator
export function setFilter (filters) {
  // save to local storage
  localStorage.setItem(FILTERS, JSON.stringify(filters))
  return { type: SET_FILTER, payload: { filters } }
}

export function setPresets (presets, favoritePresetNames) {
  return { type: SET_PRESETS, payload: { presets, favoritePresetNames } }
}

export function setLastBodyPart (lastBodyPart) {
  // set to localStorage
  VisualFilter.saveLastBodyPart(lastBodyPart)
  return { type: SET_LAST_BODY_PART, payload: { lastBodyPart } }
}

/**
 * sync filters data from local storage to store
 */
export function syncFilter () {
  const filters = JSON.parse(localStorage.getItem(FILTERS))
  return { type: SET_FILTER, payload: { filters } }
}

/**
 * sync favorite presets data from local storage to store
 */
export function syncFavoritePresets () {
  const favoritePresets = Preset.getFavoritePresets()
  return { type: SET_FAVORITE_PRESETS, payload: { favoritePresets } }
}

export function toggleVisualFilter (expanded = true) {
  return { type: TOOGLE_VISUAL_FILTER, payload: { expanded } }
}

/**
 * get list of presets available
 */
export function fetchPresets () {
  return async dispatch => {
    try {
      const response = await axios.get('/products/woman_top/preset')

      const favoritePresetNames = Preset.getFavoritePresetNames()
      dispatch(setPresets(response.data, favoritePresetNames))

      return response
    } catch (e) {
      console.log('Error!', e)
    }
  }
}

export function likePreset (preset) {
  return (dispatch) => {
    Preset.like(preset)
    // sync presets from local storage, temporary solutions before api ready
    dispatch(syncFavoritePresets())

    dispatch({ type: LIKE_PRESET, payload: { presetName: preset.name } })
  }
}

export function unlikePreset (preset) {
  return (dispatch) => {
    Preset.unlike(preset)
    // sync presets from local storage, temporary solutions before api ready
    dispatch(syncFavoritePresets())

    dispatch({ type: UNLIKE_PRESET, payload: { presetName: preset.name } })
  }
}

export function saveFilterAsPreset (preset, name) {
  return dispatch => {
    Preset.savePreset(preset, name)
    // sync presets from local storage, temporary solutions before api ready
    dispatch(syncFavoritePresets())

    dispatch({ type: LIKE_PRESET, payload: { presetName: preset.name } })
  }
}

export function deleteFilterFromPreset (name) {
  return dispatch => {
    Preset.removePreset(name)
    // sync presets from local storage, temporary solutions before api ready
    dispatch(syncFavoritePresets())

    dispatch({ type: UNLIKE_PRESET, payload: { presetName: name } })
  }
}
