import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Tutorial } from 'modules/tutorials'
import VisualFilter from '@yesplz/core-models/lib/VisualFilter'

export default () => WrappedComponent => {
  class TutorialHOC extends PureComponent {
    static propTypes = {
      onboarding: PropTypes.bool.isRequired
    }

    constructor (props) {
      super(props)
      this.state = {
        tutorialActive: true
      }
      this.handleTutorialFinish = this.handleTutorialFinish.bind(this)
    }

    handleTutorialFinish () {
      this.setState({
        tutorialActive: false
      })
      VisualFilter.saveConfig('onboarding_completed', 1)
    }

    render () {
      const { onboarding } = this.props
      const { tutorialActive } = this.state
      return (
        <div className='base-content'>
          {
            onboarding && tutorialActive && <Tutorial onFinish={this.handleTutorialFinish} />
          }
          <WrappedComponent />
        </div>
      )
    }
  }

  const mapStateToProps = state => ({
    onboarding: state.filters.onboarding
  })

  return connect(mapStateToProps)(TutorialHOC)
}
