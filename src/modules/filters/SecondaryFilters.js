import React, { Component } from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash-es/omit'
import reduce from 'lodash-es/reduce'
import Button from 'ui-kits/buttons/Button'
import Transition from 'ui-kits/transitions/Transition'
import ColorPallete from './ColorPallete'
import DesignFilters from './DesignFilters'
import classNames from 'classnames'
import './secondary-filters.css'

export default class SecondaryFilters extends Component {
  static propTypes = {
    sale: PropTypes.number,
    fabricFilters: PropTypes.shape({
      details: PropTypes.number,
      pattern: PropTypes.number,
      solid: PropTypes.number,
      color: PropTypes.string
    }),
    style: PropTypes.object,
    onChange: PropTypes.func
  }

  static defaultProps = {
    sale: false,
    fabricFilters: {},
    kind: 'default',
    onChange: (filters) => { console.debug('SecondaryFilters - filters changed', filters) }
  }

  constructor (props) {
    super(props)
    this.state = {
      collorPalleteVisible: false,
      designFiltersVisible: false
    }
  }

  isActive (filter) {
    return filter === 1
  }

  updateFilter (name, value) {
    const { sale, fabricFilters, onChange } = this.props
    const filters = {
      sale,
      ...fabricFilters,
      ...(name ? { [name]: value } : null)
    }
    onChange(filters)
  }

  get toggleColorPallete () {
    const { collorPalleteVisible } = this.state
    return () => {
      this.setState({
        collorPalleteVisible: !collorPalleteVisible,
        designFiltersVisible: false
      })
    }
  }

  get toggleDesignFilters () {
    const { designFiltersVisible } = this.state
    return () => {
      this.setState({
        collorPalleteVisible: false,
        designFiltersVisible: !designFiltersVisible
      })
    }
  }

  get handleColorClick () {
    return (values) => {
      this.updateFilter('color', values && values.join(','))
    }
  }

  get handleDesignChange () {
    return (value, name) => {
      this.updateFilter(name, value ? 1 : 0)
    }
  }

  get handleSaleChange () {
    const { sale } = this.props
    return () => {
      this.updateFilter('sale', sale === 1 ? 0 : 1)
    }
  }

  render () {
    const { sale, fabricFilters, style } = this.props
    const { collorPalleteVisible, designFiltersVisible } = this.state

    const colorValues = fabricFilters.color ? fabricFilters.color.split(',') : []
    const colorFilterPicked = colorValues.length > 0
    const designFiltersPicked = reduce(omit(fabricFilters, 'color'), (isPicked, filter) => (isPicked || filter === 1), false)

    return (
      <div className='SecondaryFilters' style={style}>
        <Button kind='rounded' className={classNames({ active: sale === 1 })} onClick={this.handleSaleChange}>Sale</Button>
        <Button
          kind='rounded'
          className={classNames({ focus: designFiltersVisible, active: designFiltersPicked })}
          onClick={this.toggleDesignFilters}>
          Design
        </Button>
        <Button
          kind='rounded'
          className={classNames({ focus: collorPalleteVisible, active: colorFilterPicked })}
          onClick={this.toggleColorPallete}>
          Color
        </Button>
        <Transition timeout={{ enter: 100, exit: 200 }} show={collorPalleteVisible}>
          <ColorPallete values={colorValues} onColorClick={this.handleColorClick} />
        </Transition>
        <Transition timeout={{ enter: 100, exit: 200 }} show={designFiltersVisible}>
          <DesignFilters
            solid={this.isActive(fabricFilters.solid)}
            pattern={this.isActive(fabricFilters.pattern)}
            details={this.isActive(fabricFilters.details)}
            onChange={this.handleDesignChange}
          />
        </Transition>
      </div>
    )
  }
}
