const spec = require('selector-specificity')
const shorthandParser = require('css-shorthand-parser')

const filterNodes = require('./filter-nodes')
const { deepClone } = require('./utils')
const { stylesMap, unsupportedPseudoClasses } = require("./const")

const rawCssCollector = (mediaPrefix, rawCss, selector, prop, value) => {
  // '342:.download__dialog': { transform: 'translateY(-50%)' }
  rawCss[mediaPrefix + selector] = rawCss[mediaPrefix + selector] || {}
  rawCss[mediaPrefix + selector][prop] = value 
}

const pseudoPrefixParser = (mediaPrefix, rawCss, selector, prop, value) => {
  const prefixs = []
  const segments = selector.split(',')

  for (let i = 0, l = segments.length; i < l; i++) {
    const segment = segments[i]

    segment.replace(/:([a-z]+)/g, (_, pseudoClass) => {
      if (unsupportedPseudoClasses.hasOwnProperty(pseudoClass)) {
        rawCssCollector(mediaPrefix, rawCss, segment, prop, value)
      } else {
        prefixs.push(`${ pseudoClass }:`)
      }
    })
  }
  
  return prefixs.length ? prefixs : ['']
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
      tailwindExp += `${ mediaPrefix }${ pseudoPrefixs[i] }${ negativePrefix }${ exprPrefix }-[${ [value] }] `  
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
    const pseudoPrefixs = pseudoPrefixParser(mediaPrefix, rawCss, selector, prop, value)
    
    if (isKeywordValues) {
      const keywordValue = exprOrKeywordValues[value]

      if (keywordValue) {
        // position: absolute; -> absolute 
        for (let i = 0, l = pseudoPrefixs.length; i < l; i++) {
          tailwindExp += `${ mediaPrefix }${ pseudoPrefixs[i] }${ exprOrKeywordValues[value] } `  
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
                  tailwindExp += `${ mediaPrefix }${ pseudoPrefixs[i] }content-['${ content }'] `  
                } 
              }
            } 
          } else {
            // width: 9999px; -> w-[9999px]
            for (let i = 0, l = pseudoPrefixs.length; i < l; i++) {
              tailwindExp += `${ mediaPrefix }${ pseudoPrefixs[i] }${ exprOrKeywordValues }-[${ value }] `
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

      const _classMetadata = deepClone(classMetadata)
      const source = classMetadataList[selector]

      if (!source) {
        classMetadataList[selector] = _classMetadata
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

  // if (isInject) {
  //   for (let i = 0, l = sourceNodes.length; i < l; i++) {
  //     const node = sourceNodes[i]
  //     const { classMetadata, attrs } = node
  
  //     if (classMetadata) {
  //       node.tailwindExp = classMetadataToTailwindExp(classMetadata, attrs.rawClass, isInject)
  //     }
  //   }
  // } else {
  //   const selectors = Object.keys(res)

  //   for (let i = 0, l = selectors.length; i < l; i++) {
  //     const selector = selectors[i]
  //     const classMetadata = res[selector]

  //     if (Object.keys(classMetadata).length ) {
  //       const newExpr = expr[selector] ? true : false
  //       let _expr = classMetadataToTailwindExp(
  //         classMetadata, selector, isInject, newExpr
  //       )

  //       res[selector].tailwindExp = _expr
  //       expr[selector] = expr[selector] || ''
  //       expr[selector] += _expr
  //     }
  //   }
  // }
}

module.exports = cssToMetadata
