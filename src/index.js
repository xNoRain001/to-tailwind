const HTML = require('./html-parser')
const spec = require('selector-specificity')
const { readFile, writeFile } = require('fs').promises

const { stylesMap } = require('./const')
const { 
  deepClone,
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
  let css = await readFile(cssInput, 'utf-8')
  let html = await readFile(htmlInput, 'utf-8')

  // remove commented code
  css = css.replace(/\/\*[\s\S]*?\*\//g, '')
  html = html.replace(/<!--[\s\S]*?-->/g, '')

  css = css.replace(/url\(['"](.*?)['"]\)/g, (_, $1) => {
    return `url("${ $1.replace(/;/g, 'my-semicolon') }")`
  })

  const { ast, nodes: sourceNodes } = HTML.parse(html)

  let rawCss = {}

  css.replace(cssStyleRuleRegexp, (cssStyleRule, selector, cssText) => {
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

  // import tailwind for test
  ast.children[0].children[0].children.push({
    type: 'tag',
    attrs: {
      src: 'https://cdn.tailwindcss.com'
    },
    parent: ast.children[0].children[0],
    tagName: 'script',
    children: []
  }, {
    type: 'tag',
    attrs: {
      rel: 'stylesheet',
      href: './index.css'
    },
    parent: ast.children[0].children[0],
    tagName: 'link',
    children: []
  })
  
  const res = HTML.stringify(ast)
  await writeFile(output, res)

  let _rawCss = ''
  for (const selector in rawCss) {
    _rawCss += `${ selector } {`
    const rules = rawCss[selector]

    for (const prop in rules) {
      let value = rules[prop]
      value = value.startsWith('url("data:image')
        ? value.replace(/my-semicolon/, ';')
        : value
      _rawCss += `${ prop }: ${ value };`
    }

    _rawCss += '}\r\n'
  }
  await(writeFile('./target/index.css', _rawCss))
}

module.exports = toTailwind
