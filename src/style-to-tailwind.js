const shorthandParser = require('css-shorthand-parser')

const { stylesMap, unsupportedPseudoClasses } = require("./const")

const rawCssCollector = (rawCss, selector, prop, value) => {
  rawCss[selector] = rawCss[selector] || {}
  rawCss[selector][prop] = value 
}

const pseudoPrefixParser = (rawCss, selector, prop, value) => {
  const prefixs = []
  const segments = selector.split(',')

  for (let i = 0, l = segments.length; i < l; i++) {
    const segment = segments[i]

    segment.replace(/:([a-z]+)/g, (_, pseudoClass) => {
      if (unsupportedPseudoClasses.hasOwnProperty(pseudoClass)) {
        rawCssCollector(rawCss, segment, prop, value)
      } else {
        prefixs.push(`${ pseudoClass }:`)
      }
    })
  }
  
  return prefixs.length ? prefixs : ['']
}

const strategies = {
  translateX (exprPrefix, value, pseudoPrefixs) {
    let tailwindExp = ''
    const negativePrefix = value.startsWith('-') ? '-' : ''

    for (let i = 0, l = pseudoPrefixs.length; i < l; i++) {
      tailwindExp += `${ pseudoPrefixs[i] }${ negativePrefix }${ exprPrefix }-[${ [value] }] `  
    } 

    return tailwindExp
  }
}

strategies.translateY = 
strategies.scaleX = 
strategies.scaleY = strategies.translateX

const styleToTailwind = (
  selector, prop, value, specificity, classMetadata, rawCss
) => {
  // shorthand parser convert `transform: translate(50%); ` to
  // `{ translateX: 50%, translateY: 50% }`, styles map don't support
  // `translate[X|Y]?`, but support transform: `translate[X|Y]?`
  const strategy = strategies[prop]
  const exprOrKeywordValues = stylesMap[prop]

  if (exprOrKeywordValues || strategy) {
    if (value.includes('data:')) {
      value = value.replace(/my-semicolon/g, ';')
      rawCssCollector(rawCss, selector, prop, value)
      
      return
    }

    let tailwindExp = ''
    const exprOrKeywordValues = stylesMap[prop]
    const isKeywordValues = typeof exprOrKeywordValues === 'object'
    const key = isKeywordValues ? prop : exprOrKeywordValues
    const pseudoPrefixs = pseudoPrefixParser(rawCss, selector, prop, value)
    
    if (isKeywordValues) {
      const keywordValue = exprOrKeywordValues[value]

      if (keywordValue) {
        // position: absolute; -> absolute 
        for (let i = 0, l = pseudoPrefixs.length; i < l; i++) {
          tailwindExp += `${ pseudoPrefixs[i] }${ exprOrKeywordValues[value] } `  
        } 
      } else {
        rawCssCollector(rawCss, selector, prop, value)
      }
    } else {
      // try parse shorthand property
      const res = shorthandParser(prop, value) 

      if (res) {
        const props = Object.keys(res)

        for (let i = 0, l = props.length; i < l; i++) {
          const prop = props[i]
          const value = res[prop]
          
          if (value !== 'unset') {
            styleToTailwind(
              selector, prop, value, specificity, classMetadata, rawCss
            )
          }
        }
      } else {
        if (strategy) {
          const exprPrefix1 = prop.match(/[a-z]+/)[0] // translate
          const exprPrefix2 = prop.match(/[A-Z]+/)[0].toLowerCase() // X
          const exprPrefix = `${ exprPrefix1 }-${ exprPrefix2 }` // translate-X

          tailwindExp += strategy(exprPrefix, value, pseudoPrefixs)
        } else {
          if (prop === 'content') {
            for (let i = 0, l = pseudoPrefixs.length; i < l; i++) {
              const content = value.match(/['"](.*?)['"]/)[1]
  
              if (content) {
                for (let i = 0, l = pseudoPrefixs.length; i < l; i++) {
                  tailwindExp += `${ pseudoPrefixs[i] }content-['${ content }'] `  
                } 
              }
            } 
          } else {
            // width: 9999px; -> w-[9999px]
            for (let i = 0, l = pseudoPrefixs.length; i < l; i++) {
              tailwindExp += `${ pseudoPrefixs[i] }${ exprOrKeywordValues }-[${ value }] `
            } 
          }
        }
      }
    }

    tailwindExp = tailwindExp.slice(0, -1)

    classMetadata[key] = {
      tailwindExp,
      specificity
    }
  } else {
    rawCssCollector(rawCss, selector, prop, value)
  }
}

module.exports = styleToTailwind
