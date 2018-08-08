import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import camelCase from 'lodash-es/camelCase'
import { fetchPresets } from 'ducks/filters'
import Transition from 'ui-kits/transitions/Transition'
import Preset from './Preset'

class Presets extends Component {
  static propTypes = {
    presets: PropTypes.array,
    isPresetsFetched: PropTypes.bool,
    fetchPresets: PropTypes.func
  }

  static defaultProps = {
    presets: [],
    isPresetsFetched: false
  }

  componentDidMount () {
    const { fetchPresets } = this.props
    fetchPresets()
  }

  get handlePresetClick () {
    return (filters) => {
      console.debug('filters', filters)
    }
  }

  render () {
    const { isPresetsFetched, presets } = this.props
    return (
      <div>
        <Transition show={isPresetsFetched} transition='fadeInUp'>
          {
            presets.map((preset, index) => (
              <Preset
                key={`${preset.name} ${index}`}
                id={`${camelCase(preset.name)}${index}`}
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
                onClick={this.handlePresetClick}
                style={{ animationDelay: `${50 * index}ms` }}
              />
            ))
          }
        </Transition>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  presets: state.filters.presets,
  isPresetsFetched: state.filters.presetsFetched
})

export default connect(mapStateToProps, { fetchPresets })(Presets)
