import React, { Component } from 'react'
import PropTypes from 'prop-types'
import reduce from 'lodash-es/reduce'
import isEqual from 'lodash-es/isEqual'
import DotLoader from 'ui-kits/loaders/DotLoader'

class ScrollFetcher extends Component {
  static propTypes = {
    id: PropTypes.string,
    children: PropTypes.any,
    className: PropTypes.string,
    style: PropTypes.object,
    disableInitalFetch: PropTypes.bool,
    offsetScroll: PropTypes.number, // fetch will be triggered before touching this offset
    onFetch: PropTypes.func.isRequired,
    onScroll: PropTypes.func
  }

  static defaultProps = {
    onFetch: (next) => { next() },
    onScroll: (top) => {},
    className: '',
    style: {},
    disableInitalFetch: false,
    offsetScroll: window.innerHeight
  }

  constructor (props) {
    super(props)
    this.state = {
      isFetchingData: false
    }
    this.prevTopScroll = true
    this.scrollCheckTimeout = null
  }

  componentDidMount () {
    if (!this.props.disableInitalFetch) {
      this.checkScrollOnMount()
    }
  }

  componentDidUpdate (prevProps) {
    if (!isEqual(prevProps.children, this.props.children) && !this.props.disableInitalFetch) {
      this.checkScrollOnMount()
    }
  }

  componentWillUnmount () {
    if (!this.scrollCheckTimeout) {
      clearTimeout(this.scrollCheckTimeout)
    }
  }

  checkScrollOnMount () {
    // This function will check whether the container has a scroll or not.
    // If not, then we need to do a fetch to fill more items.
    // We need the scroll to be available, so onScroll callback can be triggered.
    this.scrollCheckTimeout = setTimeout(() => { // need to have setTimeout, waiting for this component to complete rendering
      const scrollFetcher = this.scrollFetcher
      if (scrollFetcher) {
        const contentHeight = reduce((scrollFetcher.children), (totalHeight, child) => (totalHeight + child.clientHeight), 0)
        // This will check whether the container has scroll or not
        if (scrollFetcher.offsetHeight > contentHeight) { // container doesn't has scroll
          this.handleFetch() // do fetch
        }
      }
    }, 100)
  }

  get handleFetch () {
    const { onFetch } = this.props
    return () => {
      this.setState({
        isFetchingData: true
      })
      onFetch(() => {
        this.setState({
          isFetchingData: false
        })
      })
    }
  }

  get handleScrollFrame () {
    const { offsetScroll, onScroll } = this.props
    const { isFetchingData } = this.state
    return (e) => {
      const currentTarget = e.currentTarget
      const top = currentTarget.scrollTop + currentTarget.offsetHeight
      onScroll(top)
      // onScrollDown && scroll space left is <= offsetScroll, load next post if no previous request is still running
      if (this.prevTopScroll < top && currentTarget.scrollHeight - top <= offsetScroll && !isFetchingData) {
        this.handleFetch()
      }
      this.prevTopScroll = top
    }
  }

  get loadRef () {
    return (element) => {
      this.scrollFetcher = element
    }
  }

  render () {
    const { id, className, style } = this.props
    const { isFetchingData } = this.state
    return (
      <div id={id} ref={this.loadRef} className={className} onScroll={this.handleScrollFrame} style={{ ...style, ...styles.wrapper }}>
        {this.props.children}
        <DotLoader visible={isFetchingData} style={styles.loader} />
      </div>
    )
  }
}

export default ScrollFetcher

const styles = {
  wrapper: {
    overflow: 'auto',
    overflowScrolling: 'touch',
    WebkitOverflowScrolling: 'touch'
  },
  loader: {
    width: '100%',
    flexBasis: '100%',
    order: 999 // place at the end
  }
}
