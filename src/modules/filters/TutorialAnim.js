import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import isEqual from 'lodash-es/isEqual'
import { VisualFilter } from 'models'
import './float-button.css'

export default class TutorialAnim extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    filters: PropTypes.object,
    noShadow: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func
  }

  static defaultProps = {
    id: 'TutorialAnim',
    noShadow: false
  }

  constructor (props) {
    super(props)
    this.state = {
      svgLoaded: false
    }
  }

  componentDidMount () {
    const { id, filters } = this.props
    // initialize visual filter
    this.TutorialAnim = new VisualFilter(`#${id}`, {
      defaultState: filters,
      disableEvent: true,
      hideThumbnail: true,
      hideMiniOnboarding: true,
      tutorialAnim: true,
      onSVGLoaded: this.handleSVGLoaded,
      onFilterChange: () => {}
    })
  }

  componentDidUpdate (prevProps, prevState) {
    const { filters } = this.props
    const { svgLoaded } = this.state
    if (!isEqual(svgLoaded, prevState.svgLoaded) || !isEqual(filters, prevProps.filters)) {
      this.TutorialAnim.updateState(filters)
    }
  }

  get handleSVGLoaded () {
    return () => {
      this.setState({
        svgLoaded: true
      })
    }
  }

  render () {
    const { id, onClick, className, style, noShadow } = this.props
    const { svgLoaded } = this.state

    return (
      <div className={classNames('TutorialAnim', { svgLoaded, [className]: className, withShadow: !noShadow })} style={style} onClick={onClick}>
        <svg id={id} />
      </div>
    )
  }
}
