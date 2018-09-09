/**
 * VisualFilter
 * contains functions to handle visual filter svg interactions
 */
// Import Snap from window. Snap is loaded from template.
import pick from 'lodash-es/pick'
import isNil from 'lodash-es/isNil'
import isEmpty from 'lodash-es/isEmpty'
import isEqual from 'lodash-es/isEqual'
import throttle from 'lodash-es/throttle'
import Hammer from 'hammerjs'
import {
  PROP_CONST,
  PROP_ORDERS,
  THUMBNAIL_IMG_X_OFFSET,
  VERT_THUMBNAIL_X_OFFSET,
  VERT_THUMBNAIL_Y_OFFSET,
  HORZ_THUMBNAIL_Y_OFFSET,
  THUMBNAIL_HIGHLITER_SIZE,
  THUMBNAIL_TOUCH_AREA_SIZE,
  LAST_BODY_PART,
  ENABLE_BODYPART_ALL_BTN
} from 'config/constants'

import vfBundleSvg from 'assets/svg/vf_bundle.svg'
import vfBundleVertSvg from 'assets/svg/vf_bundle_thumb_vertical.svg'
import miniOnboardingSvg from 'assets/svg/mini_onboarding.svg'
import miniOnboardingVertSvg from 'assets/svg/mini_onboarding_thumb_vertical.svg'

const { Snap, localStorage } = window

export default class VisualFilter {
  selectedBodyPart = null
  currentPropState = {
    collar: '0',
    coretype: '0',
    neckline: '0',
    shoulder: '0',
    sleeve_length: '0',
    top_length: '0'
  }
  onboardingStage = 0
  colorPalletteOpened = 0
  svgLoaded = false
  lastHighlightId = null
  lastBodyPart = 'shoulder'
  swipeView = false

  constructor (selector = '#svg', options = {}) {
    this.settings = {
      ...defaultOptions,
      ...options
    }
    this.snap = Snap(selector)

    if (options.defaultState) {
      this.currentPropState = this.getbodyPartFilters(options.defaultState)
    }

    this.initialize() // initialize snap

    this.moveToPrevThumbnails = throttle(this.moveToPrevThumbnails.bind(this), 500, { leading: true, trailing: false })
    this.moveToNextThumbnails = throttle(this.moveToNextThumbnails.bind(this), 500, { leading: true, trailing: false })
  }

  setLastBodyPart (lastBodyPart) {
    if (!isEmpty(lastBodyPart) && this.lastBodyPart !== lastBodyPart) {
      this.lastBodyPart = lastBodyPart
    }
  }

  getbodyPartFilters (filters) {
    return pick(filters, [ 'collar', 'coretype', 'neckline', 'shoulder', 'sleeve_length', 'top_length' ])
  }

  initialize () {
    const { hideOnboarding, onSVGLoaded, hideThumbnail, useVerticalThumb, swipeable, disableEvent } = this.settings

    this.viewBox = [0, 0, 490, 400]
    let svgSource = ''
    let svgOnboardingSource = ''
    if (useVerticalThumb) {
      this.viewBox = [0, 0, 480, 380]
      svgSource = vfBundleVertSvg
      svgOnboardingSource = miniOnboardingVertSvg
    } else {
      svgSource = vfBundleSvg
      svgOnboardingSource = miniOnboardingSvg
    }

    if (hideThumbnail) {
      this.viewBox = [0, 0, 480, 320]
    }

    this.snap.attr({ viewBox: this.viewBox })

    Snap.load(svgSource, (frag) => {
      this.svgLoaded = true
      this.snapGroup = this.snap.group()
      this.snapGroup.append(frag)
      // Hide all object and show what we want only later
      this.snapGroup.attr({ visibility: 'hidden' })

      this.showGroup('full-body')

      if (!ENABLE_BODYPART_ALL_BTN) {
        // Hide 'ALL' button
        this.snapGroup.selectAll('#ALL').items.forEach((el, index) => {
          el.attr({ visibility: 'hidden' })
        })
      }

      for (let prop in this.currentPropState) {
        this.showGroup(this.getBodyPartGroupName(prop, this.currentPropState[prop]))
      }

      // onboarding
      if (!hideOnboarding && VisualFilter.shouldShowOnboarding()) {
        Snap.load(svgOnboardingSource, (frag) => {
          this.showOnboarding(frag)
        })
      } else {
        this.initializeClickHitMap()
      }

      // on vertical thumb and event is enabled, show arrow and enable swipe if activated
      if (useVerticalThumb && !disableEvent) {
        this.initializeArrowNavigation()
        // arrow_back
        // arrow_forward
        // activate swipeable thumbnails
        if (swipeable) {
          this.initializeSwipableThumbnail()
        }
      }

      // callback
      onSVGLoaded()
    })
  }

  initializeClickHitMap () {
    const self = this
    let group = null
    let thumbTouchSize = { width: 68, height: 68 }
    if (this.settings.useVerticalThumb) {
      thumbTouchSize = { width: 62, height: 62 }
    }
    // This will be touch hit-area
    for (var prop in this.currentPropState) {
      group = this.findGroupById(this.getBodyPartGroupName(prop, 'touch'))

      if (group === null) {
        console.debug('Touch area for', prop, 'not found')
        continue
      }

      // Just make it not-visible. We still need it for hit-map
      group.attr({ visibility: 'visible' })
      group.attr({ opacity: '0' })
      // group.attr({ opacity: '1' }) // Uncomment to visualize touch area

      if (!this.settings.disableEvent) {
        group.click(function () { self.handleBodyPartClick(this) }, prop)
      }
    }

    if (!this.settings.hideThumbnail) {
      for (let i = 0; i < 7; i++) {
        group = this.findGroupById('thumbnail_touch_' + i)
        group.attr(thumbTouchSize)
        group.attr({ visibility: 'visible' })
        group.attr({ opacity: '0' })
        group.click(function () { self.handleThumbnailClick(this) }, i.toString())
      }
    }
  }

  initializeArrowNavigation () {
    // set arrow navigation visibility and position
    const arrowBack = this.findGroupById('arrow_back')
    const arrowForward = this.findGroupById('arrow_forward')
    const defaultAttr = { fill: '#4A4A4A', stroke: '#979797' }
    const focusAttr = { fill: '#6200EE', stroke: 'rgba(98, 0, 238, 0.4)' }

    this.showGroup('arrow_back')
    this.showGroup('arrow_forward')
    arrowBack.attr({ transform: 'translate(440,0) rotate(90)' })
    arrowForward.attr({ transform: 'translate(415,365) rotate(270)' })

    // initialize navigation tap events
    arrowBack.click(() => {
      // on focus, change arrow color
      arrowForward.select('#Sharp').attr(defaultAttr)
      arrowBack.select('#Sharp').attr(focusAttr)
      // move thumbnails
      this.moveToPrevThumbnails()
    })
    arrowForward.click(() => {
      // on focus, change arrow color
      arrowBack.select('#Sharp').attr(defaultAttr)
      arrowForward.select('#Sharp').attr(focusAttr)
      // move thumbnails
      this.moveToNextThumbnails()
    })
  }

  initializeSwipableThumbnail () {
    // initialize hammerjs manager
    const hmThumb = new Hammer.Manager(this.snap.node, {
      recognizers: [
        [Hammer.Swipe, { direction: Hammer.DIRECTION_VERTICAL }]
      ],
      inputClass: Hammer.TouchMouseInput
    })

    // on swipeup, move to next thumbnail
    hmThumb.on('swipeup', () => {
      this.moveToNextThumbnails()
    })

    // on swipedown, move to prev thumbnail
    hmThumb.on('swipedown', () => {
      this.moveToPrevThumbnails()
    })
  }

  moveToPrevThumbnails () {
    const currentPropIndex = PROP_ORDERS.indexOf(this.selectedBodyPart)
    const nextPropIndex = currentPropIndex > 0 ? currentPropIndex - 1 : PROP_ORDERS.length - 1
    const nextProp = PROP_ORDERS[nextPropIndex]
    const nextThumb = this.currentPropState[nextProp]

    this.animateThumbnail(this.selectedBodyPart, nextProp, false, () => {
      this.handleAfterSwipeThumbnail(nextProp, nextThumb)
    })
  }

  moveToNextThumbnails () {
    const currentPropIndex = PROP_ORDERS.indexOf(this.selectedBodyPart)
    const nextPropIndex = currentPropIndex < PROP_ORDERS.length - 1 ? currentPropIndex + 1 : 0
    const nextProp = PROP_ORDERS[nextPropIndex]
    const nextThumb = this.currentPropState[nextProp]

    this.animateThumbnail(this.selectedBodyPart, nextProp, true, () => {
      this.handleAfterSwipeThumbnail(nextProp, nextThumb)
    })
  }

  handleAfterSwipeThumbnail (prop, sel) {
    // change visual filter after animation finished
    this.switchBodypartThumbnail(prop)
    this.showVerticalSelectionBox(prop, sel)
    this.changePropSelection(prop, sel)

    // show / hide highlight
    this.removeHighlight()
    this.highlightGroup(this.getBodyPartGroupName(prop, this.currentPropState[prop]))

    // set last body part when its changed
    this.lastBodyPart = prop
    this.settings.onPropChange(prop)
  }

  /**
   * animate thumbnail up / down
   * @param {string} prop
   * @param {string} nextProp
   * @param {boolean} movingUp // moving down = false
   * @param {function} onAnimationFinish callback
   * @param {number} animationDuration
   */
  animateThumbnail (prop, nextProp, movingUp = true, onAnimationFinish = () => {}, animationDuration = 300) {
    const currentThumb = this.findGroupById(this.getBodyPartGroupName(prop, 'thumbnails'))
    const nextThumbs = this.findGroupById(this.getBodyPartGroupName(nextProp, 'thumbnails'))
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

    const newPropState = this.getbodyPartFilters(filters)
    // only update when svg is loaded and has changes on filters
    if (!isEqual(this.currentPropState, newPropState)) {
      // body part visibility handler
      for (let prop in newPropState) {
        // hide previous bodypart
        this.hideGroup(this.getBodyPartGroupName(prop, this.currentPropState[prop]))
        // show next bodypart
        this.showGroup(this.getBodyPartGroupName(prop, newPropState[prop]))
      }
      // update current prop state after body part visibility handler done
      this.currentPropState = newPropState

      if (!this.settings.hideThumbnail) {
        this.updateThumbnailSelectionBox(this.lastBodyPart)
      }
    }
    if (newPropState['coretype'].toString() === '0') {
      this.hideGroup('length_0')
      this.hideGroup('length_1')
      this.hideGroup('length_2')
      this.hideGroup('length_all')
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
        this.changePropSelection('shoulder', 4)
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
    VisualFilter.saveConfig('onboarding_completed', 1)
  }

  switchBodypartThumbnail (prop) {
    if (!isNil(this.selectedBodyPart)) {
      this.hideGroup(this.getBodyPartGroupName(this.selectedBodyPart, 'thumbnails'))
    }
    this.selectedBodyPart = prop
    this.showGroup(this.getBodyPartGroupName(prop, 'thumbnails'))

    this.updateThumbnailSelectionBox(prop)
  }

  handleBodyPartClick (prop) {
    if (this.selectedBodyPart.valueOf() === prop.valueOf()) {
      this.cyclePropSelection(prop)
    }

    // set last body part when its changed
    this.lastBodyPart = prop
    this.settings.onPropChange(prop)

    if (!this.settings.hideThumbnail) {
      this.switchBodypartThumbnail(prop)
    }
  }

  updateThumbnailSelectionBox (prop) {
    const touchArea = this.findGroupById('Thumbnail_Touch_Area')
    // Display current one
    if (this.settings.useVerticalThumb) {
      // Move thumbnail hit area
      const xoffset = VERT_THUMBNAIL_X_OFFSET
      const yoffset = VERT_THUMBNAIL_Y_OFFSET
      // get target thumbnail
      const thumbnailGroup0 = this.findGroupById(this.getBodyPartGroupName(prop, 'thumbnails_0'))
      const thumbnailRect0 = thumbnailGroup0.node.getBoundingClientRect()

      // get scale value based on thumbnail size, add padding to get more volume.
      const scale = (thumbnailRect0.height * 1.38) / THUMBNAIL_TOUCH_AREA_SIZE.height

      let desc = `t${xoffset},${yoffset}s${scale},${thumbnailRect0.width},0`

      touchArea.selectAll('g > rect').items.forEach((el, index) => {
        let thumbnailGroup = this.findGroupById(this.getBodyPartGroupName(prop, `thumbnails_${index}`))

        // if thumbnail for current index is available, adjust touch area to its position
        // else hide the touch area
        if (thumbnailGroup) {
          el.attr({ visibility: 'visible', opacity: 0 }) // set opacity to none 0 for debugging.
        } else {
          el.attr({ visibility: 'hidden', opacity: 0 })
        }
      })

      touchArea.transform(desc)

      this.showVerticalSelectionBox(prop, this.currentPropState[prop])
    } else {
      // Move thumbnail hit area
      const xoffset = VisualFilter.getThumbnailXOffset(prop) + 15
      const yoffset = HORZ_THUMBNAIL_Y_OFFSET + 15
      let desc = 't' + xoffset + ',' + yoffset
      touchArea.transform(desc)

      this.showHorizontalSelectionBox(prop, this.currentPropState[prop])
    }

    this.removeHighlight()
    this.highlightGroup(this.getBodyPartGroupName(prop, this.currentPropState[prop]))
  }

  getMaxSelectionIndx (prop) {
    if (ENABLE_BODYPART_ALL_BTN) {
      return PROP_CONST[prop][1] + 1
    } else {
      return PROP_CONST[prop][1]
    }
  }

  getBodyPartGroupName (prop, state) {
    return PROP_CONST[prop][3] + '_' + state
  }

  /**
   * @todo: data mutation from argument should be removed
   */
  handleThumbnailClick (tnIdx) {
    if (tnIdx > this.getMaxSelectionIndx(this.selectedBodyPart)) {
      return
    }

    this.showSelectionBox(this.selectedBodyPart, tnIdx)
    this.changePropSelection(this.selectedBodyPart, tnIdx)
    this.removeHighlight()
    this.highlightGroup(this.getBodyPartGroupName(this.selectedBodyPart, this.currentPropState[this.selectedBodyPart]))
  }

  cyclePropSelection (prop) {
    if (this.currentPropState[prop] === 'all') {
      this.changePropSelection(prop, '0')
    } else {
      let next = parseInt(this.currentPropState[prop], 10) + 1
      if (next === PROP_CONST[this.selectedBodyPart][1] + 1) {
        if (ENABLE_BODYPART_ALL_BTN) {
          next = 'all'
        } else {
          next = 0
        }
      }
      this.changePropSelection(prop, next)
    }
  }

  changePropSelection (prop, sel, requestChange = true) {
    this.hideGroup(this.getBodyPartGroupName(prop, this.currentPropState[prop]))
    this.showGroup(this.getBodyPartGroupName(prop, sel))

    /**
     * Special handling for tank top
     * ---
     * When coretype is moving to 0, change top_length to 0 (save current top_length value)
     * When coretype is moving to 1 / 2 / 3 / all, restore saved top_length value
     * When top_length is moving to 1 / 2 / 3 / all and core type is is 0, change coretype to 1
     */
    if (prop === 'coretype') {
      if (sel === 0) { // coretype is moving to 0. Change top length to 0 also
        this.savedTopLength = this.currentPropState['top_length']
        this.hideGroup('length_' + this.currentPropState['top_length'])
        // change top length to 0
        this.currentPropState['top_length'] = 0
        // show 0 top length image
        this.showGroup('length_0')
      } else if (this.currentPropState['coretype'] === 0) { // coretype is moving away from 0. Restore top length
        this.hideGroup('length_0')
        this.hideGroup('length_1')
        this.hideGroup('length_2')
        this.hideGroup('length_all')
        if (isNil(this.savedTopLength)) {
          this.showGroup('length_0')
        } else {
          this.showGroup('length_' + this.savedTopLength)
          this.currentPropState['top_length'] = this.savedTopLength
          this.savedTopLength = null
        }
      }
    }
    if (prop === 'top_length' && this.currentPropState['coretype'] === 0) {
      this.hideGroup('top_core_0')
      this.showGroup('top_core_1')
      this.currentPropState['coretype'] = 1 // Avoid recursion
    }

    this.currentPropState[prop] = sel
    if (requestChange) {
      this.settings.onFilterChange(this.currentPropState)
    }
  }

  showHorizontalSelectionBox (prop, sel) {
    const group = this.findGroupById('Thumbnail-Highliter')
    if (sel === 'all') {
      sel = this.getMaxSelectionIndx(prop) // All is at the end
    }
    const x = sel * 68 + VisualFilter.getThumbnailXOffset(prop)
    const desc = 't' + x + ',' + HORZ_THUMBNAIL_Y_OFFSET
    group.transform(desc)
    this.showGroup('Thumbnail-Highliter')
  }

  showVerticalSelectionBox (prop, sel, animationDuration = null) {
    const thumbnailHighlighterGroup = this.findGroupById('Thumbnail-Highliter')
    let desc = ''

    if (sel === 'all') {
      desc = `t${(VERT_THUMBNAIL_X_OFFSET - 1)},0`
    } else {
      // for non "ALL" thumbnail, highliter size and position should be adjusted based on thumbnail
      let thumbnailGroup = this.findGroupById(this.getBodyPartGroupName(prop, `thumbnails_${sel}`))
      const thumbnail0Rect = this.findGroupById(this.getBodyPartGroupName(prop, 'thumbnails_0')).node.getBoundingClientRect()
      const thumbnailRect = thumbnailGroup.node.getBoundingClientRect()
      const viewBoxHeight = this.viewBox[3]
      const svgHeight = this.snap.node.getBoundingClientRect().height

      // Scale highlighter box depending on thumbnail size
      const scale = (thumbnailRect.height * 1.4) / THUMBNAIL_HIGHLITER_SIZE.height

      // get y value based on thumbnail position.
      // the y value should be compared between the original svg size (viewbox) and current svg size (after resize).
      const y = VERT_THUMBNAIL_Y_OFFSET + (thumbnailRect.top - thumbnail0Rect.top) * viewBoxHeight / svgHeight
      desc = `t${(VERT_THUMBNAIL_X_OFFSET - 3)},${y}s${scale},${thumbnailRect.width},0`
    }

    if (!isNil(animationDuration)) {
      thumbnailHighlighterGroup.stop().animate({ transform: desc }, animationDuration)
    } else {
      thumbnailHighlighterGroup.transform(desc)
    }
    this.showGroup('Thumbnail-Highliter')
  }

  showSelectionBox (prop, tnIdx) {
    if (this.settings.useVerticalThumb) {
      if (ENABLE_BODYPART_ALL_BTN) {
        // on vertical thumbnails view, all should be at first
        if (parseInt(tnIdx, 10) === 0) {
          tnIdx = 'all'
        } else {
          tnIdx = parseInt(tnIdx, 10) - 1
        }
      }
      this.showVerticalSelectionBox(this.selectedBodyPart, tnIdx)
    } else {
      // on horizontal thumbnails view, all should be at last
      if (ENABLE_BODYPART_ALL_BTN && (parseInt(tnIdx, 10) === PROP_CONST[this.selectedBodyPart][1] + 1)) {
        tnIdx = 'all'
      }
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
    return localStorage.getItem(LAST_BODY_PART)
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
   * @param {Object} snap
   * @param {string} id
   */
  highlightGroup (id) {
    id = id + '_HL'
    // Assume highlight objects are defined below body parts in svg file
    const group = this.findGroupById(id)
    group.attr({
      visibility: 'visible',
      opacity: '1',
      transform: 'scale(1)',
      'transform-origin': '50% 50%'})
    group.animate({
      opacity: '.8'
      // transform: 'scale(1.01)' // Somehow scaling up animation looks shaky.
    }, 100, null, () => { this.hideGroup(id) })
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

  static getThumbnailXOffset (prop) {
    var tnCnt
    if (ENABLE_BODYPART_ALL_BTN) {
      tnCnt = PROP_CONST[prop][1] + 2
    } else {
      tnCnt = PROP_CONST[prop][1] + 1
    }
    return THUMBNAIL_IMG_X_OFFSET[tnCnt]
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
}

const defaultOptions = {
  disableEvent: false,
  swipeable: false, // only supported for mobile
  defaultState: {},
  hideThumbnail: false,
  hideOnboarding: false,
  useVerticalThumb: false,
  onFilterChange: (filters) => { console.debug('filter change', filters) },
  onPropChange: (prop) => { console.debug('prop change', prop) },
  onSVGLoaded: () => {}
}
