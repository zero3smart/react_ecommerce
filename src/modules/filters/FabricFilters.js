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
    style: PropTypes.object,
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
    return (values) => {
      const { details, pattern, solid, disableEvent, onChange } = this.props
      const filters = {
        details,
        pattern,
        solid,
        color: values && values.join(',')
      }
      if (!disableEvent) {
        onChange(filters)
      }
    }
  }

  render () {
    const { details, pattern, solid, color, disableEvent, kind, style } = this.props
    const { collorPalleteVisible } = this.state

    const filterButtonChild = disableEvent ? 'Colors' : <img src={angleSVGSrc} alt='color-picker' className='arrow' />

    // color button style
    const colorValues = color ? color.split(',') : []
    const colorHex = colorValues.length === 1 ? FABRIC_COLORS[color] : null
    const colorBackgroundImage = includes(['pastel', 'metal'], color) && colorHex // background image only applied for gradient color value
    // end of color button style

    return (
      <div className={classNames('FabricFilters', { noEvents: disableEvent, [kind]: kind })} style={style}>
        <FilterButton
          name='solid'
          value={solid}
          onClick={this.handleClick}
          active={this.isActive(solid)}
          iconStyle={this.isActive(solid) ? styles.solidIconActive : styles.solidIcon}>
          Solid
        </FilterButton>
        <FilterButton
          name='pattern'
          value={pattern}
          onClick={this.handleClick}
          active={this.isActive(pattern)}
          iconSrc={this.isActive(pattern) ? patternActiveSVGSrc : patternSVGSrc}>
          Patterns
        </FilterButton>
        <FilterButton
          name='details'
          value={details}
          onClick={this.handleClick}
          active={this.isActive(details)}
          iconSrc={this.isActive(details) ? detailActiveSVGSrc : detailSVGSrc}>
          Details
        </FilterButton>
        <FilterButton
          name='color'
          value={color}
          onClick={this.toggleColorPallete}
          iconSrc={includes(['all', null], color) || !colorHex ? colorSVGSrc : null}
          iconStyle={{
            backgroundColor: colorHex,
            backgroundImage: colorBackgroundImage
          }}
          className={classNames('ColorPicker', { open: collorPalleteVisible })}>
          {filterButtonChild}
        </FilterButton>
        <Transition timeout={{ enter: 100, exit: 200 }} show={collorPalleteVisible}>
          <ColorPallete values={colorValues} onColorClick={this.handleColorClick} />
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
  }
}
