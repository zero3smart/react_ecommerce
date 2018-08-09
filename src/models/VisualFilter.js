/**
 * VisualFilter
 * contains functions to handle visual filter svg interactions
 */
// Import Snap from window. Snap is loaded from template.
import pick from 'lodash-es/pick'
import { PROP_CONST, THUMBNAIL_IMG_X_OFFSET, THUMBNAIL_Y_OFFSET } from 'config/constants'
const { Snap, localStorage } = window

export default class VisualFilter {
  currentThumbnail = 'neckline'
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
    this.snap.attr({ viewBox: [0, 0, 480, 440] })

    Snap.load('/svg/vf_bundle.svg', (frag) => {
      this.snapGroup = this.snap.group()
      this.snapGroup.append(frag)
      this.snapGroup.attr({ visibility: 'hidden' })

      VisualFilter.showGroup(this.snap, 'full-body')

      // init_filter_buttons(s)
      this.handleBodyPartClick('coretype')

      for (let prop in this.currentPropState) {
        this.propGrpn = PROP_CONST[prop][3]
        VisualFilter.showGroup(this.snap, this.propGrpn + '_' + this.currentPropState[prop])
      }

      // onboarding
      if (VisualFilter.shouldShowOnboarding()) {
        Snap.load('/svg/mini_onboarding.svg', (frag) => {
          this.showOnboarding(frag)
        })
      } else {
        this.initializeClickHitMap()
      }
    })
  }

  initializeClickHitMap () {
    const self = this
    let group = null
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
      group.click(function () { self.handleBodyPartClick(this) }, prop)
    }

    for (let i = 0; i < 7; i++) {
      group = VisualFilter.findGroupById(this.snap, 'thumbnail_touch_' + i)
      group.attr({ width: 68, height: 68 })
      group.attr({ visibility: 'visible' })
      group.attr({ opacity: '0' })
      group.click(function () { self.handleThumbnailClick(this) }, i.toString())
    }
  }

  showOnboarding (frag) {
    this.snapGroup = this.snap.group()
    this.snapGroup.append(frag)
    this.snapGroup.attr({ visibility: 'hidden' })

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
        VisualFilter.hideGroup(this.snap, 'mini_onboarding_3')
        VisualFilter.showGroup(this.snap, 'mini_onboarding_4')
        break
      case 4:
        VisualFilter.hideGroup(this.snap, 'mini_onboarding_touch')
        VisualFilter.hideGroup(this.snap, 'mini_onboarding_4')
        this.handleOnboardingFinished()
        this.initializeClickHitMap() // Delay late to avoid Conflict with onboarding hitmap
        break
    }
    this.onboardingStage += 1
  }

  handleOnboardingFinished () {
    VisualFilter.saveConfig('onboarding_completed', 1)
  }

  handleBodyPartClick (prop) {
    if (this.currentThumbnail.valueOf() === prop.valueOf()) {
      this.cyclePropSelection(prop)
    }

    VisualFilter.hideGroup(this.snap, PROP_CONST[this.currentThumbnail][3] + '_thumbnails')
    this.currentThumbnail = prop
    const newTnGrp = PROP_CONST[this.currentThumbnail][3] + '_thumbnails'
    VisualFilter.showGroup(this.snap, newTnGrp)

    // Move thumbnail hit area
    const xoffset = VisualFilter.getThumbnailOffset(prop) + 15
    const yoffset = THUMBNAIL_Y_OFFSET + 15
    let desc = 't' + xoffset + ',' + yoffset
    VisualFilter.findGroupById(this.snap, 'Thumbnail_Touch_Area').transform(desc)

    // Display current one
    VisualFilter.showSelectionBox(this.snap, prop, this.currentPropState[prop])
  }

  /**
   * @todo: data mutation from argument should be removed
   */
  handleThumbnailClick (tnIdx) {
    if (tnIdx > PROP_CONST[this.currentThumbnail][1] + 1) {
      return
    }

    VisualFilter.showSelectionBox(this.snap, this.currentThumbnail, parseInt(tnIdx))

    if (parseInt(tnIdx) === PROP_CONST[this.currentThumbnail][1] + 1) {
      tnIdx = 'all'
    }

    this.changePropSelection(this.currentThumbnail, tnIdx)
  }

  cyclePropSelection (prop) {
    if (this.currentPropState[prop] === 'all') {
      this.changePropSelection(prop, '0')
    } else {
      let next = parseInt(this.currentPropState[prop]) + 1
      if (next === PROP_CONST[this.currentThumbnail][1] + 1) {
        next = 'all'
      }
      this.changePropSelection(prop, next)
    }
  }

  changePropSelection (prop, sel) {
    this.propGrpn = PROP_CONST[prop][3]

    VisualFilter.hideGroup(this.snap, this.propGrpn + '_' + this.currentPropState[prop])
    VisualFilter.showGroup(this.snap, this.propGrpn + '_' + sel)

    let savedTopLength = this.currentPropState['top_length']

    if (prop === 'coretype') {
      // Special handling for tank top
      // Hide top-length
      if (sel === '0') {
        savedTopLength = this.currentPropState['top_length']
        this.currentPropState['top_length'] = 'all'
        VisualFilter.hideGroup(this.snap, 'length_' + savedTopLength)
        VisualFilter.showGroup(this.snap, 'length_0')
      } else if (this.currentPropState[prop] === '0') {
        VisualFilter.hideGroup(this.snap, 'length_0')
        VisualFilter.showGroup(this.snap, 'length_' + savedTopLength)
        this.currentPropState['top_length'] = savedTopLength
      }
    }

    if (prop === 'top_length' && this.currentPropState['coretype'] === '0') {
      VisualFilter.hideGroup(this.snap, 'top_core_0')
      VisualFilter.showGroup(this.snap, 'top_core_1')
      this.currentPropState['coretype'] = '1' // Avoid recursion
    }

    this.currentPropState[prop] = sel
    this.settings.onFilterChange(this.currentPropState)
  }

  /**
   * Set svg group to visible
   * @param {Object} snap
   * @param {string} id
   */
  static showGroup (snap, id) {
    const group = VisualFilter.findGroupById(snap, id)
    group.attr({ visibility: 'visible' })
  }

  /**
   * Set svg group to invisible
   * @param {Object} snap
   * @param {string} id
   */
  static hideGroup (snap, id) {
    const group = VisualFilter.findGroupById(snap, id)
    group.attr({ visibility: 'hidden' })
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

  static getThumbnailOffset (prop) {
    let tnCnt = PROP_CONST[prop][1] + 2
    return THUMBNAIL_IMG_X_OFFSET[tnCnt]
  }

  static showSelectionBox (snap, prop, sel) {
    const group = VisualFilter.findGroupById(snap, 'Thumbnail-Highliter')
    if (sel === 'all') {
      sel = PROP_CONST[prop][1] + 1
    }
    const x = sel * 68 + VisualFilter.getThumbnailOffset(prop)
    const desc = 't' + x + ',' + THUMBNAIL_Y_OFFSET

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
  defaultState: {},
  onFilterChange: (filters) => { console.debug('filter change', filters) }
}
