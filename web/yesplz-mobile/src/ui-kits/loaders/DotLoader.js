import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './dot-loader.css'

class DotLoader extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    style: PropTypes.object,
    dotStyle: PropTypes.object
  }

  static defaultProps = {
    visible: false
  }

  render () {
    const { visible, style, dotStyle } = this.props
    if (!visible) {
      return null
    }
    return (
      <div className='DotLoader' style={style}>
        <div className='DotLoader-dot' style={dotStyle} />
        <div className='DotLoader-dot' style={dotStyle} />
        <div className='DotLoader-dot' style={dotStyle} />
      </div>
    )
  }
}

export default DotLoader
