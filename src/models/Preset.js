import { FAVORITE_PRESETS } from 'config/constants'
import uniqBy from 'lodash-es/uniqBy'
import reject from 'lodash-es/reject'
import map from 'lodash-es/map'

const { localStorage } = window

export default class Preset {
  /**
   * get favorite presets from local storage
   */
  static getFavoritePresets () {
    return JSON.parse(localStorage.getItem(FAVORITE_PRESETS)) || []
  }

  /**
   * get favorite preset names from local storage
   */
  static getFavoritePresetNames () {
    return map(Preset.getFavoritePresets(), 'name')
  }

  /**
   * create a new preset and save it to list of favorit presets in local storage
   * @param {Object} preset
   * @param {string} string
   */
  static savePreset (preset, name) {
    let favoritePresets = Preset.getFavoritePresets()
    favoritePresets = uniqBy([ { ...preset, name, favorite: true }, ...favoritePresets ], 'name')
    localStorage.setItem(FAVORITE_PRESETS, JSON.stringify(favoritePresets))
  }

  /**
   * remove preset from list of favorit presets in local storage
   * this function is similar to `unlike`, but it uses only the name of the preset
   * @param {string} string
   */
  static removePreset (name) {
    let favoritePresets = Preset.getFavoritePresets()
    favoritePresets = reject(favoritePresets, { name })
    localStorage.setItem(FAVORITE_PRESETS, JSON.stringify(favoritePresets))
  }

  /**
   * save preset to list of favorit presets in local storage
   * @param {Object} preset
   */
  static like (preset) {
    let favoritePresets = Preset.getFavoritePresets()
    favoritePresets = uniqBy([ ...favoritePresets, { ...preset, favorite: true } ], 'name')
    localStorage.setItem(FAVORITE_PRESETS, JSON.stringify(favoritePresets))
  }

  /**
   * remove preset from list of favorit presets in local storage
   * @param {Object} preset
   */
  static unlike (preset) {
    let favoritePresets = Preset.getFavoritePresets()
    favoritePresets = reject(favoritePresets, { name: preset.name })

    localStorage.setItem(FAVORITE_PRESETS, JSON.stringify(favoritePresets))
  }
}
