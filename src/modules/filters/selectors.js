import { createSelector } from 'reselect'
import filter from 'lodash-es/filter'
import find from 'lodash-es/find'
import isEmpty from 'lodash-es/isEmpty'
import omit from 'lodash-es/omit'

const getFavoritePresets = state => state.filters.favoritePresets
const getFilters = state => state.filters.data
const getCustomPresetName = (_, prop) => prop.customPresetName

/**
 * get custom presets list
 */
export const customPresetsSelector = createSelector(
  [getFavoritePresets, getCustomPresetName],
  (favoritePresets, customPresetName) => (
    filter(favoritePresets, { name: customPresetName })
  )
)

/**
 * check whether current filter is saved (favorite)
 * saved filter will be stored as favorite preset
 */
export const isFilterSavedSelector = createSelector(
  [getFilters, customPresetsSelector],
  (filters, customPresets) => {
    if (isEmpty(customPresets)) {
      return null
    }
    // find custom preset by filter settings
    const customPreset = find(omit(customPresets, ['name', 'favorite', 'key']), { ...omit(filters, ['favorite']) })

    return !isEmpty(customPreset)
  }
)
