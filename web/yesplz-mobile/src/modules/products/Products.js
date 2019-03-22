import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import ProductListVertical from '@yesplz/core-web/modules/products/ProductListVertical'
import withProductsFetcher from './withProductsFetcher'

import './Product.scss'

class Products extends PureComponent {
  static propTypes = {
    category: PropTypes.string.isRequired,
    customFilters: PropTypes.object,
    location: PropTypes.object,
    limitPerPage: PropTypes.number.isRequired,
    filters: PropTypes.shape({}).isRequired,
    onFilter: PropTypes.func.isRequired
  }

  static defaultProps = {
    customFilters: {}
  }

  componentWillMount () {
    if (/^\/products\/(wtop|wpants|wshoes)\/list$/.test(this.props.location.pathname)) {
      const { category, limitPerPage, filters, onFilter, customFilters } = this.props
      onFilter(category, { ...filters, ...customFilters }, limitPerPage)
    }
  }

  componentDidUpdate (prevProps) {
    const { category, limitPerPage, filters, onFilter, customFilters } = this.props
    // check for filter change
    if (!isEqual(prevProps.filters, filters) || !isEqual(prevProps.customFilters, customFilters)) {
      onFilter(category, { ...filters, ...customFilters }, limitPerPage)
    }
  }

  render () {
    return (
      <ProductListVertical
        {...this.props}
        enableFetchNext
        useScrollFetcher={!!this.props.customFilters.page}
      />
    )
  }
}

export default withProductsFetcher(Products)
