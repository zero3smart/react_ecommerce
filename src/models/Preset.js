import { FAVORITE_PRESETS } from 'config/constants'
import uniq from 'lodash-es/uniq'
import without from 'lodash-es/without'

const { localStorage } = window

export default class Preset {
  /**
   * get favorite preset names from local storage
   */
  static getFavoritePresets () {
    return JSON.parse(localStorage.getItem(FAVORITE_PRESETS)) || []
  }

  /**
   * save preset name to list of favorit presets in local storage
   * @param {string} presetName
   */
  static like (presetName) {
    let favoritePresets = Preset.getFavoritePresets()
    favoritePresets = uniq([ ...favoritePresets, presetName ])
    localStorage.setItem(FAVORITE_PRESETS, JSON.stringify(favoritePresets))
  }

  /**
   * remove preset name from list of favorit presets in local storage
   * @param {string} presetName
   */
  static unlike (presetName) {
    let favoritePresets = Preset.getFavoritePresets()
    favoritePresets = without(favoritePresets, presetName)

    localStorage.setItem(FAVORITE_PRESETS, JSON.stringify(favoritePresets))
  }
}
