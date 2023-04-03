const HTML = require('./html-parser')
const spec = require('selector-specificity')
const { readFile, writeFile } = require('fs').promises

const { 
  filterNodes, 
  styleToTailwind, 
  classMetadataToTailwindExp 
} = require('./utils')

const cssStyleRuleRegexp = /}?\s*([\s\S]*?)\s*{\s*([\s\S]*?)\s*}/g

const strategies = {
  // @layer base
  element (nodes, selector, cssText, specificity) {

  },

  class (nodes, selector, cssText, specificity) {

  }
}

const toTailwind = async (htmlInput, cssInput, output) => {
  const html = await readFile(htmlInput, 'utf-8')
  const css = await readFile(cssInput, 'utf-8')
  const { ast, nodes: sourceNodes } = HTML.parse(html)

  // TODO: /* foo */
  css.replace(cssStyleRuleRegexp, (_, selector, cssText) => {
    // .foo {}
    if (!cssText) {
      return
    }

    const nodes = filterNodes(sourceNodes, selector)

    if (nodes.length) {
      const specificity = spec.getSpecificity(selector)
      const classMetadata = {}

      // TODO: why /\s*(.*?)\s*:\s*(.*?);?/g doesn't work ?
      cssText.replace(/\s*(.*?)\s*:\s*([^;]*);?/g, (_, prop, value) => {
        styleToTailwind(prop, value, specificity, classMetadata)
      })

      for (let i = 0, l = nodes.length; i < l; i++) {
        const node = nodes[i]
        const source = node.classMetadata

        if (!source) {
          node.classMetadata = classMetadata
        } else {
          for (const key in classMetadata) {
            const value = classMetadata[key]

            if (!source[key]) {
              source[key] = value
            } else if (source[key].specificity <= value.specificity) {
              source[key] = value
            }
          }
        }
      }
    }
  })

  for (let i = 0, l = sourceNodes.length; i < l; i++) {
    const node = sourceNodes[i]
    const { classMetadata } = node

    if (classMetadata) {
      node.tailwindExp = classMetadataToTailwindExp(classMetadata)
    }
  }

  const res = HTML.stringify(ast)
  await writeFile(output, res)
}

module.exports = toTailwind
