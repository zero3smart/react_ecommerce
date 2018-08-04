import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import store, { history } from './config/store'
import routes from './config/routes'
// import global styles
import 'assets/css/reset.css'
import 'app.css'

const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      {routes}
    </ConnectedRouter>
  </Provider>
)

export default App
