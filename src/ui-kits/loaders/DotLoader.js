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
      <div className='dot-loader' style={style}>
        <div className='dot' style={dotStyle} />
        <div className='dot' style={dotStyle} />
        <div className='dot' style={dotStyle} />
      </div>
    )
  }
}

export default DotLoader
