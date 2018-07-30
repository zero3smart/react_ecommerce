import React from 'react'
import { Route, Switch } from 'react-router'
import Tops from 'modules/tops/Tops'

const routes = (
  <Switch>
    <Route path='/' component={Tops} />
  </Switch>
)

export default routes
