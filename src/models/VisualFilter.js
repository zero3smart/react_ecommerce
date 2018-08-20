/**
 * VisualFilter
 * contains functions to handle visual filter svg interactions
 */
// Import Snap from window. Snap is loaded from template.
import pick from 'lodash-es/pick'
import isNil from 'lodash-es/isNil'
import isEqual from 'lodash-es/isEqual'
import { PROP_CONST, THUMBNAIL_IMG_X_OFFSET, THUMBNAIL_X_OFFSET, THUMBNAIL_Y_OFFSET } from 'config/constants'
const { Snap, localStorage } = window

export default class VisualFilter {
  currentThumbnail = null
  currentPropState = {
    collar: '0',
    coretype: '0',
    neckline: '0',
    shoulder: '0',
    sleeve_length: '0',
    top_length: 'all'
  }
  onboardingStage = 0
  colorPalletteOpened = 0
  svgLoaded = false
  lastHighlightId = null
  lastBodyPart = 'shoulder' // Select shoulder by default
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
  }

  getbodyPartFilters (filters) {
    return pick(filters, [ 'collar', 'coretype', 'neckline', 'shoulder', 'sleeve_length', 'top_length' ])
  }

  initialize () {
    const { hideOnboarding, onSVGLoaded, hideThumbnail, useVerticalThumb } = this.settings

    let viewBox = [0, 0, 490, 400]
    let svgSource = ''
    let svgOnboardingSource = ''
    if (useVerticalThumb) {
      viewBox = [0, 0, 480, 380]
      svgSource = `${process.env.PUBLIC_URL}/svg/vf_bundle_thumb_vertical.svg`
      svgOnboardingSource = `${process.env.PUBLIC_URL}/svg/mini_onboarding_thumb_vertical.svg`
    } else {
      svgSource = `${process.env.PUBLIC_URL}/svg/vf_bundle.svg`
      svgOnboardingSource = `${process.env.PUBLIC_URL}/svg/mini_onboarding.svg`
    }

    if (hideThumbnail) {
      viewBox = [0, 0, 480, 320]
    }

    this.snap.attr({ viewBox })

    Snap.load(svgSource, (frag) => {
      this.svgLoaded = true
      this.snapGroup = this.snap.group()
      this.snapGroup.append(frag)
      // Hide all object and show what we want only later
      this.snapGroup.attr({ visibility: 'hidden' })

      VisualFilter.showGroup(this.snap, 'full-body')

      for (let prop in this.currentPropState) {
        this.propGrpn = PROP_CONST[prop][3]
        VisualFilter.showGroup(this.snap, this.propGrpn + '_' + this.currentPropState[prop])
      }

      // onboarding
      if (!hideOnboarding && VisualFilter.shouldShowOnboarding()) {
        Snap.load(svgOnboardingSource, (frag) => {
          this.showOnboarding(frag)
        })
      } else {
        this.initializeClickHitMap()
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
      group = VisualFilter.findGroupById(this.snap, PROP_CONST[prop][3] + '_touch')

      if (group === null) {
        console.debug('Touch area for', prop, 'not found')
        continue
      }

      // Just make it not-visible. We still need it for hit-map
      group.attr({ visibility: 'visible' })
      group.attr({ opacity: '0' })

      if (!this.settings.disableEvent) {
        group.click(function () { self.handleBodyPartClick(this) }, prop)
      }
    }

    if (!this.settings.hideThumbnail) {
      for (let i = 0; i < 7; i++) {
        group = VisualFilter.findGroupById(this.snap, 'thumbnail_touch_' + i)
        group.attr(thumbTouchSize)
        group.attr({ visibility: 'visible' })
        group.attr({ opacity: '0' })
        group.click(function () { self.handleThumbnailClick(this) }, i.toString())
      }
    }
  }

  updateState (filters) {
    if (!this.svgLoaded) {
      return
    }

    if (!this.settings.hideThumbnail && isNil(this.currentThumbnail)) { // Initial update
      this.switchBodypartThumbnail(this.lastBodyPart)
    }

    const newPropState = this.getbodyPartFilters(filters)
    // only update when svg is loaded and has changes on filters
    if (!isEqual(this.currentPropState, newPropState)) {
      // body part visibility handler
      for (let prop in newPropState) {
        this.propGrpn = PROP_CONST[prop][3]

        // hide previous bodypart
        VisualFilter.hideGroup(this.snap, this.propGrpn + '_' + this.currentPropState[prop])
        // show next bodypart
        VisualFilter.showGroup(this.snap, this.propGrpn + '_' + newPropState[prop])
      }
      // update current prop state after body part visibility handler done
      this.currentPropState = newPropState

      if (!this.settings.hideThumbnail) {
        this.updateThumbnailSelectionBox(this.lastBodyPart)
      }
    }
    if (newPropState['coretype'].toString() === '0') {
      VisualFilter.hideGroup(this.snap, 'length_0')
      VisualFilter.hideGroup(this.snap, 'length_1')
      VisualFilter.hideGroup(this.snap, 'length_2')
      VisualFilter.hideGroup(this.snap, 'length_all')
    }
  }

  showOnboarding (frag) {
    this.snapGroup = this.snap.group()
    this.snapGroup.append(frag)
    this.snapGroup.attr({ visibility: 'hidden' })

    if (this.settings.useVerticalThumb) {
      this.snapGroup.select('svg').attr({ viewBox: [-10, 0, 439, 393] })
    }

    const group = VisualFilter.findGroupById(this.snap, 'mini_onboarding_touch')
    group.click(() => {
      this.handleOnBoardingClick()
    }, this.snap)
    this.handleOnBoardingClick()
  }

  handleOnBoardingClick () {
    switch (this.onboardingStage) {
      case 0:
        VisualFilter.showGroup(this.snap, 'mini_onboarding_touch')
        VisualFilter.showGroup(this.snap, 'mini_onboarding_1')
        this.changePropSelection('shoulder', 1)
        this.handleBodyPartClick('shoulder')
        break
      case 1:
        VisualFilter.hideGroup(this.snap, 'mini_onboarding_1')
        VisualFilter.showGroup(this.snap, 'mini_onboarding_2')
        this.handleBodyPartClick('shoulder')
        break
      case 2:
        VisualFilter.hideGroup(this.snap, 'mini_onboarding_2')
        VisualFilter.showGroup(this.snap, 'mini_onboarding_3')
        this.handleBodyPartClick('shoulder')
        break
      case 3:
      default:
        VisualFilter.hideGroup(this.snap, 'mini_onboarding_touch')
        VisualFilter.hideGroup(this.snap, 'mini_onboarding_3')
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
    console.log('switchBodypartThumbnail', prop)
    if (!isNil(this.currentThumbnail)) {
      VisualFilter.hideGroup(this.snap, PROP_CONST[this.currentThumbnail][3] + '_thumbnails')
    }
    this.currentThumbnail = prop
    const newTnGrp = PROP_CONST[prop][3] + '_thumbnails'
    VisualFilter.showGroup(this.snap, newTnGrp)

    this.updateThumbnailSelectionBox(prop)
  }

  handleBodyPartClick (prop) {
    if (this.currentThumbnail.valueOf() === prop.valueOf()) {
      this.cyclePropSelection(prop)
    }

    this.lastBodyPart = prop

    if (!this.settings.hideThumbnail) {
      this.switchBodypartThumbnail(prop)
    }
    // else {
    //  VisualFilter.removeHighlight(this.snap)
    // }
  }

  updateThumbnailSelectionBox (prop) {
    console.log('updateThumbnailSelectionBox', prop)
    // Display current one
    if (this.settings.useVerticalThumb) {
      // Move thumbnail hit area
      const xoffset = THUMBNAIL_X_OFFSET
      const yoffset = 0
      let desc = 't' + xoffset + ',' + yoffset
      VisualFilter.findGroupById(this.snap, 'Thumbnail_Touch_Area').transform(desc)

      VisualFilter.showVerticalSelectionBox(this.snap, prop, this.currentPropState[prop])
    } else {
      // Move thumbnail hit area
      const xoffset = VisualFilter.getThumbnailXOffset(prop) + 15
      const yoffset = THUMBNAIL_Y_OFFSET + 15
      let desc = 't' + xoffset + ',' + yoffset
      VisualFilter.findGroupById(this.snap, 'Thumbnail_Touch_Area').transform(desc)

      VisualFilter.showHorizontalSelectionBox(this.snap, prop, this.currentPropState[prop])
    }

    VisualFilter.removeHighlight(this.snap)
    VisualFilter.highlightGroup(this.snap, PROP_CONST[prop][3] + '_' + this.currentPropState[prop])
  }

  /**
   * @todo: data mutation from argument should be removed
   */
  handleThumbnailClick (tnIdx) {
    let thumbIndex = tnIdx
    if (tnIdx > PROP_CONST[this.currentThumbnail][1] + 1) {
      return
    }

    if (this.settings.useVerticalThumb) {
      // on vertical thumbnails view, all should be at first
      if (parseInt(tnIdx, 10) === 0) {
        thumbIndex = 'all'
      } else {
        thumbIndex = parseInt(tnIdx, 10) - 1
      }
      VisualFilter.showVerticalSelectionBox(this.snap, this.currentThumbnail, thumbIndex)
    } else {
      // on horizontal thumbnails view, all should be at last
      if (parseInt(tnIdx, 10) === PROP_CONST[this.currentThumbnail][1] + 1) {
        thumbIndex = 'all'
      }
      VisualFilter.showHorizontalSelectionBox(this.snap, this.currentThumbnail, parseInt(tnIdx, 10))
    }

    this.changePropSelection(this.currentThumbnail, thumbIndex)
    VisualFilter.removeHighlight(this.snap)
    VisualFilter.highlightGroup(this.snap, PROP_CONST[this.currentThumbnail][3] + '_' + this.currentPropState[this.currentThumbnail])
  }

  cyclePropSelection (prop) {
    if (this.currentPropState[prop] === 'all') {
      this.changePropSelection(prop, '0')
    } else {
      let next = parseInt(this.currentPropState[prop], 10) + 1
      if (next === PROP_CONST[this.currentThumbnail][1] + 1) {
        next = 'all'
      }
      this.changePropSelection(prop, next)
    }
  }

  changePropSelection (prop, sel, requestChange = true) {
    this.propGrpn = PROP_CONST[prop][3]

    VisualFilter.hideGroup(this.snap, this.propGrpn + '_' + this.currentPropState[prop])
    VisualFilter.showGroup(this.snap, this.propGrpn + '_' + sel)

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
        VisualFilter.hideGroup(this.snap, 'length_' + this.currentPropState['top_length'])
        // change top length to 0
        this.currentPropState['top_length'] = 0
        // show 0 top length image
        VisualFilter.showGroup(this.snap, 'length_0')
      } else if (this.currentPropState['coretype'] === 0) { // coretype is moving away from 0. Restore top length
        VisualFilter.hideGroup(this.snap, 'length_0')
        VisualFilter.hideGroup(this.snap, 'length_1')
        VisualFilter.hideGroup(this.snap, 'length_2')
        VisualFilter.hideGroup(this.snap, 'length_all')
        if (isNil(this.savedTopLength)) {
          VisualFilter.showGroup(this.snap, 'length_0')
        } else {
          VisualFilter.showGroup(this.snap, 'length_' + this.savedTopLength)
          this.currentPropState['top_length'] = this.savedTopLength
          this.savedTopLength = null
        }
      }
    }
    if (prop === 'top_length' && this.currentPropState['coretype'] === 0) {
      VisualFilter.hideGroup(this.snap, 'top_core_0')
      VisualFilter.showGroup(this.snap, 'top_core_1')
      this.currentPropState['coretype'] = 1 // Avoid recursion
    }

    this.currentPropState[prop] = sel
    if (requestChange) {
      this.settings.onFilterChange(this.currentPropState)
    }
  }

  /**
   * adjust container height based on thumbnails height
   * @param {Object} snap
   * @param {string} id
   */
  static adjustHeight (snap, id) {
    const group = VisualFilter.findGroupById(snap, id)
    const componentHeight = group.node.getBBox().height + 150
    // set minimum height of 400
    const viewBox = [0, 0, 490, componentHeight < 380 ? 380 : componentHeight]
    snap.attr({ viewBox })
  }

  /**
   * Set svg group to visible
   * @param {Object} snap
   * @param {string} id
   * @param {Object} extraProps
   */
  static showGroup (snap, id, extraProps = {}) {
    const group = VisualFilter.findGroupById(snap, id)
    group.attr({ visibility: 'visible', ...extraProps })
    return group
  }

  /**
   * Set svg group to invisible
   * @param {Object} snap
   * @param {string} id
   * @param {Object} extraProps
   */
  static hideGroup (snap, id, extraProps) {
    const group = VisualFilter.findGroupById(snap, id)
    group.attr({ visibility: 'hidden', ...extraProps })
  }

  /**
   * Highlight svg group
   * @param {Object} snap
   * @param {string} id
   */
  static highlightGroup (snap, id) {
    id = id + '_HL'
    const group = VisualFilter.findGroupById(snap, id)
    // add highlight mask by moving the component to top
    // it needs to be the last element to show full highlight (z-index)
    group.appendTo(group.parent())
    VisualFilter.showGroup(snap, id)
    VisualFilter.lastHighlightId = id
    console.log('highlightGroup', id)
  }

  static removeHighlight (snap) {
    if (!isNil(VisualFilter.lastHighlightId)) {
      VisualFilter.hideGroup(snap, VisualFilter.lastHighlightId)
      VisualFilter.lastHighlightId = null
    }
  }

  /**
   * Find svg group based on specific id
   * @param {*} snap
   * @param {*} id
   * @return {Object} svg group
   */
  static findGroupById (snap, id) {
    const group = snap.select('#' + id)
    if (group === null) {
      console.debug('Missing group', id)
      return null
    }
    return group
  }

  static getThumbnailXOffset (prop) {
    let tnCnt = PROP_CONST[prop][1] + 2
    return THUMBNAIL_IMG_X_OFFSET[tnCnt]
  }

  static showHorizontalSelectionBox (snap, prop, sel) {
    const group = VisualFilter.findGroupById(snap, 'Thumbnail-Highliter')
    if (sel === 'all') {
      sel = PROP_CONST[prop][1] + 1
    }
    const x = sel * 68 + VisualFilter.getThumbnailXOffset(prop)
    const desc = 't' + x + ',' + THUMBNAIL_Y_OFFSET

    group.transform(desc)
    VisualFilter.showGroup(snap, 'Thumbnail-Highliter')
  }

  static showVerticalSelectionBox (snap, prop, sel) {
    const group = VisualFilter.findGroupById(snap, 'Thumbnail-Highliter')
    if (sel === 'all') {
      sel = 0
    } else {
      sel = sel + 1
    }
    const y = sel * 63

    const desc = 't' + (THUMBNAIL_X_OFFSET - 1) + ',' + y

    group.transform(desc)
    VisualFilter.showGroup(snap, 'Thumbnail-Highliter')
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
  defaultState: {},
  hideThumbnail: false,
  hideOnboarding: false,
  useVerticalThumb: false,
  onFilterChange: (filters) => { console.debug('filter change', filters) },
  onSVGLoaded: () => {}
}
