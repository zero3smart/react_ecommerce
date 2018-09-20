/** helper functions */
import React from 'react'
import { NavLink } from 'react-router-dom'
import TopsInfoBanner from 'yesplz@modules/tops/TopsInfoBanner'
import { BreadCrumbs } from 'yesplz@ui-kits/misc'

/**
 * render info banner for tops page
 * @param {Object} containerContext
 * @returns react element
 */
export const renderTopsInfoBanner = containerContext => (
  <TopsInfoBanner filters={containerContext.props.filters} onVisualFilterClick={containerContext.showVisualFilter} />
)

/**
 * render breadcrumbs items
 * @param {Object[]} list
 * @param {Object} otherProps
 * @returns renderItem callback
 */
export const renderBreadcrumbs = (list = [], otherProps = {}) => containerContext => {
  const breadcrumbsItems = list.map((item, index) => {
    // last item render without link
    if (index === list.length - 1) {
      return <div key={item.name} className='current'>{item.name}</div>
    }

    return <NavLink key={item.name} to={item.uri || '/'}>{item.name}</NavLink>
  })

  return (
    <BreadCrumbs style={styles.breadcrumbs} className='animated fadeInDown' {...otherProps}>
      <div className='container'>
        {breadcrumbsItems}
      </div>
    </BreadCrumbs>
  )
}

const styles = {
  breadcrumbs: {
    margin: '-10px -5px 8px'
  }
}
