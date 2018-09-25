import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import { syncFavoriteProducts } from 'ducks/products'
import { syncFilter, syncFavoritePresets } from 'ducks/filters'
import { withTrackingProvider } from 'hoc'
import Tabs from 'ui-kits/navigations/Tabs'
import { ProductList } from 'modules/products'
import { Presets } from 'modules/presets'
import './favorites.css'

class Favorites extends Component {
  static propTypes = {
    favoriteType: PropTypes.string,
    products: PropTypes.array,
    presets: PropTypes.array,
    nextPage: PropTypes.number,
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
    const { products, presets, nextPage, favoriteType } = this.props

    const showFits = favoriteType === 'fits'
    const banner = (
      <div className='container'>
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
              extraItem={banner}
              style={styles.presets}
              show />
          ) : (
            <ProductList
              id='MainScroll'
              products={products}
              nextPage={nextPage}
              extraItem={banner}
              className='Favorites-products'
              show
              combined
            />
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

export default compose(
  connect(
    mapStateToProps,
    {
      syncFilter,
      syncFavoritePresets,
      syncFavoriteProducts
    }
  ),
  withTrackingProvider('Favorites')
)(Favorites)

const styles = {
  tabs: {
    marginTop: 10,
    marginBottom: 20
  },
  fitsTabs: {
    marginTop: 20,
    marginBottom: 20
  },
  presets: {
    height: '100%'
  }
}
