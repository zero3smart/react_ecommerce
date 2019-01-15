
class VfCatCfg {
  maxVal (prop) {
    return this.propMaxVal[prop]
  }
  defaultVal (prop) {
    return this.propDefaultVal[prop]
  }
}

class VfCatWtopCfg extends VfCatCfg {
  partList = ['shoulder', 'neckline', 'sleeve_length', 'coretype', 'top_length']
  propMaxVal = {
    'coretype': 3,
    'top_length': 2,
    'neckline': 4,
    'shoulder': 3,
    'sleeve_length': 5,
    'solid': 1,
    'pattern': 1,
    'details': 1
  }
  propDefaultVal = {
    'coretype': 2,
    'top_length': 1,
    'neckline': 1,
    'shoulder': 1,
    'sleeve_length': 3,
    'solid': 0,
    'pattern': 0,
    'details': 0,
    'color': []
  }
}

class VfCatWshoesCfg extends VfCatCfg {
  partList = ['toes', 'cover', 'counter', 'bottom', 'shaft']
  propMaxVal = {
    'toes': 2,
    'cover': 3,
    'counter': 3,
    'bottom': 6,
    'shaft': 4,
    'solid': 1,
    'pattern': 1,
    'details': 1
  }
  propDefaultVal = {
    'toes': 2,
    'cover': 3,
    'counter': 3,
    'bottom': 1,
    'shaft': 0,
    'solid': 0,
    'pattern': 0,
    'details': 0,
    'color': []
  }
}

export function getCatCfg (category) {
  if (category === 'wtop') {
    return new VfCatWtopCfg()
  } else if (category === 'wshoes') {
    return new VfCatWshoesCfg()
  }
}
