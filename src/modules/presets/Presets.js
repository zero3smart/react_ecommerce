import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
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

  render () {
    const { isPresetsFetched, presets } = this.props
    return (
      <div>
        <Transition show={isPresetsFetched} transition='fadeInUp'>
          {
            presets.map((preset, index) => (
              <Preset
                key={`${preset.name} ${index}`}
                collar={preset.collar}
                coretype={preset.coretype}
                details={preset.details}
                neckline={preset.neckline}
                pattern={preset.pattern}
                shoulder={preset.shoulder}
                sleeveLength={preset.sleeve_length}
                solid={preset.solid}
                topLength={preset.top_length}
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
