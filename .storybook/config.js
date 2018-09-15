import { configure } from '@storybook/react'

// load stories from `src` directory, with `stories.js` suffix
const req = require.context('../src', true, /\.stories\.js$/)

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module)
