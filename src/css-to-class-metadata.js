const spec = require('selector-specificity')

const filterNodes = require('./filter-nodes')
const parseKeyframes = require('./parse-keyframes')
const styleToTailwind = require('./style-to-tailwind')
const parseMediaQuery = require('./parse-media-query')
const classMetadataToTailwindExp = require('./class-metadata-to-tailwind-exp')
const { deepClone } = require('./utils')

const cssStyleRuleRegexp = /}?(.*?){(.*?)}/g

const cssToClassMetadata = (css, sourceNodes, isInject) => {
  let expr = ''
  let rawCss = {}
  const res = {}

  css = parseKeyframes(css)
  css = parseMediaQuery(css)

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
            selector, prop, value, specificity, classMetadata, rawCss
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
          selector, prop, value, specificity, classMetadata, rawCss
        )
      })

      const _classMetadata = deepClone(classMetadata)
      const source = res[selector]

      if (!source) {
        res[selector] = _classMetadata
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

  if (isInject) {
    for (let i = 0, l = sourceNodes.length; i < l; i++) {
      const node = sourceNodes[i]
      const { classMetadata, attrs } = node
  
      if (classMetadata) {
        node.tailwindExp = classMetadataToTailwindExp(classMetadata, attrs.rawClass, isInject)
      }
    }
  } else {
    const keys = Object.keys(res)

    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i]
      const classMetadata = res[key]

      if (Object.keys(classMetadata).length ) {
        let _expr = classMetadataToTailwindExp(classMetadata, key, isInject)

        res[key].tailwindExp = _expr
        expr += `${ _expr }\r\n`
      }
    }
  }

  return { rawCss, expr }
}

module.exports = cssToClassMetadata
