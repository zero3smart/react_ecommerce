import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Transition from 'ui-kits/transitions/Transition'
import './tutorial-page.css'

export default class TutorialPage extends Component {
  static propTypes = {
    pageKey: PropTypes.number.isRequired,
    activeKey: PropTypes.number.isRequired,
    children: PropTypes.any,
    duration: PropTypes.number, // will call `onFinish` after this duration fulfilled
    onClick: PropTypes.func,
    onFinish: PropTypes.func
  }

  static defaultProps = {
    onClick: () => { console.debug('TutorialPage - click') },
    onFinish: () => { console.debug('TutorialPage - finished') }
  }

  get handleEntered () {
    return () => {
      const { duration, onFinish } = this.props
      // if `duration` defined, add showing duration to the page
      if (duration) {
        this.pageTimeout = setTimeout(() => {
          onFinish()
        }, duration)
      }
    }
  }

  componentWillUnmount () {
    this.pageTimeout && clearTimeout(this.pageTimeout)
  }

  render () {
    const { pageKey, activeKey, children, onClick } = this.props

    return (
      <Transition timeout={{ enter: 500, exit: 500 }} show={pageKey === activeKey} transition='fadeIn' onEntered={this.handleEntered}>
        <div className='TutorialPage' onClick={onClick}>
          {children}
        </div>
      </Transition>
    )
  }
}
