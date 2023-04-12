const { stylesMap } = require("../const")

const styleToTailwind = (prop, value, specificity, classMetadata) => {
  let tailwindExp = ''
  const expOrMap = stylesMap[prop]
  
  if (expOrMap) {
    const isStaticValue = typeof expOrMap === 'object'
    const key = isStaticValue ? prop : expOrMap

    if (isStaticValue) {
      // position: absolute; -> absolute
      tailwindExp += `${ expOrMap[value] }`      
    } else {
      // width: 9999px; -> w-[9999px]
      if (strategy) {
        // value = value.replace(/\s{2,}/, ' ')
      } else {
        tailwindExp += `${ expOrMap }-[${ value }]`
      }
    }

    classMetadata[key] = {
      tailwindExp,
      specificity
    }
  } else {
    console.log(prop)
    // not support
  }
}

module.exports = styleToTailwind
