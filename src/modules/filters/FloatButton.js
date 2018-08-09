import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import isEqual from 'lodash-es/isEqual'
import { VisualFilter } from 'models'
import './float-button.css'

export default class FloatButton extends PureComponent {
  static propTypes = {
    filters: PropTypes.object,
    className: PropTypes.string,
    onClick: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      svgLoaded: false
    }
  }

  componentDidMount () {
    const { filters } = this.props
    // initialize visual filter
    this.visualFilterButton = new VisualFilter('#VisualFilterButton', {
      defaultState: filters,
      disableEvent: true,
      hideThumbnail: true,
      onSVGLoaded: this.handleSVGLoaded
    })
  }

  componentDidUpdate (prevProps, prevState) {
    const { filters } = this.props
    const { svgLoaded } = this.state
    if (!isEqual(svgLoaded, prevState.svgLoaded) || !isEqual(filters, prevProps.filters)) {
      this.visualFilterButton.updateState(filters)
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
    const { onClick, className } = this.props
    const { svgLoaded } = this.state

    return (
      <div className={classNames('FloatButton', { svgLoaded, [className]: className })} onClick={onClick}>
        <svg id='VisualFilterButton' />
      </div>
    )
  }
}
