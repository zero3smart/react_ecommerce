import React from 'react'
import ProductsPage from 'yesplz@modules/products/ProductsPage'
import { renderBreadcrumbs } from 'config/routesHelpers'
import './presets-routes.css'

export const PresetProductsRoute = router => {
  const { presetName } = router.match.params
  return (
    <ProductsPage
      key='preset-products-page'
      className='PresetProducts'
      productBasePath={`/preset-products/${presetName}`}
      renderExtraItem={renderBreadcrumbs([
        { name: 'Editor\'s Pick', uri: '/' },
        { name: presetName }
      ], { style: styles.breadcrumbs })}
    />
  )
}

const styles = {
  breadcrumbs: {
    fontSize: 36,
    margin: '-10px -5px 8px',
    padding: '50px 10px'
  }
}
