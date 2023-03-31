const { stylesMap } = require("../const")

const styleToTailwind = (prop, value, specificity, classMetadata) => {
  let tailwindExp = ''
  const expOrMap = stylesMap[prop]
  
  if (expOrMap) {
    const isStaticValue = typeof expOrMap === 'object'
    // const abbrExp = flag[value] || stylesMap[prop]
    const key = isStaticValue ? prop : expOrMap

    if (isStaticValue) {
      // position: absolute; -> absolute
      tailwindExp += `${ expOrMap[value] }`      
    } else {
      // width: 9999px; -> w-[9999px]
      tailwindExp += `${ expOrMap }-[${ value }]`
    }

    classMetadata[key] = {
      tailwindExp,
      specificity
    }
  } else {
    // not support
  }
}

module.exports = styleToTailwind
