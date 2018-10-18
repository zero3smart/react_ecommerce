import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
// import classNames from 'classnames'
import TutorialPage from './TutorialPage'
import { FloatButton, TutorialBodypartFilter } from 'modules/filters'
// import { ProductFilter } from 'modules/filters/ProductFilter'
import { Button } from 'ui-kits/buttons'
// import BackArrowSvg from 'assets/svg/back-arrow.svg'
// import BackArrowWhiteSvg from 'assets/svg/back-arrow-white.svg'
import ReplayArrowSvg from 'assets/svg/replay-arrow.svg'
import ReplayArrowWhiteSvg from 'assets/svg/replay-arrow-white.svg'

import { history } from 'config/store'
import { withTrackingProvider } from 'hoc'
import Tracker from 'models/Tracker'
import './tutorial.css'

const DELAY_BETWEEN_SCREEN = 1000

class Tutorial extends Component {
  static propTypes = {
    onboarding: PropTypes.bool.isRequired,
    reverseIcon: PropTypes.bool,
    useVerticalThumb: PropTypes.bool,
    onFinish: PropTypes.func
  }

  static defaultProps = {
    reverseIcon: false,
    useVerticalThumb: true
  }

  constructor (props) {
    super(props)
    this.state = {
      currentPage: 0,
      tutorialBegin: false,
      filterExpanded: false,
      zoomFilter: false
    }
  }

  get moveToPreviousPage () {
    // const { currentPage } = this.state
    return () => {
      this.setState({
        currentPage: 1 // Restart animation
        // currentPage: currentPage === 0 ? 0 : currentPage - 1
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

  get startTutorial () {
    return () => {
      this.setState({
        tutorialBegin: true
      })
      this.moveToNextPage()
      setTimeout(() => {
        this.expandFilter()
      }, DELAY_BETWEEN_SCREEN)
    }
  }

  get exitTutorial () {
    const { onFinish } = this.props
    return () => {
      if (this.state.currentPage === 0) {
        Tracker.track('Tutorial Skipped')
      } else {
        Tracker.track('Tutorial Completed')
      }
      if (onFinish) {
        onFinish()
      } else {
        history.push('/')
      }
    }
  }

  expandFilter () {
    this.setState({
      filterExpanded: true
    })

    // zoom filter after finished expanding
    setTimeout(() => {
      this.zoomFilter()
    }, DELAY_BETWEEN_SCREEN)
  }

  /**
   * zoom filter after finished expanding
   */
  zoomFilter () {
    const { zoomFilter, filterExpanded } = this.state
    if (zoomFilter || !filterExpanded) {
      return null
    }

    this.setState({ zoomFilter: true })
  }

  render () {
    const { onboarding, reverseIcon } = this.props
    // const { useVerticalThumb } = this.props
    const { currentPage, tutorialBegin } = this.state
    // const { filterExpanded, zoomFilter } = this.state

    if (!onboarding) {
      return null
    }

    const tutorialNavigation = tutorialBegin && (
      <div className='TutorialNavigation Skip' style={styles.secondaryButtonWrapper}>
        <Button onClick={this.moveToPreviousPage} className='ButtonSecondary'>
          <img src={reverseIcon ? ReplayArrowWhiteSvg : ReplayArrowSvg} alt=' ' />
        </Button>
        <Button onClick={this.exitTutorial} className='ButtonBordered'>Finish</Button>
      </div>
    )

    return (
      <div className='Tutorial'>
        <TutorialPage pageKey={0} activeKey={currentPage}>
          <h1 className='animated fadeInDown'>Hello</h1>
          <h2 className='animated fadeInDown' style={{ animationDelay: '200ms' }}>Meet smart visual filter</h2>
          <FloatButton id='vfTutorialButton' filters={defaultFilters} noShadow
            style={styles.filterButton} className='animated zoomIn' />
          <div className='TutorialNavigation'>
            <Button onClick={this.exitTutorial} className='ButtonSecondary'>No</Button>
            <Button onClick={this.startTutorial} className='ButtonPrimary'>Yes</Button>
          </div>
        </TutorialPage>
        {/* <TutorialPage pageKey={1} activeKey={currentPage} duration={3000} onFinish={this.moveToNextPage}>
          <h1 className='animated fadeInDown'>&nbsp;</h1>
          <h2 className='animated fadeInDown' style={{ marginTop: 25, height: 65 }}>Meet our new smart visual filter</h2>
          <div className={classNames('ProductFilterWrapper', { zoomFilter: zoomFilter })} style={styles.filterPanelMask}>
            <ProductFilter {...fakeProductFilterProps} expanded={filterExpanded} hideMiniOnboarding useVerticalThumb={useVerticalThumb} />
          </div>
          {tutorialNavigation}
        </TutorialPage> */}
        <TutorialPage pageKey={1} activeKey={currentPage} duration={3500} onFinish={this.moveToNextPage}>
          <h1>&nbsp;</h1>
          <h2>All body parts are selectable</h2>
          <TutorialBodypartFilter
            id='TutorialBodypartFilter-touchesPoints'
            filters={defaultFilters}
            showTouchesPoints
            lastBodyPart='coretype'
            style={styles.tutorialAnim}
          />
          {tutorialNavigation}
        </TutorialPage>
        <TutorialPage pageKey={2} activeKey={currentPage} duration={11000} onFinish={this.exitTutorial}>
          <h1>&nbsp;</h1>
          <h2>You can change its fits</h2>
          <TutorialBodypartFilter
            filters={defaultFilters}
            tutorialAnim
            lastBodyPart='coretype'
            style={styles.tutorialAnim}
          />
          {tutorialNavigation}
        </TutorialPage>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  onboarding: state.filters.onboarding
})

export default compose(connect(mapStateToProps), withTrackingProvider('Tutorial'))(Tutorial)

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

// const fakeProductFilterProps = {
//   filters: defaultFilters,
//   isFilterSaved: false,
//   lastBodyPart: null,
//   router: {
//     location: {
//       pathname: '/products'
//     }
//   },
//   expanded: false,
//   scrollBellowTheFold: true,
//   onboarding: false,
//   setFilter: () => {},
//   fetchProducts: () => {},
//   syncFilter: () => {},
//   syncFavoritePresets: () => {},
//   saveFilterAsPreset: () => {},
//   deleteFilterFromPreset: () => {},
//   setLastBodyPart: () => {},
//   toggleVisualFilter: () => {},
//   setOnboarding: () => {}
// }

const styles = {
  filterButton: {
    width: 290,
    height: 290,
    maxWidth: 'none',
    maxHeight: 'none',
    // position: 'static',
    position: 'relative',
    paddingTop: 30,
    marginTop: 50,
    marginBottom: 30,
    animationDelay: `${DELAY_BETWEEN_SCREEN}ms`,
    zIndex: -1
  },
  secondaryButtonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    height: 65
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
  filterPanelMask: {
    display: 'flex',
    position: 'fixed',
    justifyContent: 'center',
    top: 200,
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%'
  },
  tutorialAnim: {
    // width: 'calc(100% + 150px)',
    width: '100%',
    position: 'relative',
    marginLeft: -70,
    marginRight: -80,
    marginTop: 20
  }
}
