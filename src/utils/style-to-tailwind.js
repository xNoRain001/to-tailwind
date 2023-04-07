const { stylesMap, flexibleProps } = require("../const")

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
      if (flexibleProps.hasOwnProperty(prop)) {
        value = value.replace(/\s{2,}/, ' ')
        // TODO: handle flexible props
        tailwindExp += `${ expOrMap }-[${ value }]` 
      } else {
        tailwindExp += `${ expOrMap }-[${ value }]`
      }
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
