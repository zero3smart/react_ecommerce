import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import camelCase from 'lodash/camelCase'
import history from '@yesplz/core-web/config/history'
import { enableInitialFetch } from '@yesplz/core-redux/ducks/products'
import { fetchPresets, setFilter, likePreset, unlikePreset } from '@yesplz/core-redux/ducks/filters'
import Transition from '@yesplz/core-web/ui-kits/transitions/Transition'
import { DotLoader } from '@yesplz/core-web/ui-kits/loaders'
import AdvancedPreset from './AdvancedPreset'
import { withTrackingConsumer } from '../../hoc'

export class AdvancedPresetList extends Component {
  static propTypes = {
    presets: PropTypes.array,
    isPresetsFetched: PropTypes.bool,
    presetMatchesCount: PropTypes.number,
    fetchPresets: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    likePreset: PropTypes.func.isRequired,
    unlikePreset: PropTypes.func.isRequired,
    enableInitialFetch: PropTypes.func.isRequired,
    tracker: PropTypes.object,
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
    const { setFilter, enableInitialFetch, tracker } = this.props
    return (filters, presetName) => {
      setFilter(filters)
      // make products fetched from beginning
      enableInitialFetch()
      // redirect to preset's products page
      history.push(`/preset-products/${presetName}`)
      // track preset click
      tracker.track('Preset Choose', { name: presetName })
    }
  }

  get togglePresetLike () {
    const { likePreset, unlikePreset, tracker } = this.props
    return (preset, favorite) => {
      if (favorite) {
        likePreset(preset, tracker)
      } else {
        unlikePreset(preset, tracker)
      }
    }
  }

  render () {
    const { isPresetsFetched, presets, presetMatchesCount, style } = this.props

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
                presetMatchesCount={presetMatchesCount}
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

export default compose(
  connect(
    mapStateToProps,
    {
      fetchPresets,
      setFilter,
      likePreset,
      unlikePreset,
      enableInitialFetch
    }
  ),
  withTrackingConsumer()
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
