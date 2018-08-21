import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { BASE_API_PATH } from 'config/constants'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { loadSvgSource } from 'utils/svgHelpers'

// configure axios
axios.defaults.baseURL = BASE_API_PATH

ReactDOM.render(<App />, document.getElementById('root'))

registerServiceWorker()

// load visual filter sources
loadSvgSource('#svg-filters', `${process.env.PUBLIC_URL}/svg/highlight.svg`)
