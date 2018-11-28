import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import camelCase from 'lodash-es/camelCase'
import { history } from 'config/store'
import { fetchPresets, setFilter } from 'yesplz@ducks/filters'
import SimplePreset from 'yesplz@modules/presets/SimplePreset'
import './top-presets.css'

class TopPresets extends Component {
  static propTypes = {
    presets: PropTypes.array,
    isPresetsFetched: PropTypes.bool,
    fetchPresets: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired
  }

  componentDidMount () {
    const { fetchPresets, isPresetsFetched } = this.props
    if (!isPresetsFetched) {
      fetchPresets()
    }
  }

  get handlePresetClick () {
    const { setFilter } = this.props
    return (filters, presetName) => {
      // set filter
      setFilter(filters)
      // redirect to presets page
      history.push(`/presets/${presetName}`)
    }
  }

  render () {
    const { presets } = this.props

    return (
      <div className='TopPresets'>
        {
          presets.map((preset, index) => (
            <SimplePreset
              key={preset.name}
              id={`${camelCase(preset.name)}${index}`}
              name={preset.name}
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
              onClick={this.handlePresetClick}
              onToggleLike={this.togglePresetLike}
            />
          ))
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  presets: (state.filters.presets || []).slice(0, 3),
  isPresetsFetched: state.filters.presetsFetched
})

export default connect(mapStateToProps, { fetchPresets, setFilter })(TopPresets)
