import vfWtopSvg from 'assets/svg/vf_wtop.svg'
import vfWtopVertSvg from 'assets/svg/vf_wtop_vert.svg'
import vfWshoesSvg from 'assets/svg/vf_wshoes.svg'
import vfWshoesVertSvg from 'assets/svg/vf_wshoes_vert.svg'
import miniOnboardingSvg from 'assets/svg/mini_onboarding.svg'
import miniOnboardingVertSvg from 'assets/svg/mini_onboarding_thumb_vertical.svg'
import pick from 'lodash-es/pick'
import { getCatCfg } from './VFCatCfg'

class VfCatViewData {

  constructor (vfcatcfg) {
    this.catcfg = vfcatcfg
    this.viewBoxWithVertThumbnail = [0, 0, 480, 380]
    this.viewBoxWithHorizThumbnail = [0, 0, 490, 410]
    this.viewBoxWithNoThumnbnail = [0, 0, 480, 320]
  }
  getbodyPartFilters (filters) {
    let filterSettings = pick(filters, this.catcfg.partList)
    // Older settings may have different range.
    // Limit settings values to valid ones
    for (var prop in filterSettings) {
      var maxVal = this.catcfg.maxVal(prop)
      if (parseInt(filterSettings[prop], 10) > maxVal) {
        // Older settings
        console.log('Limiting settings to valid range', prop, filterSettings[prop])
        filterSettings[prop] = maxVal
      }
    }
    return filterSettings
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
  getMaxSelectionIndx (prop) {
    return this.catcfg.maxVal(prop)
  }

  getThumbnailXOffset (prop) {
    const tnCnt = this.catcfg.maxVal(prop) + 1
    const THUMBNAIL_IMG_X_OFFSET = {
      3: 132, // only in without ALL BTN
      4: 97,
      5: 63,
      6: 30,
      7: 3 // only in with ALL BTN
    }
    return THUMBNAIL_IMG_X_OFFSET[tnCnt]
  }

  tnOffsets (useVerticalThumb, prop = null) {
    if (useVerticalThumb) {
      return {xoffset: 400 - 6, yoffset: 30}
    } else {
      return {xoffset: this.getThumbnailXOffset(prop) + 15, yoffset: 340}
    }
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
  constructor (vfcatcfg) {
    super(vfcatcfg)
    this.settings = {}
    this.currentPropState = {
      coretype: '0',
      neckline: '0',
      shoulder: '0',
      sleeve_length: '0',
      top_length: '0'
    }
    this.onboardingSequences = [
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
  constructor (vfcatcfg) {
    super(vfcatcfg)
    this.settings = {}
    this.currentPropState = {
      toes: '0',
      cover: '0',
      counter: '0',
      bottom: '0',
      shaft: '0'
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

  getThumbnailXOffset (prop) {
    const tnCnt = this.catcfg.maxVal(prop) + 1
    const THUMBNAIL_IMG_X_OFFSET = {
      3: 132,
      4: 97,
      5: 63,
      6: 30,
      7: 3
    }
    return THUMBNAIL_IMG_X_OFFSET[tnCnt]
  }
  tnOffsets (useVerticalThumb, prop = null) {
    if (useVerticalThumb) {
      return {xoffset: 400 - 6, yoffset: 30}
    } else {
      return {xoffset: this.getThumbnailXOffset(prop), yoffset: 290}
    }
  }
}

export function getCatData (category) {
  let cfg = getCatCfg(category)
  if (category === 'wtop') {
    return new VfCatWtopViewData(cfg)
  } else if (category === 'wshoes') {
    return new VfCatWshoesViewData(cfg)
  } else {
    console.assert(false, 'Unknown category ' + category)
    return null
  }
}
