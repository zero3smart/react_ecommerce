import React from 'react'
import { Route, Switch } from 'react-router'
// pages
import { Base, NotFound } from 'modules/base'
import { Home } from 'modules/home'
import { Favorites } from 'modules/favorites'
import { Faq } from 'modules/faq'
import Presets from 'modules/presets/Presets'
// presentationals
import ProductsPage from 'yesplz@modules/products/ProductsPage'
import { renderBreadcrumbs, renderTopsInfoBanner } from './routesHelpers'
import { SingleProductRoute, SinglePresetProductRoute } from 'modules/products/singleProductRoutes'

const createRoutes = () => (
  <Switch>
    <Route path='/' component={BasePlatform} />
  </Switch>
)

// nested routes components
const BasePlatform = (props) => (
  <Base {...props}>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/products' render={ProductsListRoute} />
      <Route exact path='/products/:productId' component={SingleProductRoute} />
      <Route exact path='/presets' component={Presets} />
      <Route exact path='/preset-products/:presetName' render={PresetProductsRoute} />
      <Route exact path='/preset-products/:presetName/:productId' render={SinglePresetProductRoute} />
      <Route exact path='/favorites/:favoriteType' component={Favorites} />
      <Route exact path='/faq' component={Faq} />
      <Route component={NotFound} />
    </Switch>
  </Base>
)

const ProductsListRoute = router => (
  <ProductsPage key='products-page' className='ProductsPage-desktop' initialExpandVisualFilter renderExtraItem={renderTopsInfoBanner} />
)

const PresetProductsRoute = router => {
  const { presetName } = router.match.params
  return (
    <ProductsPage
      key='preset-products-page'
      className='ProductsPage-desktop'
      productBasePath={`/preset-products/${presetName}`}
      renderExtraItem={renderBreadcrumbs([
        { name: 'Editor\'s Pick', uri: '/' },
        { name: presetName }
      ])}
    />
  )
}

export default createRoutes()
