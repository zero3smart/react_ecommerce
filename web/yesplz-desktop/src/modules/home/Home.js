import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import withTrackingProvider from '@yesplz/core-web/hoc/withTrackingProvider'
import { fetchRecommendedProducts } from '@yesplz/core-redux/ducks/products'
import { ProductList } from '@yesplz/core-web/modules/products'
import { Tutorial } from '@yesplz/core-web/modules/tutorials'
import { AdvancedPresetList } from '@yesplz/core-web/modules/presets'
import { SectionTitle } from '@yesplz/core-web/ui-kits/misc'
import LikeSvg from '@yesplz/core-web/assets/svg/like.svg'
import { TypeMenu } from 'modules/base'
import './home.css'

class Home extends Component {
  static propTypes = {
    recommendedProducts: PropTypes.array,
    onboarding: PropTypes.bool,
    fetchRecommendedProducts: PropTypes.func.isRequired
  }

  static defaultProps = {
    recommendedProducts: []
  }

  constructor (props) {
    super(props)
    this.state = {
      tutorialActive: true
    }
  }

  get handleTutorialFinish () {
    return () => {
      this.setState({
        tutorialActive: false
      })
    }
  }

  componentDidMount () {
    const { recommendedProducts, fetchRecommendedProducts } = this.props
    // make sure recommended fetch only run once
    if (recommendedProducts.length === 0) {
      fetchRecommendedProducts(12)
    }
  }

  componentWillUnmount () {
    const { fetchRecommendedProducts } = this.props
    // fetch recommended products on leave
    fetchRecommendedProducts(12)
  }

  render () {
    const { recommendedProducts, onboarding } = this.props
    // const { tutorialActive } = this.state
    const tutorialActive = false // disable tutorial until safari desktop issue is fixed

    return (
      <div id='MainScroll' className='Home' style={{ paddingBottom: 100 }}>
        <TypeMenu />
        {/* new arrival section */}
        <SectionTitle
          title='New Arrivals'
          subtitle={
            <React.Fragment>
              The more you
              <img src={LikeSvg} />
              the better it gets!
            </React.Fragment>
          }
        />
        <div className='container'>
          <ProductList
            products={recommendedProducts}
            className='Recommended-products'
            style={{ overflow: 'hidden' }}
            showOriginalPrice
            // showHighResImage
            show
            combined
          />
        </div>
        {/* editor's pick section */}
        <SectionTitle
          title={'Editor\'s Pick'}
          subtitle='Styles We Love'
          style={{ marginTop: 100, marginBottom: 80 }}
          titleStyle={{ color: '#6200EE' }}
        />
        <div className='container'>
          <AdvancedPresetList presetMatchesCount={3} useMinimalPreset />
        </div>
        {onboarding && tutorialActive && (
          <div className='Tutorial-wrapper'>
            <Tutorial onFinish={this.handleTutorialFinish} reverseIcon useVerticalThumb={Boolean(false)} />
          </div>
        )}
        {/* video section */}
        <SectionTitle
          title='We Shop Differently'
          subtitle='Watch Video'
          style={{ marginTop: 100 }}
          titleStyle={{ color: '#6200EE' }}
        />
        <div className='container'>
          <div className='Home-video' />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  recommendedProducts: state.products.recommendedList,
  onboarding: state.filters.onboarding
})

export default compose(
  connect(mapStateToProps, { fetchRecommendedProducts }),
  withTrackingProvider('Home')
)(Home)
