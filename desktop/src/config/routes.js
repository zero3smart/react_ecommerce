import React from 'react'
import { Route, Switch } from 'react-router'
// pages
import { Base, NotFound } from 'modules/base'
import { Tops, TopSingle } from 'modules/tops'
import { Favorites } from 'yesplz@modules/favorites'
import { Feedbacks } from 'yesplz@modules/feedbacks'
import { Presets } from 'yesplz@modules/presets'

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
      <Route exact path='/favorites/:favoriteType' component={Favorites} />
      <Route exact path='/feedbacks' component={Feedbacks} />
      <Route component={NotFound} />
    </Switch>
  </Base>
)

export default createRoutes()
