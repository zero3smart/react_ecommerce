import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import withTrackingProvider from 'yesplz@hoc/withTrackingProvider'
import { fetchRecommendedProducts } from 'yesplz@ducks/products'
import { ProductList } from 'yesplz@modules/products'
import { AdvancedPresetList } from 'yesplz@modules/presets'
import { InfoBanner } from 'yesplz@ui-kits/banners'
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
      fetchRecommendedProducts(11)
    }
  }

  render () {
    const { recommendedProducts } = this.props

    return (
      <div id='MainScroll' className='Home'>
        <InfoBanner style={styles.infoBanner}>
          <h1>Today’s Pick for You</h1>
          <p>the more you like, the better it gets</p>
        </InfoBanner>
        <div className='container'>
          <ProductList
            products={recommendedProducts}
            className='Recommended-products'
            style={{ overflow: 'hidden' }}
            showOriginalPrice
            show
            combined
          />
        </div>
        <InfoBanner style={styles.infoBanner}>
          <h1>Editor's Pick</h1>
          <p style={styles.infoBannerDescription}>shortcut to the fits</p>
        </InfoBanner>
        <div className='container'>
          <AdvancedPresetList presetMatchesCount={3} />
        </div>
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
    marginBottom: 20,
    padding: '25px 70px 35px'
  }
}
