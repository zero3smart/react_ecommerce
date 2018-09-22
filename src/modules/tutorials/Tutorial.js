import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import TutorialPage from './TutorialPage'
import { FloatButton, TutorialBodypartFilter } from 'modules/filters'
import { ProductFilter } from 'modules/filters/ProductFilter'
import { Button } from 'ui-kits/buttons'
import { history } from 'config/store'
import './tutorial.css'

class Tutorial extends Component {
  static propTypes = {
    onboarding: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      currentPage: 0,
      filterExpanded: false,
      zoomFilter: false
    }
  }

  get moveToPreviousPage () {
    const { currentPage } = this.state
    return () => {
      this.setState({
        currentPage: currentPage === 0 ? 0 : currentPage - 1
      })
    }
  }

  get moveToNextPage () {
    return () => {
      this.setState({
        currentPage: this.state.currentPage + 1
      })
    }
  }

  get toggleFilterPanel () {
    return (isExpanded) => {
      this.setState({
        filterExpanded: isExpanded
      })

      // zoom filter after finished expanding
      setTimeout(() => {
        this.zoomFilter()
      }, 1000)
    }
  }

  get exitTutorial () {
    return () => {
      history.push('/')
    }
  }

  /**
   * zoom filter after finished expanding
   */
  get zoomFilter () {
    const { zoomFilter, filterExpanded } = this.state
    return () => {
      if (zoomFilter || !filterExpanded) {
        return null
      }

      this.setState({ zoomFilter: true })
    }
  }

  render () {
    const { onboarding } = this.props
    const { currentPage, filterExpanded, zoomFilter } = this.state

    if (!onboarding) {
      return null
    }

    return (
      <div className='Tutorial'>
        <TutorialPage pageKey={0} activeKey={currentPage}>
          <h1 className='animated fadeInDown'>Hello</h1>
          <h2 className='animated fadeInDown' style={{ animationDelay: '500ms' }}>Meet our new smart visual filter.</h2>
          <FloatButton id='vfTutorialButton' filters={defaultFilters} noShadow style={styles.filterButton} className='animated zoomIn delay-1s' />
          <div style={styles.buttonWrapper}>
            <Button onClick={this.moveToNextPage} style={styles.button} className='animated fadeInDown delay-1s'>YesPlz</Button>
            <Button onClick={this.exitTutorial} style={styles.button} className='animated fadeInDown delay-1s'>No</Button>
          </div>
        </TutorialPage>
        <TutorialPage pageKey={1} activeKey={currentPage} >
          <h2 className='animated fadeInDown' style={{ marginTop: 65 }}>Meet our new smart visual filter.</h2>
          <div className={classNames({ zoomFilter: zoomFilter })} style={styles.filterPanelMask}>
            <ProductFilter {...fakeProductFilterProps} expanded={filterExpanded} toggleVisualFilter={this.toggleFilterPanel} hideMiniOnboarding />
          </div>
          {
            filterExpanded && (
              <div style={{ ...styles.floatButtonWrapper, bottom: 20 }}>
                <Button onClick={this.moveToPreviousPage} style={styles.button} className='animated fadeInDown delay-2s'>Back</Button>
                <Button onClick={this.moveToNextPage} style={styles.button} className='animated fadeInDown delay-2s'>Continue</Button>
              </div>
            )
          }
        </TutorialPage>
        <TutorialPage pageKey={2} activeKey={currentPage}>
          <h2 style={{ marginTop: 65 }}>All body parts are selectable.</h2>
          <TutorialBodypartFilter
            id='TutorialBodypartFilter-touchesPoints'
            filters={defaultFilters}
            showTouchesPoints
            lastBodyPart='coretype'
            style={styles.tutorialAnim}
          />
          <div style={styles.floatButtonWrapper}>
            <Button onClick={this.moveToPreviousPage} style={styles.button} className='animated fadeInDown delay-1s'>Back</Button>
            <Button onClick={this.moveToNextPage} style={styles.button} className='animated fadeInDown delay-1s'>Continue</Button>
          </div>
        </TutorialPage>
        <TutorialPage pageKey={3} activeKey={currentPage}>
          <h2 style={{ marginTop: 65 }}>So you can change its fits and shape.</h2>
          <TutorialBodypartFilter
            filters={defaultFilters}
            tutorialAnim
            lastBodyPart='coretype'
            style={styles.tutorialAnim}
          />
          <div style={styles.floatButtonWrapper}>
            <Button onClick={this.moveToPreviousPage} style={styles.button} className='animated fadeInDown delay-1s'>Back</Button>
            <Button onClick={this.exitTutorial} style={styles.button} className='animated fadeInDown delay-1s'>Continue</Button>
          </div>
        </TutorialPage>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  onboarding: state.filters.onboarding
})

export default connect(mapStateToProps)(Tutorial)

const defaultFilters = {
  collar: 0,
  coretype: 2,
  details: 0,
  neckline: 1,
  pattern: 0,
  shoulder: 3,
  sleeve_length: 4,
  solid: 0,
  top_length: 2,
  favorite: false
}

const fakeProductFilterProps = {
  filters: defaultFilters,
  isFilterSaved: false,
  lastBodyPart: null,
  router: {
    location: {
      pathname: '/products'
    }
  },
  expanded: false,
  scrollBellowTheFold: true,
  onboarding: false,
  setFilter: () => {},
  fetchProducts: () => {},
  syncFilter: () => {},
  syncFavoritePresets: () => {},
  saveFilterAsPreset: () => {},
  deleteFilterFromPreset: () => {},
  setLastBodyPart: () => {},
  toggleVisualFilter: () => {},
  setOnboarding: () => {}
}

const styles = {
  filterButton: {
    width: 290,
    height: 290,
    maxWidth: 'none',
    maxHeight: 'none',
    position: 'static',
    paddingTop: 30,
    marginTop: 30,
    marginBottom: 30,
    animationDelay: '1000ms'
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center'
  },
  floatButtonWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '10%'
  },
  button: {
    fontSize: 24,
    color: '#000000',
    width: 118,
    background: 'white',
    border: 0,
    borderRadius: 0,
    margin: '0px 10px'
  },
  filterPanelMask: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 350
  },
  tutorialAnim: {
    width: 'calc(100% + 150px)',
    marginLeft: -70,
    marginRight: -80,
    marginTop: 20
  }
}
