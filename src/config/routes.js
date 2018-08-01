import React from 'react'
import { Route, Switch } from 'react-router'
// pages
import { Base, NotFound } from 'modules/base'
import Tops from 'modules/tops/Tops'

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
      <Route exact path='/products/:productId' component={Tops} />
      <Route component={NotFound} />
    </Switch>
  </Base>
)

export default createRoutes()
