import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import isEqual from 'lodash-es/isEqual'
import { VisualFilter } from 'models'
import './float-button.css'

export default class FloatButton extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    filters: PropTypes.object,
    noShadow: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func
  }

  static defaultProps = {
    id: 'VisualFilterButton',
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
    this.visualFilterButton = new VisualFilter(`#${id}`, {
      defaultState: filters,
      disableEvent: true,
      hideThumbnail: true,
      hideOnboarding: true,
      onSVGLoaded: this.handleSVGLoaded,
      onFilterChange: () => {}
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
    const { id, onClick, className, style, noShadow } = this.props
    const { svgLoaded } = this.state

    return (
      <div className={classNames('FloatButton', { svgLoaded, [className]: className, withShadow: !noShadow })} style={style} onClick={onClick}>
        <svg id={id} />
      </div>
    )
  }
}
