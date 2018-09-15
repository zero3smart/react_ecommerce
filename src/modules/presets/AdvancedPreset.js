/**
 * AdvancedPreset
 * a preset card with 4 matching result thumbnail
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash-es/omit'
import Preset from './Preset'
import PresetMatches from './PresetMatches'
import { getProducts } from 'ducks/products'
import './advanced-preset.css'

export default class AdvancedPreset extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    preset: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    onToggleLike: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      products: []
    }
  }

  async componentDidMount () {
    const { preset } = this.props

    // get 4 products relevant to the preset
    const response = await getProducts(omit(preset, 'favorite', 'name'), 4)
    this.setState({ products: response.products })
  }

  render () {
    const { id, preset, onClick, onToggleLike } = this.props
    const { products } = this.state

    return (
      <div className='AdvancedPreset'>
        <Preset
          key={preset.name}
          id={id}
          name={preset.name}
          collar={preset.collar}
          coretype={preset.coretype}
          neckline={preset.neckline}
          shoulder={preset.shoulder}
          sleeveLength={preset.sleeve_length}
          topLength={preset.top_length}
          pattern={preset.pattern}
          solid={preset.solid}
          details={preset.details}
          color={preset.color}
          favorite={preset.favorite}
          onClick={onClick}
          onToggleLike={onToggleLike}
        />
        <PresetMatches products={products} preset={preset} onClick={onClick} />
      </div>
    )
  }
}