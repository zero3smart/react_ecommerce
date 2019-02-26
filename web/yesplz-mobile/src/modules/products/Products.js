import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import ProductListVertical from '@yesplz/core-web/modules/products/ProductListVertical'
import withProductsFetcher from './withProductsFetcher'

import './Product.scss'

class Products extends PureComponent {
  static propTypes = {
    category: PropTypes.string.isRequired,
    limitPerPage: PropTypes.number.isRequired,
    filters: PropTypes.shape({}).isRequired,
    onFilter: PropTypes.func.isRequired
  }

  componentDidUpdate (prevProps) {
    const { category, limitPerPage, filters, onFilter } = this.props
    // check for filter change
    if (!isEqual(prevProps.filters, filters)) {
      onFilter(category, filters, limitPerPage)
    }
  }

  render () {
    return (
      <ProductListVertical
        {...this.props}
        enableFetchNext
        useScrollFetcher
      />
    )
  }
}

export default withProductsFetcher(Products)
