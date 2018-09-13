import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import camelCase from 'lodash-es/camelCase'
import { history } from 'config/store'
import { enableInitialFetch } from 'ducks/products'
import { fetchPresets, setFilter, likePreset, unlikePreset } from 'ducks/filters'
import Transition from 'ui-kits/transitions/Transition'
import { DotLoader } from 'ui-kits/loaders'
import AdvancedPreset from './AdvancedPreset'

export class AdvancedPresetList extends Component {
  static propTypes = {
    presets: PropTypes.array,
    isPresetsFetched: PropTypes.bool,
    fetchPresets: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    likePreset: PropTypes.func.isRequired,
    unlikePreset: PropTypes.func.isRequired,
    enableInitialFetch: PropTypes.func.isRequired,
    style: PropTypes.object
  }

  static defaultProps = {
    presets: [],
    isPresetsFetched: false
  }

  componentDidMount () {
    const { fetchPresets, isPresetsFetched } = this.props
    // don't need to do initial fetch if presets is fetched already
    if (!isPresetsFetched) {
      fetchPresets()
    }
  }

  get handlePresetClick () {
    const { setFilter, enableInitialFetch } = this.props
    return (filters) => {
      setFilter(filters)
      // make products fetched from beginning
      enableInitialFetch()
      // redirect to Tops page
      history.push('/products')
    }
  }

  get togglePresetLike () {
    const { likePreset, unlikePreset } = this.props
    return (preset, favorite) => {
      if (favorite) {
        likePreset(preset)
      } else {
        unlikePreset(preset)
      }
    }
  }

  render () {
    const { isPresetsFetched, presets, style } = this.props

    return (
      <div className='AdvancedPresetList' style={style}>
        {!isPresetsFetched && <DotLoader visible style={styles.loader} />}
        <Transition show={isPresetsFetched} transition='fadeInUp'>
          {
            presets.map((preset, index) => (
              <AdvancedPreset
                key={preset.name}
                id={`${camelCase(preset.name)}${index}`}
                preset={preset}
                onClick={this.handlePresetClick}
                onToggleLike={this.togglePresetLike}
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
  isPresetsFetched: props.show || state.filters.presetsFetched
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
)(AdvancedPresetList)

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
