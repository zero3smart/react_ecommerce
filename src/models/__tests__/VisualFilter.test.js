import { expect } from 'chai'
import sinon from 'sinon'
import each from 'lodash-es/each'
import delay from 'utils/delay'
import VisualFilter from '../VisualFilter'

describe('VisualFilter Onboarding', () => {
  let vf = null
  const fakeFn = {
    showGroup: sinon.spy(),
    hideGroup: sinon.spy(),
    changePropSelection: sinon.spy(),
    updateThumbnailSelectionBox: sinon.spy(),
    handleBodyPartClick: sinon.spy(),
    handleOnboardingFinished: sinon.spy(),
    initializeClickHitMap: sinon.spy()
  }

  before(() => {
    sinon.stub(VisualFilter, 'constructor').callsFake(() => {})
    // will stub VisualFilter with all function from fakeFn
    each(fakeFn, (spy, name) => {
      sinon.stub(VisualFilter.prototype, name).callsFake(spy)
    })

    vf = new VisualFilter()
  })

  describe('on initialization', () => {
    it('should start from the beginning', () => {
      expect(vf.onboardingStage).to.equal(0)
    })
  })

  describe('on stage 1', () => {
    it('should show onboarding touch point', () => {
      vf.handleOnBoardingClick()
      expect(fakeFn.showGroup.calledWith('mini_onboarding_touch')).to.be.true
    })

    it('should show onboarding group 1', () => {
      expect(fakeFn.showGroup.calledWith('mini_onboarding_1')).to.be.true
    })

    it('should change selection to shoulder 4', () => {
      expect(fakeFn.changePropSelection.calledWith('shoulder', 4)).to.be.true
    })

    it('should show shoulder thumbnails', () => {
      expect(fakeFn.updateThumbnailSelectionBox.calledWith('shoulder')).to.be.true
    })

    it('should be able to move to next stage', () => {
      expect(vf.onboardingStage).to.equal(1)
    })
  })

  describe('on stage 2', () => {
    it('should hide onboarding group 1', () => {
      vf.handleOnBoardingClick()
      expect(fakeFn.hideGroup.calledWith('mini_onboarding_1')).to.be.true
    })

    it('should show onboarding group 2', () => {
      expect(fakeFn.showGroup.calledWith('mini_onboarding_2')).to.be.true
    })

    it('should click on the shoulder part', () => {
      expect(fakeFn.handleBodyPartClick.calledWith('shoulder')).to.be.true
    })
  })

  describe('on stage 3', () => {
    it('should hide onboarding group 2', () => {
      vf.handleOnBoardingClick()
      expect(fakeFn.hideGroup.calledWith('mini_onboarding_2')).to.be.true
    })

    it('should show onboarding group 3', () => {
      expect(fakeFn.showGroup.calledWith('mini_onboarding_3')).to.be.true
    })

    it('should click on the shoulder part', () => {
      expect(fakeFn.handleBodyPartClick.calledWith('shoulder')).to.be.true
    })

    describe('after 2 seconds', async () => {
      await delay(2000)

      it('should hide touch point', () => {
        expect(fakeFn.hideGroup.calledWith('mini_onboarding_touch')).to.be.true
      })

      it('should hide onboarding group 3', () => {
        expect(fakeFn.hideGroup.calledWith('mini_onboarding_3')).to.be.true
      })

      it('should close the onboarding', () => {
        expect(fakeFn.handleOnboardingFinished.calledOnce).to.be.true
      })

      it('should initialize visual filter event', () => {
        expect(fakeFn.initializeClickHitMap.calledOnce).to.be.true
      })
    })
  })
})
