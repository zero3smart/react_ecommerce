import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { BASE_API_PATH } from 'yesplz@config/constants'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

// configure axios
axios.defaults.baseURL = BASE_API_PATH

ReactDOM.render(<App />, document.getElementById('root'))

registerServiceWorker()
