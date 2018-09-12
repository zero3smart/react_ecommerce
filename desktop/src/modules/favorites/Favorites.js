import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Tabs from 'ui-kits/navigations/Tabs'
import { syncFavoriteProducts } from 'yesplz@ducks/products'
import { syncFilter, syncFavoritePresets } from 'yesplz@ducks/filters'
import { ProductList, ProductGridCompact } from 'yesplz@modules/products'
import Presets from 'modules/presets/Presets'
import './favorites.css'

class Favorites extends Component {
  static propTypes = {
    favoriteType: PropTypes.string,
    products: PropTypes.array,
    presets: PropTypes.array,
    nextPage: PropTypes.number,
    match: PropTypes.object,
    syncFilter: PropTypes.func.isRequired,
    syncFavoritePresets: PropTypes.func.isRequired,
    syncFavoriteProducts: PropTypes.func.isRequired
  }

  componentDidMount () {
    const { syncFilter, syncFavoritePresets, syncFavoriteProducts } = this.props

    syncFilter()
    syncFavoritePresets()
    syncFavoriteProducts()
  }

  render () {
    const { products, presets, nextPage, favoriteType, match } = this.props

    const showFits = favoriteType === 'fits'
    const tabNav = (
      <div className='Favorites-tab-nav'>
        <Tabs kind='capsule' style={showFits ? styles.fitsTabs : styles.tabs}>
          <NavLink to='/favorites/fits'>fits</NavLink>
          <NavLink to='/favorites/clothing'>clothing</NavLink>
        </Tabs>
      </div>
    )

    return (
      <div className='Favorites'>
        {
          showFits ? (
            <Presets
              presets={presets}
              presetBaseURI='/favorites/fits'
              extraItem={tabNav}
              style={styles.presets}
              match={match}
              show />
          ) : (
            <ProductList
              id='MainScroll'
              products={products}
              nextPage={nextPage}
              extraItem={tabNav}
              className='Favorites-products'
              showOriginalPrice
              show>
              {props => <ProductGridCompact {...props} />}
            </ProductList>
          )
        }
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  favoriteType: props.match.params.favoriteType,
  products: state.products.favoriteList,
  presets: state.filters.favoritePresets,
  nextPage: state.products.nextPage
})

export default connect(
  mapStateToProps,
  {
    syncFilter,
    syncFavoritePresets,
    syncFavoriteProducts
  }
)(Favorites)

const styles = {
  tabs: {
    marginTop: 10,
    marginBottom: 25
  },
  fitsTabs: {
    marginTop: 10,
    marginRight: 5,
    marginBottom: 25,
    marginLeft: 5
  },
  presets: {
    height: '100%'
  }
}
