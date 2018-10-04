import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import axios from 'axios'
import { BASE_API_PATH } from 'config/constants'

axios.defaults.baseURL = BASE_API_PATH

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})
