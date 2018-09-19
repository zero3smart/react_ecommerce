import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FloatButton } from 'modules/filters'
import { InfoBanner } from 'ui-kits/banners'

export default class TopsInfoBanner extends Component {
  static propTypes = {
    filters: PropTypes.object.isRequired,
    onVisualFilterClick: PropTypes.func.isRequired
  }

  render () {
    const { filters, onVisualFilterClick } = this.props

    return (
      <InfoBanner style={styles.infoBanner}>
        <p style={{ display: 'inline-block' }}>
        Let’s find a style. Click
        </p>
        <FloatButton
          id='VisualFilterPreview'
          filters={filters}
          onClick={onVisualFilterClick}
          style={styles.smallVisualFilterButton}
          noShadow
        />
      </InfoBanner>
    )
  }
}

const styles = {
  infoBanner: {
    marginTop: -10,
    marginLeft: -5,
    marginRight: -5,
    marginBottom: 8
  },
  smallVisualFilterButton: {
    display: 'inline-block',
    width: 40,
    height: 40,
    paddingTop: 5,
    marginLeft: 7,
    marginTop: -10,
    position: 'static',
    verticalAlign: 'top'
  }
}
