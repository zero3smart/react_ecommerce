import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchRecommendedProducts } from 'ducks/products'
import { ProductList } from 'modules/products'
import { AdvancedPresetList } from 'modules/presets'
import { InfoBanner } from 'ui-kits/banners'
import { withTrackingProvider } from 'hoc'
import './home.css'

class Home extends Component {
  static propTypes = {
    recommendedProducts: PropTypes.array,
    fetchRecommendedProducts: PropTypes.func.isRequired
  }

  static defaultProps = {
    recommendedProducts: []
  }

  async componentDidMount () {
    const { recommendedProducts, fetchRecommendedProducts } = this.props
    // make sure recommended fetch only run once
    if (recommendedProducts.length === 0) {
      fetchRecommendedProducts()
    }
  }

  render () {
    const { recommendedProducts } = this.props

    return (
      <div id='MainScroll' className='Home'>
        <InfoBanner style={styles.infoBanner}>
          <h2>Today’s Pick for You</h2>
          <p>the more you like, the better it gets</p>
        </InfoBanner>
        <ProductList
          products={recommendedProducts}
          className='Recommended-products'
          style={{ overflow: 'hidden' }}
          showOriginalPrice
          show
          combined
        />
        <InfoBanner style={styles.infoBanner}>
          <h2>Editor's Pick</h2>
          <p>shortcut to the fits</p>
        </InfoBanner>
        <AdvancedPresetList />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  recommendedProducts: state.products.recommendedList
})

export default compose(
  connect(mapStateToProps, { fetchRecommendedProducts }),
  withTrackingProvider('Home')
)(Home)

const styles = {
  infoBanner: {
    marginBottom: 8
  }
}
