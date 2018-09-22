import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { loadSvgSource } from 'yesplz@utils/svgHelpers'
import initializeAxios from 'yesplz@utils/initializeAxios'

initializeAxios()

ReactDOM.render(<App />, document.getElementById('root'))

registerServiceWorker()
// load visual filter sources
loadSvgSource('#svg-filters', `${process.env.PUBLIC_URL}/svg/highlight.svg`)
