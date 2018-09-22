import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Transition from 'ui-kits/transitions/Transition'
import './tutorial-page.css'

export default class TutorialPage extends Component {
  static propTypes = {
    pageKey: PropTypes.number.isRequired,
    activeKey: PropTypes.number.isRequired,
    children: PropTypes.any,
    onClick: PropTypes.func
  }

  static defaultProps = {
    onClick: () => { console.debug('TutorialPage - click') }
  }
  render () {
    const { pageKey, activeKey, children, onClick } = this.props

    return (
      <Transition timeout={{ enter: 500, exit: 500 }} show={pageKey === activeKey} transition='fadeIn'>
        <div className='TutorialPage' onClick={onClick}>
          {children}
        </div>
      </Transition>
    )
  }
}
