const HTML = require('./html-parser')
const spec = require('selector-specificity')
const { readFile } = require('fs').promises

const { filterNodes, styleToTailwind } = require('./utils')

const cssStyleRuleRegexp = /}?\s*([\s\S]*?)\s*{\s*([\s\S]*?)\s*}/g

const strategies = {
  // @layer base
  element (nodes, selector, cssText, specificity) {

  },

  class (nodes, selector, cssText, specificity) {

  }
}

;(async () => {
  const css = await readFile('../test/index.css', 'utf-8')
  const html = await readFile('../test/index.html', 'utf-8')
  const sourceNodes = HTML.parse(html).nodes

  // TODO: /* foo */
  css.replace(cssStyleRuleRegexp, (_, selector, cssText) => {
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

    console.log(nodes)
  })

  // const res = sourceNodes.filter(node => node.tagName === 'input')
  // console.log(res[0].classMetadata)
})()
