/**
 * VisualFilter
 * contains functions to handle visual filter svg interactions
 */
// Import Snap from window. Snap is loaded from template.
import isNil from 'lodash-es/isNil'
import isEmpty from 'lodash-es/isEmpty'
import isEqual from 'lodash-es/isEqual'
import throttle from 'lodash-es/throttle'
import Hammer from 'hammerjs'
import {
  LAST_BODY_PART,
  FILTERS,
  PRD_CATEGORY
} from 'config/constants'

import { Tracker } from 'models'
import { getCatData } from './VFCatViewData'

const { Snap, localStorage } = window

export default class VisualFilter {
  selectedBodyPart = null
  onboardingStage = 0
  colorPalletteOpened = 0
  svgLoaded = false
  lastHighlightId = null
  lastBodyPart = 'shoulder'
  swipeView = false
  catdata = null

  constructor (selector = '#svg', options = {}) {
    this.settings = {
      ...defaultOptions,
      ...options
    }
    this.catdata = getCatData(this.settings.category, this.settings.useVerticalThumb)

    if (!Snap) { // Skip init to avoid error on test env.
      return false
    }

    this.snap = Snap(selector)

    if (options.defaultState) {
      this.catdata.setDefaultState(options.defaultState)
    }

    this.initialize()

    this.moveToPrevThumbnails = throttle(this.moveToPrevThumbnails, 500, { leading: true, trailing: false })
    this.moveToNextThumbnails = throttle(this.moveToNextThumbnails, 500, { leading: true, trailing: false })
  }

  trackBodypart (event, prop) {
    Tracker.track(event, {'category': this.settings.category, 'bodypart': prop})
  }

  track (event) {
    Tracker.track(event, {'category': this.settings.category})
  }

  setLastBodyPart (lastBodyPart) {
    if (!isEmpty(lastBodyPart) && this.lastBodyPart !== lastBodyPart) {
      this.lastBodyPart = lastBodyPart
    }
  }

  setPointerHovering () {
    for (let prop in this.catdata.currentPropState) {
      let hitArea = this.findGroupById(this.catdata.touchGroupName(prop))
      let vf = this
      hitArea.mouseover(function () {
        vf.highlightGroup(vf.getBodyPartGroupName(prop, vf.catdata.getMaxSelectionIndx(prop)), false, '.5')
      })
      hitArea.mouseout(function () {
        vf.removeHighlight()
      })
    }
  }

  arrangeThumbnails () {
    for (var i in this.catdata.catcfg.partList) {
      const prop = this.catdata.catcfg.partList[i]
      for (var j = 0; j < this.catdata.propCount(prop); j++) {
        const tn = this.findGroupById(this.catdata.thumbnailGroupName(prop, j))
        const offsets = this.catdata.tnOffset(prop, j)
        var transform = `translate(${offsets.x}, ${offsets.y})`
        tn.attr({ transform: transform })
      }
    }
  }

  initialize () {
    const { hideMiniOnboarding, onSVGLoaded, hideThumbnail, useVerticalThumb,
      swipeable, badgeMode } = this.settings

    this.viewBox = this.catdata.viewBox(hideThumbnail, useVerticalThumb)
    let svgSource = this.catdata.svg(useVerticalThumb)
    let svgOnboardingSource = this.catdata.miniOnboardingSvg(useVerticalThumb)

    this.snap.attr({ viewBox: this.viewBox })

    Snap.load(svgSource, (frag) => {
      this.svgLoaded = true
      this.snapGroup = this.snap.group()
      this.snapGroup.append(frag)
      // Hide all object and show what we want only later
      this.snapGroup.attr({ visibility: 'hidden' })

      this.showGroup(this.catdata.fullbodyGroupName())

      for (let prop in this.catdata.currentPropState) {
        this.showGroup(this.getBodyPartGroupNameSpecial(this.catdata.currentPropState, prop))
      }

      // onboarding
      if (!hideMiniOnboarding && VisualFilter.shouldShowOnboarding()) {
        if (svgOnboardingSource) {
          this.track('MiniOnboarding Start')

          Snap.load(svgOnboardingSource, (frag) => {
            this.showOnboarding(frag)
          })
        } else { // No mini onboarding resources yet. Skip it
          this.handleOnboardingFinished()
          this.initializeClickHitMap()
        }
      } else {
        this.initializeClickHitMap()
      }

      // on vertical thumb and event is enabled, show arrow and enable swipe if activated
      if (!badgeMode) {
        this.track('VF Opened')

        this.initializeArrowNavigation()
        if (swipeable) {
          this.initializeSwipableThumbnail()
        }
        this.arrangeThumbnails(useVerticalThumb)

        if (this.catdata.propList().indexOf(this.lastBodyPart) < 0) {
          console.log('Unrecognized last bodypart', this.lastBodyPart, 'switching to default')
          this.lastBodyPart = this.catdata.propList()[0]
        }
        this.switchBodypartThumbnail(this.lastBodyPart)
      }

      if (!useVerticalThumb && !badgeMode) {
        this.setPointerHovering()
      }

      // callback
      onSVGLoaded()
    })
  }

  initializeClickHitMap () {
    const self = this
    let group = null
    let thumbTouchSize = this.catdata.thumbTouchSize()
    // This will be touch hit-area
    for (var i in this.catdata.propList()) {
      const prop = this.catdata.propList()[i]
      group = this.findGroupById(this.catdata.touchGroupName(prop))

      if (group === null) {
        console.log('Touch area for', prop, 'not found')
        continue
      }

      // Just make it not-visible. We still need it for hit-map
      group.attr({ visibility: 'visible' })
      group.attr({ opacity: this.settings.debugTouchArea ? 0.5 : 0.0 })

      if (!this.settings.badgeMode) {
        group.click(function () { self.handleBodyPartClick(this) }, prop)
      }
    }
    if (!this.settings.hideThumbnail) {
      for (let i = 0; i < 7; i++) {
        group = this.findGroupById(this.catdata.thumbnailTouchGroupName(i))
        group.attr(thumbTouchSize)
        group.attr({ visibility: 'visible' })
        group.attr({ opacity: this.settings.debugTouchArea ? 0.2 : 0.0 })
        group.click(function () { self.handleThumbnailClick(this) }, i.toString())
      }
    }
  }

  transformAttr (x, y, rotate) {
    let t = `translate(${x},${y})`
    if (rotate) {
      t += ` rotate(${rotate})`
    }
    return { transform: t }
  }

  initializeArrowNavigation () {
    const { useVerticalThumb } = this.settings

    // set arrow navigation visibility and position
    const arrowBack = this.findGroupById('arrow_back')
    const arrowForward = this.findGroupById('arrow_forward')

    this.showGroup('arrow_back')
    this.showGroup('arrow_forward')
    const backOffset = this.catdata.arrowBackOffset()
    const forwardOffset = this.catdata.arrowFowardOffset()
    let rotate = useVerticalThumb ? 90 : 0
    arrowBack.attr(this.transformAttr(backOffset.x, backOffset.y, rotate))
    arrowForward.attr(this.transformAttr(forwardOffset.x, forwardOffset.y, rotate))

    // initialize navigation tap events
    arrowBack.click(() => {
      // move thumbnails
      this.moveToPrevThumbnails()
    })
    arrowForward.click(() => {
      // move thumbnails
      this.moveToNextThumbnails()
    })
  }

  initializeSwipableThumbnail () {
    const { useVerticalThumb } = this.settings
    // initialize hammerjs manager
    const hmThumb = new Hammer.Manager(this.snap.node, {
      recognizers: [
        [Hammer.Swipe, { direction: Hammer.DIRECTION_VERTICAL }]
      ],
      inputClass: Hammer.TouchMouseInput
    })

    if (useVerticalThumb) {
      // on swipeup, move to next thumbnail
      hmThumb.on('swipeup', () => {
        this.track('VF Thumbnail SwipeUp')
        this.moveToNextThumbnails()
      })

      // on swipedown, move to prev thumbnail
      hmThumb.on('swipedown', () => {
        this.track('VF Thumbnail SwipeDown')
        this.moveToPrevThumbnails()
      })
    }
  }

  moveToPrevThumbnails () {
    const { useVerticalThumb } = this.settings
    const nextProp = this.catdata.prevProp(this.selectedBodyPart)
    const nextThumb = this.catdata.currentPropState[nextProp]

    if (useVerticalThumb) {
      // Animation is disabled for now..
      // this.animateVerticalThumbnail(this.selectedBodyPart, nextProp, false, () => {
      this.handleAfterSwipeThumbnail(nextProp, nextThumb)
      // })
    } else {
      // this.animateHorizontalThumbnail(this.selectedBodyPart, nextProp, false, () => {
      this.handleAfterSwipeThumbnail(nextProp, nextThumb)
      // })
    }
  }

  moveToNextThumbnails () {
    const { useVerticalThumb } = this.settings
    const nextProp = this.catdata.prevProp(this.selectedBodyPart)
    const nextThumb = this.catdata.currentPropState[nextProp]

    if (useVerticalThumb) {
      // this.animateVerticalThumbnail(this.selectedBodyPart, nextProp, true, () => {
      this.handleAfterSwipeThumbnail(nextProp, nextThumb)
      // })
    } else {
      // this.animateHorizontalThumbnail(this.selectedBodyPart, nextProp, true, () => {
      this.handleAfterSwipeThumbnail(nextProp, nextThumb)
      // })
    }
  }

  handleAfterSwipeThumbnail (prop, sel) {
    const { useVerticalThumb } = this.settings
    // change visual filter after animation finished
    this.switchBodypartThumbnail(prop)

    if (useVerticalThumb) {
      this.showVerticalSelectionBox(prop, sel)
    } else {
      this.showHorizontalSelectionBox(prop, sel)
    }

    this.changePropSelection(prop, sel)

    // show / hide highlight
    this.removeHighlight()
    this.highlightGroup(this.getBodyPartGroupName(prop, this.catdata.currentPropState[prop]))

    // set last body part when its changed
    this.lastBodyPart = prop
    this.settings.onPropChange(prop)
  }

  /**
   * animate thumbnail left / right
   * @param {string} prop
   * @param {string} nextProp
   * @param {boolean} movingLeft // moving right = false
   * @param {function} onAnimationFinish callback
   * @param {number} animationDuration
   */
  animateHorizontalThumbnail (prop, nextProp, movingLeft = true, onAnimationFinish = () => {}, animationDuration = 300) {
    const currentThumb = this.findGroupById(this.catdata.thumbnailGroupName(prop))
    const nextThumbs = this.findGroupById(this.catdata.thumbnailGroupName(nextProp))
    const currentThumbBBox = currentThumb.getBBox()
    const nextThumbBBox = nextThumbs.getBBox()
    const currentThumbInitialX = currentThumbBBox.x
    const nextThumbInitialX = nextThumbBBox.x

    if (movingLeft) {
      // move current thumbs from thumbnails position to top
      currentThumb.animate({ transform: `translate(${currentThumbBBox.x - currentThumbBBox.width}, 330) scale(1)` }, animationDuration, () => {
        currentThumb.attr({ visibility: 'hidden', transform: `translate(${currentThumbInitialX}, 330) scale(1)` })
      })

      // move next thumbs from bottom to thumbnails position
      nextThumbs.attr({ visibility: 'visible', transform: `translate(${nextThumbBBox.x + currentThumbBBox.width}, 330) scale(1)` })
      nextThumbs.animate({ transform: `translate(${nextThumbInitialX}, 330) scale(1)` }, animationDuration, () => {
        onAnimationFinish()
      })
    } else {
      // move current thumbs from thumbnails position to bottom
      currentThumb.animate({ transform: `translate(${currentThumbBBox.x + nextThumbBBox.width}, 330) scale(1)` }, animationDuration, () => {
        currentThumb.attr({ visibility: 'hidden', transform: `translate(${currentThumbInitialX}, 330) scale(1)` })
      })

      // move next thumbs from top to thumbnails position and fadeIn
      nextThumbs.attr({ visibility: 'visible', transform: `translate(${nextThumbInitialX - nextThumbBBox.width}, 330) scale(1)` })
      nextThumbs.animate({ transform: `translate(${nextThumbInitialX}, 330) scale(1)` }, animationDuration, () => {
        onAnimationFinish()
      })
    }
  }

  /**
   * animate thumbnail up / down
   * @param {string} prop
   * @param {string} nextProp
   * @param {boolean} movingUp // moving down = false
   * @param {function} onAnimationFinish callback
   * @param {number} animationDuration
   */
  animateVerticalThumbnail (prop, nextProp, movingUp = true, onAnimationFinish = () => {}, animationDuration = 300) {
    const currentThumb = this.findGroupById(this.catdata.thumbnailGroupName(prop))
    const nextThumbs = this.findGroupById(this.catdata.thumbnailGroupName(nextProp))
    const currentThumbBBox = currentThumb.getBBox()
    const nextThumbBBox = nextThumbs.getBBox()
    const currentThumbInitialY = currentThumbBBox.y
    const nextThumbInitialY = nextThumbBBox.y

    if (movingUp) {
      // move current thumbs from thumbnails position to top
      currentThumb.animate({ transform: `translate(400,${currentThumbBBox.y - currentThumbBBox.height}) scale(1.4)` }, animationDuration, () => {
        currentThumb.attr({ visibility: 'hidden', transform: `translate(400,${currentThumbInitialY}) scale(1.4)` })
      })

      // move next thumbs from bottom to thumbnails position
      nextThumbs.attr({ visibility: 'visible', transform: `translate(400,${nextThumbBBox.y + currentThumbBBox.height}) scale(1.4)` })
      nextThumbs.animate({ transform: `translate(400,${nextThumbInitialY}) scale(1.4)` }, animationDuration, () => {
        onAnimationFinish()
      })
    } else {
      // move current thumbs from thumbnails position to bottom
      currentThumb.animate({ transform: `translate(400,${currentThumbBBox.y + nextThumbBBox.height}) scale(1.4)` }, animationDuration, () => {
        currentThumb.attr({ visibility: 'hidden', transform: `translate(400,${currentThumbInitialY}) scale(1.4)` })
      })

      // move next thumbs from top to thumbnails position and fadeIn
      nextThumbs.attr({ visibility: 'visible', transform: `translate(400,${nextThumbInitialY - nextThumbBBox.height}) scale(1.4)` })
      nextThumbs.animate({ transform: `translate(400,${nextThumbInitialY}) scale(1.4)` }, animationDuration, () => {
        onAnimationFinish()
      })
    }
  }

  updateState (filters) {
    if (!this.svgLoaded) {
      return
    }

    if (!this.settings.hideThumbnail && isNil(this.selectedBodyPart)) { // Initial update
      this.switchBodypartThumbnail(this.lastBodyPart)
    }

    const newPropState = this.catdata.sanitizeFilters(filters)
    // only update when svg is loaded and has changes on filters
    if (!isEqual(this.catdata.currentPropState, newPropState)) {
      // body part visibility handler
      for (let prop in newPropState) {
        // hide previous bodypart
        this.hideGroup(this.getBodyPartGroupNameSpecial(this.catdata.currentPropState, prop))
        // show next bodypart
        this.showGroup(this.getBodyPartGroupNameSpecial(newPropState, prop))
      }
      // update current prop state after body part visibility handler done
      this.catdata.currentPropState = newPropState

      if (!this.settings.hideThumbnail) {
        this.updateThumbnailSelectionBox(this.lastBodyPart)
      }
    }
  }

  showOnboarding (frag) {
    this.snapGroup = this.snap.group()
    this.snapGroup.append(frag)
    this.snapGroup.attr({ visibility: 'hidden' })
    if (this.settings.useVerticalThumb) {
      this.snapGroup.select('svg').attr({ viewBox: [-10, 0, 439, 393] })
    }

    const group = this.findGroupById('mini_onboarding_touch')
    group.click(() => {
      this.handleOnBoardingClick()
    }, this.snap)
    this.handleOnBoardingClick()
  }

  handleOnBoardingClick () {
    switch (this.onboardingStage) {
      case 0:
        this.showGroup('mini_onboarding_touch')
        this.showGroup('mini_onboarding_1')
        this.changePropSelection('shoulder', 3)
        this.updateThumbnailSelectionBox('shoulder')
        break
      case 1:
        this.hideGroup('mini_onboarding_1')
        this.showGroup('mini_onboarding_2')
        this.handleBodyPartClick('shoulder')
        break
      case 2:
        this.hideGroup('mini_onboarding_2')
        this.showGroup('mini_onboarding_3')
        this.handleBodyPartClick('shoulder')

        var vf = this
        setTimeout(function () { // Close message after 2 seconds
          if (vf.onboardingStage === 3) {
            vf.handleOnBoardingClick()
          }
        }, 2000)
        break
      case 3:
      default:
        this.hideGroup('mini_onboarding_touch')
        this.hideGroup('mini_onboarding_3')
        this.handleOnboardingFinished()
        this.initializeClickHitMap() // Delay late to avoid Conflict with onboarding hitmap
        break
    }
    this.onboardingStage += 1
  }

  handleOnboardingFinished () {
    const { onFinishedOnboarding } = this.settings
    if (onFinishedOnboarding) {
      onFinishedOnboarding()
    }
    VisualFilter.saveConfig('onboarding_completed', 1)
    this.track('MiniOnboarding Completed')
  }

  switchBodypartThumbnail (prop) {
    if (!isNil(this.selectedBodyPart)) {
      this.hideGroup(this.catdata.thumbnailGroupName(this.selectedBodyPart))
    }
    this.selectedBodyPart = prop
    this.showGroup(this.catdata.thumbnailGroupName(prop))

    this.updateThumbnailSelectionBox(prop)
    for (let i = 0; i < 7; i++) {
      const group = this.catdata.thumbnailTouchGroupName(i)
      if (i < this.catdata.propCount(prop)) {
        const {x, y} = this.catdata.tnOffset(prop, i)
        const g = this.findGroupById(group)
        g.transform(`t${x - 10},${y - 30}`) // not sure where this offset coming from.
        this.showGroup(group)
      } else {
        this.hideGroup(group)
      }
    }
  }

  handleBodyPartClick (prop) {
    if (this.settings.useVerticalThumb) {
      if (this.selectedBodyPart.valueOf() === prop.valueOf()) {
        // In mobile, cycle settings when same item is touched again.
        this.cyclePropSelection(prop)
      }
    } else { // desktop. We have hovering hint, so just change to next selection on first click
      this.cyclePropSelection(prop)
    }

    this.trackBodypart('VF Touch BodyPart', prop)

    // set last body part when its changed
    this.lastBodyPart = prop
    this.settings.onPropChange(prop)

    if (!this.settings.hideThumbnail) {
      this.switchBodypartThumbnail(prop)
    }
  }

  updateThumbnailSelectionBox (prop) {
    const touchArea = this.findGroupById(this.catdata.thumbnailTouchGroupName())
    const {x, y} = this.catdata.tnAreaOffset()
    // Display current one
    if (this.settings.useVerticalThumb) {
      // get target thumbnail
      const thumbnailGroup0 = this.findGroupById(this.catdata.thumbnailGroupName(prop, 0))
      const thumbnailRect0 = thumbnailGroup0.node.getBoundingClientRect()

      // get scale value based on thumbnail size, add padding to get more volume.
      const scale = (thumbnailRect0.height * 1.38) / this.catdata.thumbnailTouchSize.height

      const viewBoxHeight = this.viewBox[3]
      const svgHeight = this.snap.node.getBoundingClientRect().height

      let desc = `t${x},${y}s${scale},${thumbnailRect0.width},0`

      touchArea.selectAll('g > rect').items.forEach((el, index) => {
        let thumbnailGroup = this.findGroupById(this.catdata.thumbnailGroupName(prop, index))
        // if thumbnail for current index is available, adjust touch area to its position
        // else hide the touch area
        if (thumbnailGroup) {
          const thumbnailRect = thumbnailGroup.node.getBoundingClientRect()
          // starting y should be set to thumbnails_0 top offset, since it will be the first item
          const startTop = thumbnailRect0.top
          // count y value of the thumbnail touch area to match the thumbnail y position
          const y = (thumbnailRect.top - startTop) / scale * viewBoxHeight / svgHeight

          let opacity = this.settings.debugTouchArea ? 0.5 : 0.0
          el.attr({ visibility: 'visible', opacity: opacity, y })
        } else {
          el.attr({ visibility: 'hidden', opacity: 0 })
        }
      })

      touchArea.transform(desc)

      this.showVerticalSelectionBox(prop, this.catdata.currentPropState[prop])
    } else {
      // Move thumbnail hit area
      let desc = 't' + x + ',' + y
      touchArea.transform(desc)

      this.showHorizontalSelectionBox(prop, this.catdata.currentPropState[prop])
    }

    this.removeHighlight()
    this.highlightGroup(this.getBodyPartGroupName(prop, this.catdata.currentPropState[prop]))
  }

  getBodyPartGroupName (prop, state) {
    return prop + '_' + state
  }

  handleThumbnailClick (tnIdx) {
    if (tnIdx > this.catdata.getMaxSelectionIndx(this.selectedBodyPart)) {
      return
    }
    this.trackBodypart('VF Thumbnail Touch', this.selectedBodyPart)

    this.showSelectionBox(this.selectedBodyPart, tnIdx)
    this.changePropSelection(this.selectedBodyPart, tnIdx)
    this.removeHighlight()
    this.highlightGroup(this.getBodyPartGroupName(this.selectedBodyPart, this.catdata.currentPropState[this.selectedBodyPart]))
  }

  cyclePropSelection (prop) {
    let next = parseInt(this.catdata.currentPropState[prop], 10) + 1
    if (next === this.catdata.propCount(prop)) {
      next = 0
    }
    this.changePropSelection(prop, next)
  }

  // TODO: Move to CatViewData
  getBodyPartGroupNameSpecial (propState, prop) {
    if (prop === 'shoulder') {
      // Special cases for shoulders:
      // Shouder 1 / neckline 3,4 : shows 'shoulder_1_for_neck_34' instead of 'shoulder_1'
      // Shouder 2 / neckline 3,4 : shows 'shoulder_2_for_neck_34' instead of 'shoulder_2'
      // Shoulder 3 / sleeves 0 : shows 'shoulder_3_for_sleeves_0' instead of 'shoulder_3'
      var shoulder = parseInt(propState['shoulder'], 10)
      if (shoulder === 3 && propState['sleeve_length'] === '0') {
        return 'shoulder_3_for_sleeves_0'
      }
      var neckline = parseInt(propState['neckline'], 10)
      if (neckline === 3 || neckline === 4) {
        if (shoulder === 1) {
          return 'shoulder_1_for_neckline_34'
        }
        if (shoulder === 2) {
          return 'shoulder_2_for_neckline_34'
        }
      }
    }
    // Default cases
    return this.getBodyPartGroupName(prop, propState[prop])
  }

  updatePropSelectionViewState (prevPropState, newPropState) {
    for (var prop in newPropState) {
      var hideGrp = this.getBodyPartGroupNameSpecial(prevPropState, prop)
      var showGrp = this.getBodyPartGroupNameSpecial(newPropState, prop)
      if (hideGrp !== showGrp) {
        // console.log(prop, 'from', hideGrp, 'to', showGrp)
        this.hideGroup(hideGrp)
        this.showGroup(showGrp)
      }
    }
  }

  changePropSelection (prop, sel, requestChange = true) {
    var prevPropState = Object.assign({}, this.catdata.currentPropState)
    /**
     * Special handling for tank top
     * ---
     * When coretype is moving to 0, change top_length to 0 (save current top_length value)
     * When coretype is moving to 1 / 2 / 3 / all, restore saved top_length value
     * When top_length is moving to 1 / 2 / 3 / all and core type is is 0, change coretype to 1
     */
    if (prop === 'coretype') {
      if (sel.toString() === '0') { // coretype is moving to 0. Change top length to 0 also
        this.savedTopLength = this.catdata.currentPropState['top_length']
        // change top length to 0
        this.catdata.currentPropState['top_length'] = '0'
      } else if (this.catdata.currentPropState['coretype'] === '0') { // coretype is moving away from 0. Restore top length
        if (this.savedTopLength) {
          this.catdata.currentPropState['top_length'] = this.savedTopLength
          this.savedTopLength = null
        }
      }
    }
    if (prop === 'top_length' && this.catdata.currentPropState['coretype'].toString() === '0') {
      this.catdata.currentPropState['coretype'] = '1'
    }
    this.catdata.currentPropState[prop] = sel
    this.updatePropSelectionViewState(prevPropState, this.catdata.currentPropState)
    if (requestChange) {
      this.settings.onFilterChange(this.catdata.currentPropState)
    }
  }

  showHorizontalSelectionBox (prop, sel) {
    const group = this.findGroupById(this.catdata.thumbnailHLGroupName())
    const {x, y} = this.catdata.tnOffset(prop, sel)
    const desc = 't' + x + ',' + y
    group.transform(desc)
    this.showGroup(this.catdata.thumbnailHLGroupName())
  }

  showVerticalSelectionBox (prop, sel, animationDuration = null) {
    const thumbnailHighlighterGroup = this.findGroupById('Thumbnail-Highliter')
    let desc = ''

    // for non "ALL" thumbnail, highliter size and position should be adjusted based on thumbnail
    let thumbnailGroup = this.findGroupById(this.catdata.thumbnailGroupName(prop, sel))
    const thumbnail0Rect = this.findGroupById(this.catdata.thumbnailGroupName(prop, 0)).node.getBoundingClientRect()
    const thumbnailRect = thumbnailGroup.node.getBoundingClientRect()
    const viewBoxHeight = this.viewBox[3]
    const svgHeight = this.snap.node.getBoundingClientRect().height

    // Scale highlighter box depending on thumbnail size
    const scale = (thumbnailRect.height * 1.4) / this.catdata.thumbnailHighlightSize.height

    // get y value based on thumbnail position.
    // the y value should be compared between the original svg size (viewbox) and current svg size (after resize).
    const y = this.catdata.tnAreaOffset().y + (thumbnailRect.top - thumbnail0Rect.top) * viewBoxHeight / svgHeight
    const x = this.catdata.tnAreaOffset().x - 3
    desc = `t${x},${y}s${scale},${thumbnailRect.width},0`

    if (!isNil(animationDuration)) {
      thumbnailHighlighterGroup.stop().animate({ transform: desc }, animationDuration)
    } else {
      thumbnailHighlighterGroup.transform(desc)
    }
    this.showGroup('Thumbnail-Highliter')
  }

  showSelectionBox (prop, tnIdx) {
    if (this.settings.useVerticalThumb) {
      this.showVerticalSelectionBox(this.selectedBodyPart, tnIdx)
    } else {
      this.showHorizontalSelectionBox(this.selectedBodyPart, parseInt(tnIdx, 10))
    }
  }
  /**
   * save last body part to localStorage
   * @param {string} prop
   */
  static saveLastBodyPart (prop) {
    localStorage.setItem(LAST_BODY_PART, prop)
  }

  /**
   * get last body part to localStorage
   * @returns {string} last body part (prop)
   */
  static getLastBodyPart () {
    let prop = localStorage.getItem(LAST_BODY_PART)
    if (prop === 'collar') { // collar is deprecated
      return 'neckline'
    } else {
      return prop
    }
  }

  /**
   * remove last body part from localStorage
   */
  static removeLastBodyPart () {
    localStorage.removeItem(LAST_BODY_PART)
  }

  /**
   * adjust container height based on thumbnails height
   * @param {string} id
   */
  adjustHeight (id) {
    const group = this.findGroupById(id)
    const componentHeight = group.node.getBBox().height + 150
    // set minimum height of 400
    const viewBox = [0, 0, 490, componentHeight < 380 ? 380 : componentHeight]
    this.snap.attr({ viewBox })
  }

  /**
   * Set svg group to visible
   * @param {string} id
   * @param {Object} extraProps
   */
  showGroup (id, extraProps = {}) {
    const group = this.findGroupById(id)
    group.attr({ visibility: 'visible', ...extraProps })
    return group
  }

  /**
   * Set svg group to invisible
   * @param {string} id
   * @param {Object} extraProps
   */
  hideGroup (id, extraProps) {
    const group = this.findGroupById(id)
    group.attr({ visibility: 'hidden', ...extraProps })
  }

  /**
   * Highlight svg group
   * @param {string} id
   */
  highlightGroup (id, fadeout = true, opacity = '1') {
    id = id + '_HL'
    // Assume highlight objects are defined below body parts in svg file
    const group = this.findGroupById(id)
    if (group === null) { // HL resource is not ready yet.
      console.log('Ignoring highlightGroup', id, group)
      return
    }
    // console.log('highlightGroup', id, group)
    group.attr({
      visibility: 'visible',
      opacity: opacity,
      transform: 'scale(1)',
      'transform-origin': '50% 50%'})
    if (fadeout) {
      group.animate({
        opacity: '.8'
        // transform: 'scale(1.01)' // Somehow scaling up animation looks shaky.
      }, 300, null, () => { this.hideGroup(id) })
    }
    this.lastHighlightId = id
  }

  removeHighlight () {
    if (!isNil(this.lastHighlightId)) {
      this.hideGroup(this.lastHighlightId)
      this.lastHighlightId = null
    }
  }

  /**
   * Find svg group based on specific id
   * @param {*} id
   * @return {Object} svg group
   */
  findGroupById (id) {
    const group = this.snap.select('#' + id)
    if (group === null) {
      console.debug('Missing group', id)
      return null
    }
    return group
  }

  /**
   * Check wheter onboarding screen needs to be loaded
   */
  static shouldShowOnboarding () {
    return !VisualFilter.loadConfig('onboarding_completed')
  }

  /**
   * Save config value from localstorage
   * @param {string} name
   * @param {string} val
   */
  static saveConfig (name, val) {
    try {
      localStorage.setItem(name, val)
    } catch (err) {
      console.debug('error saving config', err)
    }
  }

  /**
   * Load config value from localstorage
   * @param {string} name
   * @returns {(string|null)} config value
   */
  static loadConfig (name) {
    try {
      return localStorage.getItem(name)
    } catch (err) {
      console.debug('error loading config', err)
    }
    return null
  }

  /**
   * get current filters from local storage
   */
  static getFilters () {
    const filters = JSON.parse(localStorage.getItem(FILTERS))
    return filters || {}
  }
}

const defaultOptions = {
  category: PRD_CATEGORY, // Should be changeable runtime
  badgeMode: false, // Disable interaction and do not show thumbnails/bottom menus
  swipeable: false, // only supported for mobile
  defaultState: {},
  hideThumbnail: false,
  hideMiniOnboarding: false,
  useVerticalThumb: false,
  debugTouchArea: false,
  onFilterChange: (filters) => { console.debug('filter change', filters) },
  onPropChange: (prop) => { console.debug('prop change', prop) },
  onSVGLoaded: () => {},
  onFinishedOnboarding: () => {}
}
