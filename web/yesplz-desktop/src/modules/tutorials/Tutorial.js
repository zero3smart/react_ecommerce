import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Carousel from 'nuka-carousel'
import TutorialItem from './TutorialItem'
import { SlideImage, SliderDots } from '@yesplz/core-web/modules/sliders'

// image sources
import TutorialImage1 from './images/yesplz-tutorial-1.svg'
import TutorialImage2a from './images/yesplz-tutorial-2a.svg'
import TutorialImage2b from './images/yesplz-tutorial-2b.svg'
// import TutorialImage2c from './images/yesplz-tutorial-2c.svg'
import TutorialImage3a from './images/yesplz-tutorial-3a.svg'
import TutorialImage3b from './images/yesplz-tutorial-3b.svg'
import TutorialImage3c from './images/yesplz-tutorial-3c.svg'

import './Tutorial.scss'

class Tutorial extends PureComponent {
  static propTypes = {
    onFinish: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      currentSlide: 0,
      preventNext: false
    }
    this.handleSlideNext = this.handleSlideNext.bind(this)
    this.handleSlideTo = this.handleSlideTo.bind(this)
    this.disableNext = this.disableNext.bind(this)
    this.allowNext = this.allowNext.bind(this)
  }

  handleSlideNext () {
    const { currentSlide } = this.state
    this.setState({ currentSlide: currentSlide + 1 })
  }

  handleSlideTo (slideIndex) {
    this.setState({ currentSlide: slideIndex })
  }

  disableNext () {
    this.setState({
      preventNext: true
    })
  }

  allowNext () {
    this.setState({
      preventNext: false
    })
  }

  render () {
    const { onFinish } = this.props
    const { currentSlide, preventNext } = this.state

    const sliderDots = (
      <SliderDots
        currentSlide={currentSlide}
        slideCount={3}
        goToSlide={this.handleSlideTo}
        style={{ margin: '38px auto' }}
      />
    )

    return (
      <div className='Tutorial'>
        <div className='container'>
          <h3 className='title'>WELCOME TO YESPLZ!</h3>
          <Carousel
            slideIndex={currentSlide}
            renderCenterLeftControls={noop}
            renderCenterRightControls={noop}
            renderBottomCenterControls={noop}
          >
            <TutorialItem
              title=''
              subtitle='Hello! Meet your smart filter.'
              image={(
                <SlideImage
                  imageSources={[
                    TutorialImage1
                  ]}
                />
              )}
              content={(
                <React.Fragment>
                  {sliderDots}
                  <button className='TutorialItem-secondaryButton' onClick={this.handleSlideNext}>Next</button>
                  <a className='TutorialItem-primaryButton' onClick={onFinish}>Skip</a>
                </React.Fragment>
              )}
            />
            <TutorialItem
              title=''
              subtitle='Hello! Meet your smart filter.'
              image={currentSlide === 1 ? (
                <SlideImage
                  imageSources={[
                    TutorialImage2a,
                    TutorialImage2b
                  ]}
                  repeatedTimes={2}
                  beforeStart={this.disableNext}
                  onFinish={this.allowNext}
                />
              ) : null}
              content={(
                <React.Fragment>
                  {sliderDots}
                  <button
                    className='TutorialItem-secondaryButton'
                    // disabled={preventNext}
                    onClick={this.handleSlideNext}>
                    Next
                  </button>
                  <a className='TutorialItem-primaryButton' onClick={onFinish}>Skip</a>
                </React.Fragment>
              )}
            />
            <TutorialItem
              title=''
              subtitle='Tap any parts you want to customize. We find the items for you. Enjoy!'
              image={currentSlide === 2 ? (
                <SlideImage
                  imageSources={[
                    TutorialImage3a,
                    TutorialImage3b,
                    TutorialImage3c
                  ]}
                  repeatedTimes={2}
                  beforeStart={this.disableNext}
                  onFinish={this.allowNext}
                />
              ) : null}
              content={(
                <React.Fragment>
                  {sliderDots}
                  <button
                    className='TutorialItem-secondaryButton'
                    // disabled={preventNext}
                    onClick={onFinish}>
                    EXPLORE
                  </button>
                  <a className='TutorialItem-primaryButton' onClick={onFinish}>Skip</a>
                </React.Fragment>
              )}
            />
          </Carousel>
        </div>
      </div>
    )
  }
}

const noop = () => null

export default Tutorial
