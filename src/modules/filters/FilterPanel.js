import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import closeSvgSrc from 'assets/svg/close.svg'
import { VisualFilter } from 'models'
import './filter-panel.css'

export default class FilterPanel extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    onFilterChange: PropTypes.func,
    onClose: PropTypes.func
  }

  static defaultProps = {
    className: '',
    onFilterChange: (filters) => { console.debug('FilterPanel - filter changed', filters) },
    onClose: () => { console.debug('FilterPanel - close button clicked') }
  }

  componentDidMount () {
    const { onFilterChange } = this.props
    // initialize visual filter
    this.visualFilter = new VisualFilter('#VisualFilter', {
      onBodyPartClick: onFilterChange
    })
  }

  render () {
    const { onClose, className } = this.props

    return (
      <div className={`FilterPanel ${className}`}>
        <div className='FilterPanel-close' onClick={onClose}>
          <img src={closeSvgSrc} alt='Close Filter' />
        </div>
        <svg id='VisualFilter' />
      </div>
    )
  }
}
