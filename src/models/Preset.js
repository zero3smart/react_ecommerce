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
   * save preset name to list of favorit presets in local storage
   * @param {Object} preset
   */
  static like (preset) {
    let favoritePresets = Preset.getFavoritePresets()
    favoritePresets = uniqBy([ ...favoritePresets, { ...preset, favorite: true } ], 'name')
    localStorage.setItem(FAVORITE_PRESETS, JSON.stringify(favoritePresets))
  }

  /**
   * remove preset name from list of favorit presets in local storage
   * @param {Object} preset
   */
  static unlike (preset) {
    let favoritePresets = Preset.getFavoritePresets()
    favoritePresets = reject(favoritePresets, { name: preset.name })

    localStorage.setItem(FAVORITE_PRESETS, JSON.stringify(favoritePresets))
  }
}
