/**
 * VisualFilter
 * contains functions to handle visual filter svg interactions
 */
// Import Snap from window. Snap is loaded from template.
import { PROP_CONST } from 'config/constants'
import VisualFilter from './VisualFilter'

const { Snap } = window

export default class BodyPart {
  currentThumbnail = 'neckline'
  currentPropState = {
    collar: '0',
    coretype: '0',
    neckline: '1',
    shoulder: '3',
    sleeve_length: '3',
    top_length: 'all'
  }
  onboardingStage = 0
  colorPalletteOpened = 0

  constructor (selector = '#svg', options = {}) {
    this.settings = {
      ...defaultOptions,
      ...options
    }

    if (options.defaultState) {
      this.currentPropState = options.defaultState
    }

    this.snap = Snap(selector)

    this.initialize() // initialize snap
  }

  initialize () {
    this.snap.attr({ viewBox: [0, 0, 480, 440] })

    Snap.load('/svg/vf_body.svg', (frag) => {
      this.snapGroup = this.snap.group()
      this.snapGroup.append(frag)
      this.snapGroup.attr({ visibility: 'hidden' })

      VisualFilter.showGroup(this.snap, 'full-body')

      this.handleBodyPartClick('coretype')

      for (let prop in this.currentPropState) {
        this.propGrpn = PROP_CONST[prop][3]

        VisualFilter.showGroup(this.snap, this.propGrpn + '_' + this.currentPropState[prop])
      }

      this.initializeClickHitMap()
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
      if (!this.settings.disableEvent) {
        group.click(function () { self.handleBodyPartClick(this) }, prop)
      }
    }
  }

  handleBodyPartClick (prop) {
    if (this.currentThumbnail.valueOf() === prop.valueOf()) {
      this.cyclePropSelection(prop)
    }

    this.currentThumbnail = prop
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
    this.settings.onBodyPartClick(this.getProductFilters())

    for (var i in PROP_CONST) {
      VisualFilter.saveConfig(i, this.currentPropState[i])
    }
  }

  getProductFilters () {
    let filters = {
      page: 0,
      extra_info: 1,
      cnt_per_page: 72
    }

    // get filter based on currentPropState
    for (let prop in this.currentPropState) {
      let ps = this.currentPropState[prop]
      if (ps >= 0) {
        // sleeve_length covers sleeve_length and tightness for UI simplicity
        if (prop === 'sleeve_length') {
          if (ps === 5) { // long & wide sleeve
            filters.sleeve_length = 4
            filters.sleeve_tightness = 1
          } else if (ps === 4) { // long & tight sleeve
            filters.sleeve_length = 4
            filters.sleeve_tightness = 0
          } else {
            filters[prop] = ps
          }
        } else {
          filters[prop] = ps
        }
      }
    }

    return filters
  }
}

const defaultOptions = {
  disableEvent: false,
  defaultState: undefined,
  onBodyPartClick: (filters) => { console.debug('body part clicked', filters) }
}
