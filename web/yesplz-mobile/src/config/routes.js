import React from 'react'
import { Route, Switch } from 'react-router'
// pages
import {} from './routesHelpers'
import { Faq } from '@yesplz/core-web/modules/faq'
import { Tutorial } from '@yesplz/core-web/modules/tutorials'

import { Base, NotFound } from 'modules/base'
import { Home } from 'modules/home'
import { Favorites } from 'modules/favorites'
import { renderSingleProductPage, renderProductsListPage } from 'modules/products/productRoutes'
import { renderPresetProductsPage, renderSinglePresetProductPage } from 'modules/presets/presetRoutes'

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
      <Route exact path='/tutorial' component={Tutorial} />
      <Route exact path='/products' render={renderProductsListPage} />
      <Route exact path='/products/:productId' render={renderSingleProductPage} />
      <Route exact path='/preset-products/:presetName' render={renderPresetProductsPage} />
      <Route exact path='/preset-products/:presetName/:productId' render={renderSinglePresetProductPage} />
      <Route exact path='/favorites/:favoriteType' component={Favorites} />
      <Route exact path='/faq' component={Faq} />
      <Route component={NotFound} />
    </Switch>
  </Base>
)

export default createRoutes()
