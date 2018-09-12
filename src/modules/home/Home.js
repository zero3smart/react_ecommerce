import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchTopProducts } from 'ducks/products'
import { ProductList } from 'modules/products'
import { InfoBanner } from 'ui-kits/banners'
import './home.css'

class Home extends Component {
  static propTypes = {
    topProducts: PropTypes.array,
    fetchTopProducts: PropTypes.func.isRequired
  }

  static defaultProps = {
    topProducts: []
  }

  componentDidMount () {
    const { topProducts, fetchTopProducts } = this.props
    // if top products haven't been fetched
    if (topProducts.length === 0) {
      fetchTopProducts()
    }
  }

  render () {
    const { topProducts } = this.props

    return (
      <div id='MainScroll' className='Home'>
        <InfoBanner style={styles.infoBanner}>
          <h2>Today’s pick for you.</h2>
          <p>(The more you click, the better suggestion it gets.)</p>
        </InfoBanner>
        <ProductList
          products={topProducts}
          className='Recommended-products'
          showOriginalPrice
          show
          style={{ overflow: 'hidden' }}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  topProducts: state.products.topList
})

export default connect(mapStateToProps, { fetchTopProducts })(Home)

const styles = {
  infoBanner: {
    marginBottom: 8
  }
}
