import React from 'react'
import { Route, Switch } from 'react-router'
import { NavLink } from 'react-router-dom'
// pages
import { Base, NotFound } from 'modules/base'
import { Home } from 'modules/home'
import { ProductsPage } from 'modules/products'
import { TopSingle, TopsInfoBanner } from 'modules/tops'
import { Favorites } from 'modules/favorites'
import { Faq } from 'modules/faq'
import { Presets } from 'modules/presets'
// presentational
import { BreadCrumbs } from 'ui-kits/misc'

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
      <Route exact path='/products' render={ProductsList} />
      <Route exact path='/products/:productId' component={TopSingle} />
      <Route exact path='/presets' component={Presets} />
      <Route exact path='/preset-products/:presetName' render={PresetProductsRoute} />
      <Route exact path='/favorites/:favoriteType' component={Favorites} />
      <Route exact path='/faq' component={Faq} />
      <Route component={NotFound} />
    </Switch>
  </Base>
)

const ProductsList = router => (
  <ProductsPage initialExpandVisualFilter renderExtraItem={renderTopsInfoBanner} />
)

const PresetProductsRoute = router => (
  <ProductsPage
    renderExtraItem={renderBreadcrumbs([
      { name: 'Editor\'s Pick', uri: '/' },
      { name: router.match.params.presetName }
    ])} />
)

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
    margin: '-10px -5px 8px'
  }
}
