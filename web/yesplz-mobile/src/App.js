import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import store, { history } from './config/store'
import routes from './config/routes'
// import global styles
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import '@yesplz/core-web/assets/css/animations.css'
import '@yesplz/core-web/assets/css/reset.css'
import 'app.css'

const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      {routes}
    </ConnectedRouter>
  </Provider>
)

export default App
