import { createSelector } from 'reselect'
import find from 'lodash-es/find'
import isEqual from 'lodash-es/isEqual'
import isEmpty from 'lodash-es/isEmpty'
import omit from 'lodash-es/omit'

const getFavoritePresets = state => state.filters.favoritePresets
const getFilters = state => state.filters.data
const getCustomPresetName = (_, prop) => prop.customPresetName

/**
 * get favorite preset based on custom preset name
 */
export const customPresetSelector = createSelector(
  [getFavoritePresets, getCustomPresetName],
  (favoritePresets, customPresetName) => find(favoritePresets, { name: customPresetName })
)

/**
 * check whether current filter is saved (favorite)
 * saved filter will be stored as favorite preset
 */
export const isFilterSavedSelector = createSelector(
  [getFilters, customPresetSelector],
  (filters, customPreset) => (
    !isEmpty(customPreset) && isEqual(filters, omit(customPreset, ['name', 'favorite']))
  )
)
