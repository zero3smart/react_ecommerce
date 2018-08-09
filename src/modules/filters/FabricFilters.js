import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import includes from 'lodash-es/includes'
import { FABRIC_COLORS } from 'config/constants'
import { FilterButton } from 'ui-kits/buttons'
import Transition from 'ui-kits/transitions/Transition'
import ColorPallete from './ColorPallete'
// icons
import detailSVGSrc from 'assets/svg/detail.svg'
import detailActiveSVGSrc from 'assets/svg/detail-active.svg'
import patternSVGSrc from 'assets/svg/pattern.svg'
import patternActiveSVGSrc from 'assets/svg/pattern-active.svg'
import colorSVGSrc from 'assets/svg/color.svg'
import angleSVGSrc from 'assets/svg/angle.svg'

import './fabric-filters.css'

export default class FabricFilters extends PureComponent {
  static propTypes = {
    details: PropTypes.number,
    pattern: PropTypes.number,
    solid: PropTypes.number,
    color: PropTypes.string,
    kind: PropTypes.oneOf(['default', 'inline']),
    onChange: PropTypes.func,
    disableEvent: PropTypes.bool
  }

  static defaultProps = {
    details: 0,
    pattern: 0,
    solid: 0,
    color: null,
    kind: 'default',
    onChange: (filters) => { console.debug('FabricFilters - filters changed', filters) },
    disableEvent: false
  }

  constructor (props) {
    super(props)
    this.state = {
      collorPalleteVisible: false
    }
  }

  isActive (filter) {
    return filter === 1
  }

  get toggleColorPallete () {
    const { collorPalleteVisible } = this.state
    return () => {
      this.setState({ collorPalleteVisible: !collorPalleteVisible })
    }
  }

  get handleClick () {
    const { details, pattern, solid, color, onChange, disableEvent } = this.props
    return (value, name) => {
      const filters = {
        details,
        pattern,
        solid,
        color
      }
      // toggle value, between 0 and 1
      const newValue = this.isActive(value) ? 0 : 1

      if (!disableEvent) {
        onChange({ ...filters, [name]: newValue })
      }
    }
  }

  get handleColorClick () {
    return (name) => {
      const { details, pattern, solid, disableEvent, onChange } = this.props
      const filters = {
        details,
        pattern,
        solid,
        color: name
      }

      if (!disableEvent) {
        onChange(filters)
        this.toggleColorPallete() // close color pallete
      }
    }
  }

  render () {
    const { details, pattern, solid, color, disableEvent, kind } = this.props
    const { collorPalleteVisible } = this.state

    const filterButtonChild = disableEvent ? 'Colors' : <img src={angleSVGSrc} alt='color-picker' />

    // color button style
    const colorValue = FABRIC_COLORS[color]
    const colorBackgroundImage = includes(['pastel', 'metal'], color) && colorValue // background image only applied for gradient color value
    const colorBorder = colorValue && (color === 'white' ? '1px solid #3D3D3D' : '1px solid #D7D0D9')
    // end of color button style

    return (
      <div className={classNames('FabricFilters', { noEvents: disableEvent, [kind]: kind })}>
        <FilterButton
          name='solid'
          value={solid}
          onClick={this.handleClick}
          iconStyle={this.isActive(solid) ? styles.solidIconActive : styles.solidIcon}>
          Solid
        </FilterButton>
        <FilterButton
          name='pattern'
          value={pattern}
          onClick={this.handleClick}
          iconSrc={this.isActive(pattern) ? patternActiveSVGSrc : patternSVGSrc}>
          Patterns
        </FilterButton>
        <FilterButton
          name='details'
          value={details}
          onClick={this.handleClick}
          iconSrc={this.isActive(details) ? detailActiveSVGSrc : detailSVGSrc}>
          Details
        </FilterButton>
        <FilterButton
          name='color'
          value={color}
          onClick={this.toggleColorPallete}
          iconSrc={includes(['all', null], color) ? colorSVGSrc : null}
          iconStyle={{
            backgroundColor: colorValue,
            backgroundImage: colorBackgroundImage,
            border: colorBorder
          }}
          className='ColorPicker'>
          {filterButtonChild}
        </FilterButton>
        <Transition timeout={{ enter: 100, exit: 300 }} show={collorPalleteVisible}>
          <ColorPallete onColorClick={this.handleColorClick} style={styles.colorPallete} />
        </Transition>
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
  colorPallete: {
    position: 'absolute',
    bottom: 60,
    left: 10,
    right: 10,
    margin: 'auto'
  }
}
