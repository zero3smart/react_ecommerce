var path = require('path')
var jsdom = require('jsdom')
var requireHacker = require('require-hacker')
var mixpanel = require('mixpanel-browser')
var matchMediaPolyfill = require('mq-polyfill').default
var Enzyme = require('enzyme')
var Adapter = require('enzyme-adapter-react-16')

// load .env variables
require('dotenv').config()

require('babel-register')()

// configure enzyme adapter
Enzyme.configure({ adapter: new Adapter() })

// setup the simplest document possible
// get the window object out of the document
var { window } = new jsdom.JSDOM(
  '<!doctype html><html><body></body></html>',
  {
    url: 'http://asia.yesplz.us/'
  }
)

// set globals for mocha that make access to document and window feel
// natural in the test environment
global.document = window.document

/**
 * Define the window.matchMedia
 */
matchMediaPolyfill(window)

window
  .matchMedia('(min-width: 920px)') // Create MediaQueryList instance
  .addListener(console.log)// Subscribe to MQ mode changes

/**
 * For dispatching resize event
 * we must implement window.resizeTo in jsdom
 */
window.resizeTo = function resizeTo (width, height) {
  Object.assign(this, {
    innerWidth: width,
    innerHeight: height,
    outerWidth: width,
    outerHeight: height
  }).dispatchEvent(new this.Event('resize'))
}

// initialize mixpanel
mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN)

// add fake item to window
global.window = Object.assign({}, window, {
  mixpanel,
  localStorage: {
    values: {},
    setItem: function (key, value) { this.values[key] = value },
    getItem: function (key) { return this.values[key] || null }
  },
  matchMedia: () => (
    {
      matches: false,
      addListener: () => {},
      removeListener: () => {}
    }
  ),
  resizeTo: () => {

  }
})

propagateToGlobal(window)

// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
function propagateToGlobal (window) {
  for (let key in window) {
    if (!window.hasOwnProperty(key)) continue
    if (key in global) continue

    global[key] = window[key]
  }
}

// Fake non-js
// const noopComponentString = '() => (null)'
requireHacker.hook('svg', path => 'module.exports = \'#\'')
requireHacker.hook('png', path => 'module.exports = \'#\'')
requireHacker.hook('jpg', path => 'module.exports = \'#\'')
requireHacker.hook('jpeg', path => 'module.exports = \'#\'')
