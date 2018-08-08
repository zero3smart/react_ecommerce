import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import camelCase from 'lodash-es/camelCase'
import { history } from 'config/store'
import { enableInitialFetch } from 'ducks/products'
import { fetchPresets, setFilter, likePreset, unlikePreset } from 'ducks/filters'
import Transition from 'ui-kits/transitions/Transition'
import { DotLoader } from 'ui-kits/loaders'
import Preset from './Preset'
import './presets.css'

export class Presets extends Component {
  static propTypes = {
    presets: PropTypes.array,
    isPresetsFetched: PropTypes.bool,
    fetchPresets: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    likePreset: PropTypes.func.isRequired,
    unlikePreset: PropTypes.func.isRequired,
    enableInitialFetch: PropTypes.func.isRequired,
    extraItem: PropTypes.element,
    style: PropTypes.object
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
    const { setFilter, enableInitialFetch } = this.props
    return (filters) => {
      setFilter(filters)
      // make products fetched from beginning
      enableInitialFetch()
      // redirect to Tops page
      history.push('/')
    }
  }

  get togglePresetLike () {
    const { likePreset, unlikePreset } = this.props
    return (presetName, favorite) => {
      if (favorite) {
        likePreset(presetName)
      } else {
        unlikePreset(presetName)
      }
    }
  }

  render () {
    const { isPresetsFetched, presets, extraItem, style } = this.props
    return (
      <div className='Presets' style={style}>
        {extraItem}
        {!isPresetsFetched && <DotLoader visible style={styles.loader} />}
        <Transition show={isPresetsFetched} transition='fadeInUp'>
          {
            presets.map((preset, index) => (
              <Preset
                key={preset.name}
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
                favorite={preset.favorite}
                onClick={this.handlePresetClick}
                onToggleLike={this.togglePresetLike}
                style={{ animationDelay: `${50 * index}ms` }}
              />
            ))
          }
        </Transition>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  presets: props.presets || state.filters.presets,
  isPresetsFetched: state.filters.presetsFetched
})

export default connect(
  mapStateToProps,
  {
    fetchPresets,
    setFilter,
    likePreset,
    unlikePreset,
    enableInitialFetch
  }
)(Presets)

const styles = {
  loader: {
    position: 'absolute',
    margin: 'auto',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 100,
    height: 30
  }
}
