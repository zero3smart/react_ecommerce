import React from 'react'
import { Route, Switch } from 'react-router'
// pages
import { Base, NotFound } from 'modules/base'
import { Home } from 'modules/home'
import { Tops, TopSingle } from 'modules/tops'
import { Favorites } from 'modules/favorites'
import { Faq } from 'modules/faq'
import { Presets, PresetProducts } from 'modules/presets'

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
      <Route exact path='/products' component={Tops} />
      <Route exact path='/products/:productId' component={TopSingle} />
      <Route exact path='/presets' component={Presets} />
      <Route exact path='/preset-products/:presetName' component={PresetProducts} />
      <Route exact path='/favorites/:favoriteType' component={Favorites} />
      <Route exact path='/faq' component={Faq} />
      <Route component={NotFound} />
    </Switch>
  </Base>
)

export default createRoutes()
