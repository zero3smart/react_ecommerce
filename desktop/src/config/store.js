import { createBrowserHistory } from 'history'
import { applyMiddleware, createStore, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import MixpanelMiddleware from 'redux-mixpanel-middleware'
import { composeWithDevTools } from 'redux-devtools-extension'
import * as reducers from 'yesplz@ducks'
import { makeRecommendationMiddleware } from 'yesplz@middlewares/recommendation'

const mixpanelMiddleware = new MixpanelMiddleware(window.mixpanel)

export const history = createBrowserHistory({
  basename: process.env.REACT_APP_BASE_PATH
})

const rootReducer = combineReducers({
  ...reducers
})

const store = createStore(
  connectRouter(history)(rootReducer), // new root reducer with router state
  composeWithDevTools(
    applyMiddleware(
      routerMiddleware(history), // for dispatching history actions
      thunk, // add dispatch to action creators
      makeRecommendationMiddleware(4),
      mixpanelMiddleware
    )
  )
)

export default store
