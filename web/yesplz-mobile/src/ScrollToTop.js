import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { CATEGORY_SEARCH } from '@yesplz/core-web/config/constants'

class ScrollToTop extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    children: PropTypes.any
  }

  componentDidUpdate (prevProps) {
    if (this.props.location !== prevProps.location && this.props.location.pathname.indexOf(`products/${CATEGORY_SEARCH}/`) < 0) {
      setTimeout(() => {
        // const warrapedElement = document.getElementById('MainScroll') ? document.getElementById('MainScroll') : document.getElementById('Base-mobile')
        window.scrollTo(0, 0)
      }, 200)
    }
  }

  render () {
    return this.props.children
  }
}

export default withRouter(ScrollToTop)
