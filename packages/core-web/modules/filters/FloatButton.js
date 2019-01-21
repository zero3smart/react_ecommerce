import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import isEqual from 'lodash/isEqual'
import { VisualFilter } from '@yesplz/core-models'
import './float-button.css'

export default class FloatButton extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    filters: PropTypes.object,
    category: PropTypes.string,
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
    this.disableUpdate = false
  }

  componentDidMount () {
    const { id, filters, category } = this.props
    // initialize visual filter
    this.visualFilterButton = new VisualFilter(`#${id}`, {
      category: category,
      defaultState: filters,
      badgeMode: true,
      hideThumbnail: true,
      hideMiniOnboarding: true,
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

  componentWillUnmount () {
    this.disableUpdate = true
  }

  get handleSVGLoaded () {
    return () => {
      if (!this.disableUpdate) {
        this.setState({
          svgLoaded: true
        })
      }
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
