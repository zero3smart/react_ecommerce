import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import includes from 'lodash-es/includes'
import { FilterButton } from 'ui-kits/buttons'
import { FABRIC_COLORS } from 'config/constants'
import detailSVGSrc from 'assets/svg/detail.svg'
import detailActiveSVGSrc from 'assets/svg/detail-active.svg'
import patternSVGSrc from 'assets/svg/pattern.svg'
import patternActiveSVGSrc from 'assets/svg/pattern-active.svg'
import colorSVGSrc from 'assets/svg/color.svg'
import './fabric-filters.css'

export default class FabricFilters extends PureComponent {
  static propTypes = {
    details: PropTypes.number,
    pattern: PropTypes.number,
    solid: PropTypes.number,
    color: PropTypes.string,
    onChange: PropTypes.func,
    disableEvent: PropTypes.bool
  }

  static defaultProps = {
    details: 0,
    pattern: 0,
    solid: 0,
    color: 'black',
    onChange: (filters) => {},
    disableEvent: false
  }

  isActive (filter) {
    return filter === 1
  }

  get handleClick () {
    const { details, pattern, solid, onChange, disableEvent } = this.props
    return (value, name) => {
      const filters = {
        details,
        pattern,
        solid
      }
      // toggle value, between 0 and 1
      const newValue = this.isActive(value) ? 0 : 1

      if (!disableEvent) {
        onChange({ ...filters, [name]: newValue })
      }
    }
  }

  render () {
    const { details, pattern, solid, color, disableEvent } = this.props

    const colorBackground = FABRIC_COLORS[color]
    return (
      <div className={classNames('FabricFilters', { noEvents: disableEvent })}>
        <FilterButton
          name='solid'
          value={solid}
          onClick={this.handleClick}
          iconStyle={this.isActive(solid) ? styles.solidIconActive : styles.solidIcon}
          style={styles.button}>
          Solid
        </FilterButton>
        <FilterButton
          name='pattern'
          value={pattern}
          onClick={this.handleClick}
          iconSrc={this.isActive(pattern) ? patternActiveSVGSrc : patternSVGSrc}
          style={styles.button}>
          Patterns
        </FilterButton>
        <FilterButton
          name='details'
          value={details}
          onClick={this.handleClick}
          iconSrc={this.isActive(details) ? detailActiveSVGSrc : detailSVGSrc}
          style={styles.button}>
          Details
        </FilterButton>
        <FilterButton
          name='color'
          value={color}
          onClick={this.handleClick}
          iconSrc={includes(['all', null], color) ? colorSVGSrc : null}
          iconStyle={{
            backgroundColor: colorBackground,
            border: colorBackground && (
              color === 'white' ? '1px solid #3D3D3D' : '1px solid #D7D0D9'
            )
          }}
          style={styles.button}>
          Colors
        </FilterButton>
      </div>
    )
  }
}

const styles = {
  solidIcon: {
    border: '1px solid #3D3D3D'
  },
  solidIconActive: {
    background: '#3D3D3D',
    border: '1px solid #3D3D3D'
  },
  button: {
    maxWidth: 100,
    marginRight: 0,
    marginBottom: 5
  }
}
