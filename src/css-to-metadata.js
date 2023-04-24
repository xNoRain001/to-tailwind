const spec = require('selector-specificity')
const shorthandParser = require('css-shorthand-parser')

const filterNodes = require('./filter-nodes')
const { deepClone } = require('./utils')
const { stylesMap, supportedPseudoClasses } = require("./const")

const rawCssCollector = (mediaPrefix, rawCss, selector, prop, value) => {
  // '342:.download__dialog': { transform: 'translateY(-50%)' }
  rawCss[mediaPrefix + selector] = rawCss[mediaPrefix + selector] || {}
  rawCss[mediaPrefix + selector][prop] = value 
}

const pseudoPrefixParser = selector => {
  const prefixs = [] 
  const segments = selector.split(',')

  for (let i = 0, l = segments.length; i < l; i++) {
    const segment = segments[i]

    segment.replace(/:([a-z-]+)(\((.*?)\))?/g, (_, pseudoClass, v) => {
      // if (supportedPseudoClasses.hasOwnProperty(pseudoClass)) {
        prefixs.push({
          pseudoClass,
          pseudoClassPrefix: `${ pseudoClass }:`,
          selector: segment
        })
      // } 
      // else {
      //   rawCssCollector(mediaPrefix, rawCss, segment, prop, value)
      // }
    })
  }
  
  return prefixs.length ? prefixs : [{
    pseudoClass: '',
    pseudoClassPrefix: '',
    selector
  }]
}

const strategies = {
  translateX (exprPrefix, value, pseudoPrefixs, mediaPrefix) {
    let tailwindExp = ''
    let negativePrefix = ''

    if (value.startsWith('-')) {
      value = value.slice(1)
      negativePrefix = '-'
    }

    for (let i = 0, l = pseudoPrefixs.length; i < l; i++) {
      const { pseudoClass, pseudoClassPrefix, selector } = pseudoPrefixs[i]

      if (supportedPseudoClasses.hasOwnProperty(pseudoClass) || pseudoClass === '' ) {
        tailwindExp += `${ mediaPrefix }${ pseudoClassPrefix }${ negativePrefix }${ exprPrefix }-[${ [value] }] `  
      } else {
        rawCssCollector(mediaPrefix, rawCss, selector, prop, value)
      }
    } 

    return tailwindExp
  }
}

strategies.translateY = 
strategies.scaleX = 
strategies.scaleY = strategies.translateX

const styleToTailwind = (
  selector, prop, value, specificity, classMetadata, rawCss, mediaPrefix
) => {
  // shorthand parser convert `transform: translate(50%); ` to
  // `{ translateX: 50%, translateY: 50% }`, styles map don't support
  // `translate[X|Y]?`, but support transform: `translate[X|Y]?`
  const strategy = strategies[prop]
  const exprOrKeywordValues = stylesMap[prop]

  if (exprOrKeywordValues || strategy) {
    if (value.includes('data:')) {
      value = value.replace(/my-semicolon/g, ';')
      rawCssCollector(mediaPrefix, rawCss, selector, prop, value)
      
      return
    }

    let tailwindExp = ''
    const exprOrKeywordValues = stylesMap[prop]
    const isKeywordValues = typeof exprOrKeywordValues === 'object'
    const pseudoPrefixs = pseudoPrefixParser(selector)
    
    if (isKeywordValues) {
      const keywordValue = exprOrKeywordValues[value]

      if (keywordValue) {
        // position: absolute; -> absolute 
        for (let i = 0, l = pseudoPrefixs.length; i < l; i++) {
          const { pseudoClass, pseudoClassPrefix, selector } = pseudoPrefixs[i]

          if (supportedPseudoClasses.hasOwnProperty(pseudoClass) || pseudoClass === '' ) {
            tailwindExp += `${ mediaPrefix }${ pseudoClassPrefix }${ exprOrKeywordValues[value] } `  
          } else {
            rawCssCollector(mediaPrefix, rawCss, selector, prop, value)
          }
        } 
      } else {
        rawCssCollector(mediaPrefix, rawCss, selector, prop, value)
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
              selector, prop, value, specificity, classMetadata, rawCss, mediaPrefix
            )
          }
        }
      } else {
        if (strategy) {
          const exprPrefix1 = prop.match(/[a-z]+/)[0] // translate
          const exprPrefix2 = prop.match(/[A-Z]+/)[0].toLowerCase() // X
          const exprPrefix = `${ exprPrefix1 }-${ exprPrefix2 }` // translate-X

          tailwindExp += strategy(exprPrefix, value, pseudoPrefixs, mediaPrefix)
        } else {
          if (prop === 'content') {
            for (let i = 0, l = pseudoPrefixs.length; i < l; i++) {
              const content = value.match(/['"](.*?)['"]/)[1]
  
              if (content) {
                for (let i = 0, l = pseudoPrefixs.length; i < l; i++) {
                  const { pseudoClass, pseudoClassPrefix, selector } = pseudoPrefixs[i]

                  if (supportedPseudoClasses.hasOwnProperty(pseudoClass) || pseudoClass === '' ) {
                    tailwindExp += `${ mediaPrefix }${ pseudoClassPrefix }content-['${ content }'] `  
                  } else {
                    rawCssCollector(mediaPrefix, rawCss, selector, prop, value)
                  }
                } 
              }
            } 
          } else {
            
            // width: 9999px; -> w-[9999px]
            for (let i = 0, l = pseudoPrefixs.length; i < l; i++) {
              const { pseudoClass, pseudoClassPrefix, selector } = pseudoPrefixs[i]

              if (supportedPseudoClasses.hasOwnProperty(pseudoClass) || pseudoClass === '' ) {
                tailwindExp += `${ mediaPrefix }${ pseudoClassPrefix }${ exprOrKeywordValues }-[${ value }] `
              } else {
                rawCssCollector(mediaPrefix, rawCss, selector, prop, value)
              }
            } 
            
          }
        }
      }
    }

    tailwindExp = tailwindExp.slice(0, -1)
    classMetadata[mediaPrefix + prop] = {
      tailwindExp,
      specificity
    }
  } else {
    rawCssCollector(mediaPrefix, rawCss, selector, prop, value)
  }
}

const cssStyleRuleRegexp = /}?(.*?){(.*?)}/g

const cssToMetadata = (
  mediaPrefix = '', css, sourceNodes, isInject, rawCss, classMetadataList
) => {
  css.replace(cssStyleRuleRegexp, (_, selector, cssText) => {
    // empty rule -> .foo {}
    if (!cssText) {
      return
    }

    if (isInject) {
      const nodes = filterNodes(sourceNodes, selector)

      if (nodes.length) {
        const specificity = spec.getSpecificity(selector)
        const classMetadata = {}

        cssText.replace(/(.*?):([^;]*);?/g, (_, prop, value) => {
          styleToTailwind(
            selector, prop, value, specificity, classMetadata, rawCss, mediaPrefix
          )
        })

        for (let i = 0, l = nodes.length; i < l; i++) {
          const _classMetadata = deepClone(classMetadata)
          const node = nodes[i]
          const source = node.classMetadata

          if (!source) {
            node.classMetadata = _classMetadata
          } else {
            for (const key in _classMetadata) {
              const value = _classMetadata[key]

              if (!source[key] || source[key].specificity <= value.specificity) {
                source[key] = value
              }
            }
          }
        }
      }
    } else {
      const classMetadata = {}
      const specificity = spec.getSpecificity(selector)

      cssText.replace(/(.*?):([^;]*);?/g, (_, prop, value) => {
        styleToTailwind(
          selector, prop, value, specificity, classMetadata, rawCss, mediaPrefix
        )
      })

      const pseudoPrefixs = pseudoPrefixParser(selector)
      const _classMetadata = deepClone(classMetadata)

      // pseudoPrefixs.length === 1 -> no pseudo class or one pseudo class
      // pseudoPrefixs.length !== 1 -> some pseudo class may not be supported,
      // so remove unsupported pseudo class's selector
      let _selector = ''

      // TODO: .download__btn:hover:after
      if (pseudoPrefixs.length !== 1) {
        for (let i = 0, l = pseudoPrefixs.length; i < l; i++) {
          const { pseudoClass, selector } = pseudoPrefixs[i]
  
          if (supportedPseudoClasses.hasOwnProperty(pseudoClass)) {
            _selector += `${ selector },`
          }
        }
        
        _selector = _selector.slice(0, -1)
      } 

      const __selector = _selector || selector

      const source = classMetadataList[__selector]

      if (!source) {
        classMetadataList[__selector] = _classMetadata
      } else {
        for (const key in _classMetadata) {
          const value = _classMetadata[key]

          if (!source[key] || source[key].specificity <= value.specificity) {
            source[key] = value
          }
        }
      }
    }
  })
}

module.exports = cssToMetadata
