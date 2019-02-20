import vfWtopSvg from '@yesplz/core-web/assets/svg/vf_wtop.svg'
// import vfWtopVertSvg from '@yesplz/core-web/assets/svg/vf_wtop_vert.svg'
import vfWshoesSvg from '@yesplz/core-web/assets/svg/vf_wshoes.svg'
// import vfWshoesVertSvg from '@yesplz/core-web/assets/svg/vf_wshoes_vert.svg'
import vfWpantsSvg from '@yesplz/core-web/assets/svg/vf_wpants.svg'
// import vfWpantsVertSvg from '@yesplz/core-web/assets/svg/vf_wpants_vert.svg'

import miniOnboardingSvg from '@yesplz/core-web/assets/svg/mini_onboarding.svg'
import miniOnboardingVertSvg from '@yesplz/core-web/assets/svg/mini_onboarding_thumb_vertical.svg'
import pick from 'lodash/pick'
import { getCatCfg } from './VFCatCfg'

class VfCatViewData {
  catcfg = null
  viewBoxWithVertThumbnail = [0, 0, 380, 310]
  viewBoxWithHorizThumbnail = [0, 0, 400, 400]
  viewBoxWithNoThumnbnail = [0, 0, 250, 250]
  thumbnailWidth = 64
  thumbnailHeight = 64
  // useVerticalThumb is obsolete in v1.0. Remove it once mobile page is updated
  constructor (vfcatcfg, useVerticalThumb) {
    this.catcfg = vfcatcfg
    this.useVerticalThumb = useVerticalThumb
  }
  currentPreset = null

  presetList = [ ]

  sanitizeFilters (filters) {
    let filterSettings = pick(filters, this.catcfg.partList)
    // Older settings may have different range.
    // Limit settings values to valid ones
    for (let i in this.propList()) {
      let prop = this.propList()[i]
      var maxVal = this.catcfg.maxVal(prop)
      if (filterSettings[prop] >= 0) {
        if (parseInt(filterSettings[prop], 10) > maxVal) {
          console.log('Limiting settings to valid range', prop, filterSettings[prop])
          filterSettings[prop] = maxVal
        }
      } else {
        filterSettings[prop] = this.currentPropState[prop]
      }
    }
    return filterSettings
  }
  thumbTouchSize () {
    return { width: this.thumbnailWidth, height: this.thumbnailHeight }
  }
  setDefaultState (filters) {
    this.currentPropState = this.sanitizeFilters(filters)
  }

  viewBox (hideThumbnail, vertThumbnails) {
    if (hideThumbnail) {
      return this.viewBoxWithNoThumnbnail
    }
    if (vertThumbnails) {
      return this.viewBoxWithVertThumbnail
    } else {
      return this.viewBoxWithHorizThumbnail
    }
  }

  propCount (prop) {
    return this.catcfg.maxVal(prop) + 1
  }

  getMaxSelectionIndx (prop) {
    return this.catcfg.maxVal(prop)
  }
  clipPropStateRange (val, from, to) {
    return Math.max(from, Math.min(val, to))
  }

  // Offset relative to thumbnail offset
  tnOffset (prop, idx) {
    const tnCnt = this.propCount(prop)
    const base = this.tnAreaOffset()
    if (this.useVerticalThumb) {
      return {x: base.x, y: base.y + idx * this.thumbnailWidth}
    }

    let calcX = (idx) => {
      return base.x + 70 + idx * this.thumbnailWidth
    }
    if (tnCnt > 4) { // Show in two rows
      if (idx <= 3) {
        return {x: calcX(idx), y: base.y - this.thumbnailHeight / 2}
      } else {
        return {x: calcX(idx - 4), y: base.y + this.thumbnailHeight / 2}
      }
    }
    return {x: calcX(idx), y: base.y}
  }

  tnAreaOffset () {
    if (this.useVerticalThumb) {
      return {x: 400 - 6, y: 30}
    } else {
      return {x: 0, y: 280}
    }
  }
  arrowBackOffset () {
    let {x, y} = this.tnAreaOffset()
    if (this.useVerticalThumb) {
      return {x: x, y: y - 30}
    } else {
      return {x: x, y: y}
    }
  }
  arrowFowardOffset () {
    let {x, y} = this.tnAreaOffset()
    if (this.useVerticalThumb) {
      return {x: x, y: y + 30}
    } else {
      return {x: x + 330, y: y}
    }
  }

  propList () {
    return this.catcfg.partList
  }
  prevProp (prop) {
    const currentPropIndex = this.catcfg.partList.indexOf(prop)
    const nextPropIndex = currentPropIndex > 0 ? currentPropIndex - 1 : this.catcfg.partList.length - 1
    return this.catcfg.partList[nextPropIndex]
  }
  nextProp (prop) {
    const currentPropIndex = this.catcfg.partList.indexOf(prop)
    const nextPropIndex = currentPropIndex < this.catcfg.partList.length - 1 ? currentPropIndex + 1 : 0
    return this.catcfg.partList[nextPropIndex]
  }
  nextPreset (backward) {
    if (this.currentPreset === null) {
      this.currentPreset = 0
    }
    this.currentPreset += backward ? -1 : 1
    this.currentPreset = (this.currentPreset + this.presetList.length) % this.presetList.length
    return this.presetList[this.currentPreset]
  }

  thumbnailTouchSize () {
    return {width: 62, height: 62}
  }
  thumbnailHighlightSize () {
    return {width: 62, height: 61}
  }

  changePropSelection (prop, sel) {
    this.currentPropState[prop] = sel
  }

  getBodyPartGroupName (prop, propState = null) {
    let state = propState || this.currentPropState
    return prop + '_' + state[prop]
  }

  getHoverGroupName (prop) {
    return this.getBodyPartGroupName(prop, this.catcfg.propMaxVal)
  }

  thumbnailHLGroupName () {
    return 'tn_HL'
  }
  fullbodyGroupName () {
    return 'mannequin'
  }
}

class VfCatWtopViewData extends VfCatViewData {
  currentPropState = {
    coretype: 0,
    neckline: 0,
    shoulder: 0,
    sleeve_length: 0,
    top_length: 0
  }
  onboardingSequences = [
    {coretype: 2, neckline: 1, shoulder: 1, sleeve_length: 0, top_length: 2},
    {coretype: 2, neckline: 1, shoulder: 2, sleeve_length: 0, top_length: 2},
    {coretype: 2, neckline: 1, shoulder: 3, sleeve_length: 0, top_length: 2},
    {coretype: 2, neckline: 1, shoulder: 0, sleeve_length: 1, top_length: 2},
    {coretype: 2, neckline: 1, shoulder: 0, sleeve_length: 2, top_length: 2},
    {coretype: 2, neckline: 1, shoulder: 0, sleeve_length: 4, top_length: 2},
    {coretype: 2, neckline: 1, shoulder: 0, sleeve_length: 5, top_length: 2},
    {coretype: 0, neckline: 2, shoulder: 3, sleeve_length: 5, top_length: 0},
    {coretype: 1, neckline: 2, shoulder: 3, sleeve_length: 2, top_length: 2},
    {coretype: 2, neckline: 1, shoulder: 3, sleeve_length: 0, top_length: 1}
  ]

  constructor (vfcatcfg, useVerticalThumb) {
    super(vfcatcfg, useVerticalThumb)
    console.log('Creating VfCatWtopViewData')
    this.settings = {
    }
  }
  svgCoreAndTn (useVerticalThumb) {
    return vfWtopSvg
    // return useVerticalThumb ? vfWtopVertSvg : vfWtopSvg
  }
  miniOnboardingSvg (useVerticalThumb) {
    return useVerticalThumb ? miniOnboardingVertSvg : miniOnboardingSvg
  }
  thumbnailGroupName (prop, idx = null) {
    if (idx === null) {
      return 'tn_' + prop
    } else {
      return 'tn_' + prop + '_' + idx
    }
  }

  presetList = [
    {coretype: 0, neckline: 0, shoulder: 0, sleeve_length: 0, top_length: 0},
    {coretype: 0, neckline: 1, shoulder: 2, sleeve_length: 3, top_length: 0},
    {coretype: 1, neckline: 3, shoulder: 2, sleeve_length: 1, top_length: 0},
    {coretype: 1, neckline: 0, shoulder: 1, sleeve_length: 0, top_length: 1},
    {coretype: 2, neckline: 0, shoulder: 2, sleeve_length: 4, top_length: 2},
    {coretype: 2, neckline: 2, shoulder: 0, sleeve_length: 5, top_length: 1},
    {coretype: 3, neckline: 0, shoulder: 3, sleeve_length: 0, top_length: 1},
    {coretype: 3, neckline: 4, shoulder: 3, sleeve_length: 5, top_length: 2}
  ]

  touchGroupName (prop) {
    return prop + '_touch'
  }
  thumbnailTouchGroupName (i = null) {
    if (i === null) {
      return 'tn_touches'
    }
    return 'tn_touch_' + i
  }
  changePropSelection (prop, sel) {
    if (prop === 'coretype' && sel === 0) {
      this.currentPropState['top_length'] = 0
    }
    if (prop === 'top_length' && sel !== 0 && this.currentPropState['coretype'] === 0) {
      this.currentPropState['coretype'] = 1
    }
    this.currentPropState[prop] = sel
  }

  getBodyPartGroupName (prop, propState = null) {
    let state = propState || this.currentPropState

    if (prop === 'shoulder') {
      // Special cases for shoulders:
      // Shoulder 3 / sleeves 0 : shows 'shoulder_3_for_sleeves_0' instead of 'shoulder_3'
      var shoulder = state['shoulder']
      if (shoulder === 3 && state['sleeve_length'] === 0) {
        return 'shoulder_3_for_sleeves_0'
      }
    }
    return prop + '_' + state[prop]
  }
}

class VfCatWshoesViewData extends VfCatViewData {
  currentPropState = {
    toes: 0,
    covers: 0,
    counters: 0,
    bottoms: 0,
    shafts: 0
  }
  presetList = [
    {'toes': 2, 'covers': 0, 'shafts': 0, 'counters': 2, 'bottoms': 6},
    {'toes': 2, 'covers': 0, 'shafts': 1, 'counters': 1, 'bottoms': 6},
    {'toes': 1, 'covers': 1, 'shafts': 0, 'counters': 2, 'bottoms': 1},
    {'toes': 2, 'covers': 2, 'shafts': 2, 'counters': 2, 'bottoms': 5},
    {'toes': 2, 'covers': 2, 'shafts': 4, 'counters': 2, 'bottoms': 3},
    {'toes': 0, 'covers': 2, 'shafts': 2, 'counters': 0, 'bottoms': 3},
    {'toes': 0, 'covers': 0, 'shafts': 0, 'counters': 0, 'bottoms': 0},
    {'toes': 2, 'covers': 2, 'shafts': 1, 'counters': 3, 'bottoms': 0}
  ]

  constructor (vfcatcfg, useVerticalThumb) {
    super(vfcatcfg, useVerticalThumb)
    console.log('Creating VfCatWshoesViewData')
    this.settings = {
    }
  }
  svgCoreAndTn (useVerticalThumb) {
    return vfWshoesSvg
    // return useVerticalThumb ? vfWshoesVertSvg : vfWshoesSvg
  }
  miniOnboardingSvg (useVerticalThumb) {
    return null
  }

  thumbnailGroupName (prop, idx = null) {
    if (idx === null) {
      return 'tn_' + prop
    } else {
      return 'tn_' + prop + '_' + idx
    }
  }
  touchGroupName (prop) {
    return prop + '_touch'
  }
  thumbnailTouchGroupName (i = null) {
    if (i === null) {
      return 'tn_touches'
    }
    return 'tn_touch_' + i
  }

  getHoverGroupName (prop) {
    const hoverHlIdx = {
      'shafts': 0,
      'counters': 2,
      'covers': 2,
      'toes': 0,
      'bottoms': 2
    }
    return this.getBodyPartGroupName(prop, hoverHlIdx)
  }
}

class VfCatWpantsViewData extends VfCatViewData {
  currentPropState = {
    rise: 0,
    thigh: 0,
    knee: 0,
    ankle: 0
  }
  presetList = [
    {rise: 0, thigh: 0, knee: 0, ankle: 0},
    {rise: 2, thigh: 1, knee: 0, ankle: 0},
    {rise: 1, thigh: 2, knee: 1, ankle: 2},
    {rise: 0, thigh: 2, knee: 2, ankle: 3},
    {rise: 2, thigh: 3, knee: 2, ankle: 5}
  ]

  constructor (vfcatcfg, useVerticalThumb) {
    super(vfcatcfg, useVerticalThumb)
    console.log('Creating VfCatWpantsViewData')
    this.settings = {
    }
  }
  svgCoreAndTn (useVerticalThumb) {
    return vfWpantsSvg
    // return useVerticalThumb ? vfWpantsVertSvg : vfWpantsSvg
  }
  miniOnboardingSvg (useVerticalThumb) {
    return null
  }

  thumbnailGroupName (prop, idx = null) {
    if (idx === null) {
      return 'tn_' + prop
    } else {
      return 'tn_' + prop + '_' + idx
    }
  }
  touchGroupName (prop) {
    return 'touch_' + prop
  }
  thumbnailTouchGroupName (i = null) {
    if (i === null) {
      return 'tn_touches'
    }
    return 'tn_touch_' + i
  }
  changePropSelection (prop, sel) {
    let knee = this.currentPropState['knee']
    let thigh = this.currentPropState['thigh']

    if (prop === 'thigh') {
      if (sel === 0 || sel === 1) { // Short pants. No knee, ankle
        this.currentPropState['knee'] = 0
        this.currentPropState['ankle'] = 0
      } else if (sel === 2) {
        this.currentPropState['knee'] = this.clipPropStateRange(knee, 0, 2)
      } else {
        if (knee !== 0) {
          this.currentPropState['knee'] = this.clipPropStateRange(knee, 3, 3)
        }
      }
    }
    if (prop === 'knee') {
      if (sel === 0) { // No knee means no ankle also
        this.currentPropState['ankle'] = 0
      } else if (sel === 1 || sel === 2) {
        this.currentPropState['thigh'] = this.clipPropStateRange(thigh, 2, 3)
      }
    }

    if (prop === 'ankle') {
      let knee = this.currentPropState['knee']
      let thigh = this.currentPropState['thigh']
      if (sel === 1) {
        this.currentPropState['knee'] = 1
        this.currentPropState['thigh'] = 2
      } else if (sel === 2) {
        this.currentPropState['knee'] = this.clipPropStateRange(knee, 1, 2)
        this.currentPropState['thigh'] = this.clipPropStateRange(thigh, 2, 3)
      } else if (sel === 3 || sel === 4) {
        this.currentPropState['knee'] = this.clipPropStateRange(knee, 1, 2)
        if (this.currentPropState['knee'] === 2) {
          this.currentPropState['thigh'] = 2
        } else {
          this.currentPropState['thigh'] = 3
        }
      }
    }
    this.currentPropState[prop] = sel
  }
  getBodyPartGroupName (prop, propState = null) {
    let state = propState || this.currentPropState
    let val = state[prop].toString()
    if (prop === 'knee' && val !== '0') {
      return 'knees_' + val + '_thigh_' + state['thigh']
    }
    if (prop === 'ankle' && val !== '0') {
      return 'ankle_' + val + '_knees_' + state['knee'] + '_' + state['thigh']
    }
    return prop + '_' + state[prop]
  }
}

export function getCatData (category, useVerticalThumb) {
  let cfg = getCatCfg(category)
  if (category === 'wtop') {
    return new VfCatWtopViewData(cfg, useVerticalThumb)
  } else if (category === 'wshoes') {
    return new VfCatWshoesViewData(cfg, useVerticalThumb)
  } else if (category === 'wpants') {
    return new VfCatWpantsViewData(cfg, useVerticalThumb)
  } else {
    console.assert(false, 'Unknown category ' + category)
    return null
  }
}
