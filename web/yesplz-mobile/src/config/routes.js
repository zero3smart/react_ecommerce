import React from 'react'
import { Route, Switch } from 'react-router'
import { NavLink } from 'react-router-dom'
// pages
import { ProductsPage, ProductPage } from '@yesplz/core-web/modules/products'
import { TopsInfoBanner } from '@yesplz/core-web/modules/tops'
import { Faq } from '@yesplz/core-web/modules/faq'
import { Tutorial } from '@yesplz/core-web/modules/tutorials'
import { BreadCrumbs } from '@yesplz/core-web/ui-kits/misc'

import { Base, NotFound } from 'modules/base'
import { Home } from 'modules/home'
import { Favorites } from 'modules/favorites'

const createRoutes = () => (
  <Switch>
    <Route path='/' component={BasePlatform} />
  </Switch>
)

// nested routes components
const BasePlatform = (props) => (
  <Base {...props}>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/tutorial' component={Tutorial} />
      <Route exact path='/products' render={ProductsListRoute} />
      <Route exact path='/products/:productId' component={SingleProductRoute} />
      <Route exact path='/preset-products/:presetName' render={PresetProductsRoute} />
      <Route exact path='/preset-products/:presetName/:productId' render={SinglePresetProductRoute} />
      <Route exact path='/favorites/:favoriteType' component={Favorites} />
      <Route exact path='/faq' component={Faq} />
      <Route component={NotFound} />
    </Switch>
  </Base>
)

const ProductsListRoute = router => (
  <ProductsPage key='products-page' match={router.match} initialExpandVisualFilter renderExtraItem={renderTopsInfoBanner} />
)

const PresetProductsRoute = router => {
  const { presetName } = router.match.params
  return (
    <ProductsPage
      key='preset-products-page'
      match={router.match}
      productBasePath={`/preset-products/${presetName}`}
      renderExtraItem={renderBreadcrumbs([
        { name: 'Editor\'s Pick', uri: '/' },
        { name: presetName }
      ])}
    />
  )
}

const SingleProductRoute = router => (
  <ProductPage
    match={router.match}
    renderExtraItem={renderBreadcrumbs([
      { name: 'YesPlz', uri: '/' },
      { name: 'Product Detail' }
    ])}
  />
)

const SinglePresetProductRoute = router => {
  const { presetName } = router.match.params
  return (
    <ProductPage
      match={router.match}
      renderExtraItem={renderBreadcrumbs([
        { name: 'Editor\'s Pick', uri: '/' },
        { name: presetName, uri: `/preset-products/${presetName}` },
        { name: 'Detail' }
      ])}
    />
  )
}

/** helper functions */

/**
 * render info banner for tops page
 * @param {Object} containerContext
 * @returns react element
 */
const renderTopsInfoBanner = containerContext => (
  <TopsInfoBanner filters={containerContext.props.filters} onVisualFilterClick={containerContext.showVisualFilter} />
)

/**
 * render breadcrumbs items
 * @param {Object[]} list
 * @returns renderItem callback
 */
const renderBreadcrumbs = (list = []) => containerContext => {
  const breadcrumbsItems = list.map((item, index) => {
    // last item render without link
    if (index === list.length - 1) {
      return <div key={item.name} className='current'>{item.name}</div>
    }

    return <NavLink key={item.name} to={item.uri || '/'}>{item.name}</NavLink>
  })

  return (
    <BreadCrumbs style={styles.breadcrumbs} className='animated fadeInDown'>
      {breadcrumbsItems}
    </BreadCrumbs>
  )
}

export default createRoutes()

const styles = {
  breadcrumbs: {
    margin: '-10px 0 8px'
  }
}