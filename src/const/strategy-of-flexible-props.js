const stylesMap = require("./styles-map")

// margin: 10px;
// margin: 10px 20px;
// margin: 10px 20px 30px;
// margin: 10px 20px 30px 40px;
const marginAndPaddingCommonStrategy = (v, prefix) => {
  let exp = ''
  const segments = v.split(' ')
  const { length } = segments

  if (length === 1) {
    exp = `${ prefix }-[${ segments[0] }]`
  } else if (length === 2) {
    const [ topAndBottom, leftAndRight ] = segments

    exp = `${ prefix }y-[${ topAndBottom }] ${ prefix }x-[${ leftAndRight }]`
  } else if (length === 3) {
    const [ top, leftAndRight, bottom ] = segments 

    exp = `${ prefix }t-[${ top }] ${ prefix }x-[${ leftAndRight }] ${ prefix }b-[${ bottom }]`
  } else {
    const [ top, right, bottom, left ] = segments 

    exp = `${ prefix }t-[${ top }] ${ prefix }r-[${ right }] ${ prefix }b-[${ bottom }] ${ prefix }l-[${ left }]`
  }

  return exp
}

// border: 1px;
// border: 1px solid;
// border: 1px solid red;
const borderCommonStrategy = (v, prefix) => {
  let exp = ''
  const segments = v.split(' ')
  const { length } = segments
  const [borderWidth, borderStyle, borderColor] = segments

  if (length >= 1) {
    exp += `${ prefix }-${ borderWidth }`
  } else if (length >= 2) {
    exp += `border-${ borderStyle }`
  } else if (length === 3) {
    exp += `border-${ borderColor }`
  }

  return exp
}

const straregyOfFlexibleProps = {
  margin (v) {
    return marginAndPaddingCommonStrategy(v, stylesMap.margin)
  },

  padding (v) {
    return marginAndPaddingCommonStrategy(v, stylesMap.padding)
  },

  border (v) {
    // TODO: handle different syntax.
    return borderCommonStrategy(v, stylesMap.border)
  },

  'border-top' (v) {
    return borderCommonStrategy(v, stylesMap['border-top'])
  },

  'border-right' (v) {
    return borderCommonStrategy(v, stylesMap['border-right']) 
  },

  'border-bottom' (v) {
    return borderCommonStrategy(v, stylesMap['border-bottom']) 
  },

  'border-left' (v) {
    return borderCommonStrategy(v, stylesMap['border-left']) 
  },

  'border-width' (v) {
    return marginAndPaddingCommonStrategy(v, `${ stylesMap['border-width'] }-`)
  },

  'border-style' (v) {},

  'border-color' (v) {
    return marginAndPaddingCommonStrategy(v, `${ stylesMap['border-color'] }-`)
  }
}

module.exports = straregyOfFlexibleProps
