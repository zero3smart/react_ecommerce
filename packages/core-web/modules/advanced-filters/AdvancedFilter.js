import React from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import AdvancedFilterTabs, { TabItem } from './AdvancedFilterTabs'
import ColorPallete from '../filters/ColorPallete'
import StylesSelect from './StylesSelect'
import DesignSelect from './DesignSelect'
import MaterialSelect from './MaterialSelect'
import FavoritesSelect from './FavoritesSelect'

const designFilterKeys = ['solid', 'pattern', 'details']
const nonVisualFilterKeys = [...designFilterKeys, 'color', 'material']

const AdvancedFilter = ({ category, filters, onChange }) => {
  // split filters based on its type
  const styleFilter = omit(filters, nonVisualFilterKeys)
  const designFilter = pick(filters, designFilterKeys)
  const colorFilter = (filters.color || '').split(',')
  const materialFilter = filters.material

  const handleFilterChange = (name, value) => {
    let updatedFilters = {
      ...filters
    }

    switch (name) {
      case 'color':
        const valueJoin = value.join(',')
        updatedFilters = {
          ...updatedFilters,
          [name]: valueJoin.slice(0, 1) === ',' ? valueJoin.slice(1) : valueJoin
        }
        break
      case 'material':
        updatedFilters = {
          ...updatedFilters,
          [name]: value
        }
        break
      case 'favorite':
        updatedFilters = value
        break
      default:
        updatedFilters = {
          ...updatedFilters,
          ...value
        }
    }

    onChange(updatedFilters)
  }

  return (
    <AdvancedFilterTabs tabs={tabs}>
      <TabItem tabKey='styles'>
        <StylesSelect name='style' value={styleFilter} category={category} onChange={handleFilterChange} />
      </TabItem>

      <TabItem tabKey='design'>
        <DesignSelect name='design' value={designFilter} onChange={handleFilterChange} />
      </TabItem>

      <TabItem tabKey='colors'>
        <ColorPallete values={colorFilter} onColorClick={(values) => handleFilterChange('color', values)} />
      </TabItem>

      <TabItem tabKey='materials'>
        <MaterialSelect name='material' value={materialFilter} onChange={handleFilterChange} />
      </TabItem>

      <TabItem tabKey='favorite'>
        <FavoritesSelect name='favorite' category={category} value={filters} onChange={handleFilterChange} />
      </TabItem>
    </AdvancedFilterTabs>
  )
}

const tabs = [
  { label: 'Styles', key: 'styles' },
  { label: 'Design', key: 'design' },
  { label: 'Colors', key: 'colors' },
  { label: 'Materials', key: 'materials' },
  { label: 'My Tops', key: 'favorite' }
]

AdvancedFilter.propTypes = {
  category: PropTypes.string.isRequired,
  filters: PropTypes.object,
  onChange: PropTypes.func
}

AdvancedFilter.defaultProps = {
  filters: {},
  onChange: (filters) => {}
}

export default AdvancedFilter
