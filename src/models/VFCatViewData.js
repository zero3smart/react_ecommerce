import vfWtopSvg from 'assets/svg/vf_wtop.svg'
import vfWtopVertSvg from 'assets/svg/vf_wtop_vert.svg'
import vfWshoesSvg from 'assets/svg/vf_wshoes.svg'
import vfWshoesVertSvg from 'assets/svg/vf_wshoes_vert.svg'
import miniOnboardingSvg from 'assets/svg/mini_onboarding.svg'
import miniOnboardingVertSvg from 'assets/svg/mini_onboarding_thumb_vertical.svg'
import pick from 'lodash-es/pick'
import { getCatCfg } from './VFCatCfg'

class VfCatViewData {
  catcfg = null
  viewBoxWithVertThumbnail = [0, 0, 380, 310]
  viewBoxWithHorizThumbnail = [0, 0, 400, 330]
  viewBoxWithNoThumnbnail = [0, 0, 300, 300]
  thumbnailWidth = 50
  thumbnailHeight = 50
  constructor (vfcatcfg, useVerticalThumb) {
    this.catcfg = vfcatcfg
    this.useVerticalThumb = useVerticalThumb
  }

  sanitizeFilters (filters) {
    let filterSettings = pick(filters, this.catcfg.partList)
    // Older settings may have different range.
    // Limit settings values to valid ones
    for (let i in this.propList()) {
      let prop = this.propList()[i]
      var maxVal = this.catcfg.maxVal(prop)
      if (filterSettings[prop]) {
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
    if (this.useVerticalThumb) {
      return { width: this.thumbnailWidth, height: this.thumbnailHeight }
    } else {
      return { width: this.thumbnailWidth, height: this.thumbnailHeight }
    }
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

  // Offset relative to thumbnail offset
  tnOffset (prop, idx) {
    const tnCnt = this.propCount(prop)
    if (this.useVerticalThumb) {
      return {x: 0, y: 30 + idx * this.thumbnailWidth}
    }
    const THUMBNAIL_IMG_X_OFFSET = {
      3: 132, // only in without ALL BTN
      4: 105,
      5: 83,
      6: 30
    }
    if (tnCnt === 7) {
      if (idx < 3) {
        return {x: THUMBNAIL_IMG_X_OFFSET[3] + idx * this.thumbnailWidth, y: 0}
      } else {
        return {x: THUMBNAIL_IMG_X_OFFSET[4] + (idx - 3) * this.thumbnailWidth, y: 40}
      }
    }
    return {x: THUMBNAIL_IMG_X_OFFSET[tnCnt] + idx * this.thumbnailWidth, y: 0}
  }

  tnAreaOffset () {
    if (this.useVerticalThumb) {
      return {x: 400 - 6, y: 30}
    } else {
      return {x: 100, yoffset: 50}
    }
  }
  arrowBackOffset () {
    let {x, y} = this.tnAreaOffset()
    if (this.useVerticalThumb) {
      return {x: x, y: y - 30}
    } else {
      return {x: x - 30, y: y}
    }
  }
  arrowFowardOffset () {
    let {x, y} = this.tnAreaOffset()
    if (this.useVerticalThumb) {
      return {x: x, y: y + 30}
    } else {
      return {x: x + 30, y: y}
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
  thumbnailTouchSize () {
    return {width: 62, height: 62}
  }
  thumbnailHighlightSize () {
    return {width: 62, height: 61}
  }
}

class VfCatWtopViewData extends VfCatViewData {
  currentPropState = {
    coretype: '0',
    neckline: '0',
    shoulder: '0',
    sleeve_length: '0',
    top_length: '0'
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
  svg (useVerticalThumb) {
    return useVerticalThumb ? vfWtopVertSvg : vfWtopSvg
  }
  miniOnboardingSvg (useVerticalThumb) {
    return useVerticalThumb ? miniOnboardingVertSvg : miniOnboardingSvg
  }
  thumbnailGroupName (prop, idx = null) {
    if (idx === null) {
      return prop + '_thumbnails'
    } else {
      return prop + '_thumbnails' + '_' + idx
    }
  }
  touchGroupName (prop) {
    return prop + '_touch'
  }
  fullbodyGroupName () {
    return 'full-body'
  }
  thumbnailTouchGroupName (i = null) {
    if (i === null) {
      return 'Thumbnail_Touch_Area'
    }
    return 'thumbnail_touch_' + i
  }
  thumbnailHLGroupName () {
    return 'Thumbnail-Highliter'
  }
}

class VfCatWshoesViewData extends VfCatViewData {
  currentPropState = {
    toes: '0',
    covers: '0',
    counters: '0',
    bottoms: '0',
    shafts: '0'
  }
  constructor (vfcatcfg, useVerticalThumb) {
    super(vfcatcfg, useVerticalThumb)
    console.log('Creating VfCatWshoesViewData')
    this.settings = {
    }
  }
  svg (useVerticalThumb) {
    return useVerticalThumb ? vfWshoesVertSvg : vfWshoesSvg
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
  fullbodyGroupName () {
    return 'full_bare_foot'
  }
  thumbnailTouchGroupName (i = null) {
    if (i === null) {
      return 'tn_touches'
    }
    return 'tn_touch_' + i
  }
  thumbnailHLGroupName () {
    return 'tn_HL'
  }

  // getThumbnailXOffset (prop) {
  //   const tnCnt = this.catcfg.maxVal(prop) + 1
  //   const THUMBNAIL_IMG_X_OFFSET = {
  //     3: 132,
  //     4: 97,
  //     5: 63,
  //     6: 30,
  //     7: 3
  //   }
  //   return THUMBNAIL_IMG_X_OFFSET[tnCnt]
  // }
  // tnOffsets (useVerticalThumb, prop = null) {
  //   if (useVerticalThumb) {
  //     return {xoffset: 400 - 6, yoffset: 30}
  //   } else {
  //     return {xoffset: this.getThumbnailXOffset(prop), yoffset: 290}
  //   }
  // }
}

export function getCatData (category, useVerticalThumb) {
  let cfg = getCatCfg(category)
  if (category === 'wtop') {
    return new VfCatWtopViewData(cfg, useVerticalThumb)
  } else if (category === 'wshoes') {
    return new VfCatWshoesViewData(cfg, useVerticalThumb)
  } else if (category === 'wpants') {
    // For now, use wtop as placeholder
    return new VfCatWtopViewData(cfg, useVerticalThumb)
  } else {
    console.assert(false, 'Unknown category ' + category)
    return null
  }
}
