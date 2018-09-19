import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchRecommendedProducts } from 'ducks/products'
import { ProductList } from 'modules/products'
import { AdvancedPresetList } from 'modules/presets'
import { InfoBanner } from 'ui-kits/banners'
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
          <h2>Today’s pick for you.</h2>
          <p>(The more you 'like', the better suggestion it gets.)</p>
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
          <p>(A shortcut to the fits. Click the fit you like.)</p>
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
    marginBottom: 8
  }
}
