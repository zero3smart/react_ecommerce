import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import closeSvgSrc from 'assets/svg/close.svg'
import { VisualFilter } from 'models'
import './filter-panel.css'

export default class FilterPanel extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func
  }

  static defaultProps = {
    className: '',
    onClose: () => { console.debug('FilterPanel - close button clicked') }
  }

  componentDidMount () {
    this.visualFilter = new VisualFilter('#VisualFilter', {
      onBodyPartClick: this.handleFilterChange
    })
  }

  get handleFilterChange () {
    return (filters) => {
      console.debug('filters changed', filters)
    }
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
