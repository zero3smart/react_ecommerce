import React from 'react'
import { withState } from 'recompose'
import PropTypes from 'prop-types'
import SidebarMenuItem from './SidebarMenuItem'

const enhanceState = withState('activeKey', 'changeActiveKey', 'all')

const TopsFilterMenu = ({ activeKey, changeActiveKey, onFilterChange }) => {
  const handleChange = category => {
    changeActiveKey(category)
    onFilterChange('tops', category)
  }

  return (
    <React.Fragment>
      <SidebarMenuItem
        eventKey='all'
        activeKey={activeKey}
        onClick={handleChange}
        className='is-primary'>
        All Tops
      </SidebarMenuItem>
      {/* category menu */}
      <SidebarMenuItem
        eventKey='tanks'
        activeKey={activeKey}
        onClick={handleChange}>
        Tanks
      </SidebarMenuItem>
      <SidebarMenuItem
        eventKey='t-shirts'
        activeKey={activeKey}
        onClick={handleChange}>
        T-Shirts
      </SidebarMenuItem>
      <SidebarMenuItem
        eventKey='blouses'
        activeKey={activeKey}
        onClick={handleChange}>
        Blouses
      </SidebarMenuItem>
      <SidebarMenuItem
        eventKey='tunics'
        activeKey={activeKey}
        onClick={handleChange}>
        Tunics
      </SidebarMenuItem>
      <SidebarMenuItem
        eventKey='max'
        activeKey={activeKey}
        onClick={handleChange}>
        Max
      </SidebarMenuItem>
    </React.Fragment>
  )
}

TopsFilterMenu.propTypes = {
  activeKey: PropTypes.string.isRequired,
  changeActiveKey: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func
}

TopsFilterMenu.defaultProps = {
  onFilterChange: (category, filterKey) => {}
}

export default enhanceState(TopsFilterMenu)
