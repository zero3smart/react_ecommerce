import { createBrowserHistory } from 'history'
import { applyMiddleware, createStore, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { composeWithDevTools } from 'redux-devtools-extension'
import * as reducers from 'yesplz@ducks'

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
      thunk // add dispatch to action creators
    )
  )
)

export default store
