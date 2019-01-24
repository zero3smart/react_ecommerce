import React from 'react'
import { renderBreadcrumbs, renderTopsInfoBanner } from 'config/routesHelpers'
import { ProductsPage, ProductPage } from '@yesplz/core-web/modules/products'
import './product-routes.scss'

export const renderSingleProductPage = router => (
  <ProductPage
    match={router.match}
    renderExtraItem={renderBreadcrumbs([
      { name: 'YesPlz', uri: '/' },
      { name: 'Product Detail' }
    ])}
    className='ProductPage-mobile'
  />
)

export const renderProductsListPage = router => (
  <ProductsPage
    key='products-page'
    match={router.match}
    initialExpandVisualFilter
    renderExtraItem={renderTopsInfoBanner}
    className='ProductListPage-mobile'
  />
)
