import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import './AdvancedFilterTabs.scss'

const AdvancedFilterTabs = ({ tabs, children }) => {
  const [ activeTab, setActiveTab ] = useState(tabs[0].key)

  const activeChild = React.Children.toArray(children).find(child => child.props.tabKey === activeTab)

  return (
    <div className='AdvancedFilterTabs'>
      <PerfectScrollbar option={{ handlers: scrollbarHandlers }}>
        <ul className='AdvancedFilterTabs-header'>
          {
            tabs.map(tab => (
              <li
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key)
                }}
                className={classNames({ 'is-active': tab.key === activeTab })}
              >
                {tab.label}
              </li>
            ))
          }
        </ul>
      </PerfectScrollbar>
      <div className='AdvancedFilterTabs-content'>
        <PerfectScrollbar option={{ handlers: scrollbarHandlers }}>
          {activeChild}
        </PerfectScrollbar>
      </div>
    </div>
  )
}

AdvancedFilterTabs.propTypes = {
  tabs: PropTypes.array,
  children: PropTypes.any
}

AdvancedFilterTabs.defaultProps = {
  tabs: []
}

// tab content
export const TabItem = ({ tabKey, children }) => (
  <div key={tabKey} className='AdvancedFilterTabs-item'>
    {children}
  </div>
)

TabItem.propTypes = {
  tabKey: PropTypes.string.isRequired,
  children: PropTypes.any
}

const scrollbarHandlers = ['click-rail', 'drag-thumb', 'keyboard', 'touch']

export default AdvancedFilterTabs