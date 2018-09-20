import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
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
      fetchRecommendedProducts(4)
    }
  }

  render () {
    const { recommendedProducts } = this.props

    return (
      <div id='MainScroll' className='Home'>
        <InfoBanner style={styles.infoBanner}>
          <h1>Today’s pick for you.</h1>
          <p style={styles.infoBannerDescription}>&nbsp;the more you like, the better it gets.</p>
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
          <p style={styles.infoBannerDescription}>&nbsp;a shortcut to the fits.</p>
        </InfoBanner>
        <AdvancedPresetList />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  recommendedProducts: state.products.recommendedList
})

export default connect(mapStateToProps, { fetchRecommendedProducts })(Home)

const styles = {
  infoBanner: {
    marginBottom: 20,
    padding: '20px 70px 30px'
  },
  infoBannerDescription: {
    fontSize: 28
  }
}
