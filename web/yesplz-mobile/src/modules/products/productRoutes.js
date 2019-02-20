import React from 'react'
import { renderBreadcrumbs } from 'config/routesHelpers'
import { ProductPage } from '@yesplz/core-web/modules/products'
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
