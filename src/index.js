const HTML = require('i-html-parser')
const { writeFile } = require('fs').promises

const purifier = require('./purifier')
const fallback = require('./fallback')
const cssToMetadata = require('./css-to-metadata')
const metadataToExpr = require('./metadata-to-expr')
const { parseKeyframes, parseMediaQuery } = require('./parser')

const strategies = {
  // @layer base
  element (nodes, selector, cssText, specificity) {},

  // @layer components
  class (nodes, selector, cssText, specificity) {}
}

const importTailwind = ast => {
  ast.children[0].children[0].children.push({
    type: 'tag',
    attrs: {
      src: 'https://cdn.tailwindcss.com'
    },
    parent: ast.children[0].children[0],
    tagName: 'script',
    children: []
  })
}

const importCss = ast => {
  ast.children[0].children[0].children.push(
    {
      type: 'tag',
      attrs: {
        rel: 'stylesheet',
        href: './index.css'
      },
      parent: ast.children[0].children[0],
      tagName: 'link',
      children: []
    },
    // {
    //   type: 'tag',
    //   attrs: {
    //     rel: 'stylesheet',
    //     href: './media.css'
    //   },
    //   parent: ast.children[0].children[0],
    //   tagName: 'link',
    //   children: []
    // }
  )
}

const toTailwind = async (htmlInput, cssInput, output, isInject = false) => {
  let { html, css } = await purifier(htmlInput, cssInput)
  const { ast, nodes: sourceNodes } = HTML.parse(html)
  const rawCss = {}
  const classMetadataList = {}

  css = parseKeyframes(css)
  css = parseMediaQuery(rawCss, classMetadataList, css, sourceNodes, isInject)
  cssToMetadata('', css, sourceNodes, isInject, rawCss, classMetadataList)
  
  if (isInject) {
    importTailwind(ast) 
    const res = HTML.stringify(ast)
    await writeFile(`${ output }/index.html`, res)
  } else {
    const expr = metadataToExpr(classMetadataList)
    await writeFile(`${ output }/index.css`, expr)
  }

  if (Object.keys(rawCss).length) {
    // handle unsupported properties
    await fallback(rawCss, output)
    // importCss(ast)
  }
}

module.exports = toTailwind
