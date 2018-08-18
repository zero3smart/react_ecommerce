import React from 'react'
import { Route, Switch } from 'react-router'
// pages
import { Base, NotFound } from 'modules/base'
import { Tops, TopSingle } from 'modules/tops'
import { Feedbacks } from 'modules/feedbacks'
import Presets from 'modules/presets/Presets'
import { Favorites } from 'modules/favorites'

const createRoutes = () => (
  <Switch>
    <Route path='/' component={BasePlatform} />
  </Switch>
)

// nested routes components
const BasePlatform = (props) => (
  <Base {...props}>
    <Switch>
      <Route exact path='/' component={Tops} />
      <Route exact path='/products/:productId' component={TopSingle} />
      <Route exact path='/presets' component={Presets} />
      <Route path='/presets/:presetName' component={Presets} />
      <Route exact path='/favorites/:favoriteType' component={Favorites} />
      <Route exact path='/feedbacks' component={Feedbacks} />
      <Route component={NotFound} />
    </Switch>
  </Base>
)

export default createRoutes()
