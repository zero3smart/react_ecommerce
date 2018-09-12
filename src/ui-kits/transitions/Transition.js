import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Transition as RTransition } from 'react-transition-group'
import './transition.css'

class Transition extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element
    ]).isRequired,
    transition: PropTypes.oneOf(['fadeIn', 'fadeInUp', 'fadeInDown', 'unstyled']),
    timeout: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    className: PropTypes.string
  }

  static defaultProps = {
    show: false,
    transition: 'fadeIn',
    timeout: 100,
    in: false
  }

  render () {
    const { transition, timeout, children, show, className } = this.props

    return (
      <RTransition timeout={timeout} in={show} className={className}>
        {
          state => {
            if (state === 'exited') {
              return null
            }
            return (
              React.Children.map(children, element => (
                React.cloneElement(element, {
                  className: element.props.className + ` animated ${transition}-${state}`
                })
              ))
            )
          }
        }
      </RTransition>
    )
  }
}

export default Transition
