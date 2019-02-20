import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Overlay from '@yesplz/core-web/ui-kits/overlays/Overlay'
import Button from '@yesplz/core-web/ui-kits/buttons/Button'
import { FILTER_OCASIONS, FILTER_TYPES, FILTER_SALES, FILTER_PRICES } from '@yesplz/core-web/config/constants'
import { setSecondaryFilter } from '@yesplz/core-redux/ducks/filters'
import history from '@yesplz/core-web/config/history'

import ListView from './ListView'
import FilterGroup from './FilterGroup'
import './ProductsFilter.scss'

const ProductsFilter = ({ isVisible, defaultColType, secondaryFilters, activeCategory, onSubmit, onClose }) => {
  const [colType, changeColType] = useState(defaultColType)
  const [filters, changeFilters] = useState({})

  useEffect(() => {
    changeFilters({
      ...secondaryFilters,
      types: [activeCategory]
    })
  }, [secondaryFilters])

  const handleFilterChange = (name, values) => {
    changeFilters({
      ...filters,
      [name]: values
    })
  }

  const clearFilter = () => {
    changeFilters({
      types: [activeCategory]
    })
  }

  const handleSubmit = () => {
    onSubmit({
      colType,
      filters
    })
  }

  return (
    <Overlay title='Filters' className='ProductsFilter' isVisible={isVisible} onClose={onClose}>
      <h4 className='ProductsFilter-subtitle'>Listing View options</h4>
      <ListView colType={colType} onChange={changeColType} />

      <h4 className='ProductsFilter-subtitle' style={{ marginBottom: 13 }}>Ocasions</h4>
      <FilterGroup
        name='ocasion'
        options={[
          {
            name: 'all',
            label: 'All Ocasions'
          },
          ...FILTER_OCASIONS
        ]}
        values={filters['ocasion']}
        onChange={handleFilterChange}
      />

      <h4 className='ProductsFilter-subtitle' style={{ marginBottom: 13 }}>Types</h4>
      <FilterGroup
        name='types'
        options={FILTER_TYPES}
        values={filters['types']}
        type='radio'
        onChange={handleFilterChange}
      />

      <h4 className='ProductsFilter-subtitle' style={{ marginBottom: 13 }}>Sales</h4>
      <FilterGroup
        name='sale'
        options={[
          {
            name: 'all',
            label: 'All Sales'
          },
          ...FILTER_SALES
        ]}
        values={filters['sale']}
        onChange={handleFilterChange}
      />

      <h4 className='ProductsFilter-subtitle' style={{ marginBottom: 13 }}>Prices</h4>
      <FilterGroup
        name='prices'
        options={FILTER_PRICES}
        values={filters['prices']}
        onChange={handleFilterChange}
      />

      <button className='ProductsFilter-clearButton' onClick={clearFilter}>Clear all</button>

      <Button kind='secondary' style={{ width: '100%', marginTop: 40 }} onClick={handleSubmit}>Done</Button>
    </Overlay>
  )
}

ProductsFilter.propTypes = {
  isVisible: PropTypes.bool,
  secondaryFilters: PropTypes.shape({}),
  activeCategory: PropTypes.string,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func
}

ProductsFilter.defaultProps = {
  defaultColType: 'single',
  isVisible: false,
  secondaryFilters: {},
  onSubmit: (productListConfig) => { console.debug('Unhandled `onSubmit` prop in `ProductsFilter`', productListConfig) },
  onClose: () => { console.debug('Unhandled `onClose` prop in `ProductsFilter`') }
}

const mapStateToProps = (state) => ({
  secondaryFilters: state.filters.secondary
})

const mapDispatchToProps = (dispatch, props) => ({
  onSubmit (productListConfig) {
    // set secondary filters
    dispatch(setSecondaryFilter(productListConfig.filters))

    // redirect to chosen category
    history.push(`/products/${productListConfig.filters.types[0]}/list?listingView=${productListConfig.colType}`)

    if (props.onSubmit) {
      props.onSubmit(productListConfig)
    }
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductsFilter)
