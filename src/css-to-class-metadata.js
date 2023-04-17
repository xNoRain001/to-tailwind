const spec = require('selector-specificity')

const filterNodes = require('./filter-nodes')
const styleToTailwind = require('./style-to-tailwind')
const classMetadataToTailwindExp = require('./class-metadata-to-tailwind-exp')
const { stylesMap } = require('./const')
const { deepClone } = require('./utils')

const cssStyleRuleRegexp = /}?\s*([\s\S]*?)\s*{\s*([\s\S]*?)\s*}/g

const cssToClassMetadata = (css, sourceNodes) => {
  let rawCss = {}

  css.replace(cssStyleRuleRegexp, (_, selector, cssText) => {
    // empty rule -> .foo {}
    if (!cssText) {
      return
    }

    const nodes = filterNodes(sourceNodes, selector)

    if (nodes.length) {
      const specificity = spec.getSpecificity(selector)
      const classMetadata = {}

      // TODO: why /\s*(.*?)\s*:\s*(.*?);?/g doesn't work ?
      cssText.replace(/\s*(.*?)\s*:\s*([^;]*);?/g, (_, prop, value) => {
        if (stylesMap[prop]) {
          if (value.startsWith('url("data:image')) {
            value = value.replace(/my-semicolon/g, ';')
          }

          styleToTailwind(selector, prop, value, specificity, classMetadata)
        } else {
          rawCss[selector] = rawCss[selector] || {}
          rawCss[selector][prop] = value
        }
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
  })

  for (let i = 0, l = sourceNodes.length; i < l; i++) {
    const node = sourceNodes[i]
    const { classMetadata, attrs } = node

    if (classMetadata) {
      node.tailwindExp = classMetadataToTailwindExp(classMetadata, attrs.rawClass)
    }
  }

  return rawCss
}

module.exports = cssToClassMetadata
