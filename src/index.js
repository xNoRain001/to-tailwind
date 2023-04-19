const { writeFile } = require('fs').promises

const HTML = require('./html-parser')
const purifier = require('./purifier')
const fallback = require('./fallback')
const cssToClassMetadata = require('./css-to-class-metadata')

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

const toTailwind = async (htmlInput, cssInput, output) => {
  const { html, css } = await purifier(htmlInput, cssInput)
  const { ast, nodes: sourceNodes } = HTML.parse(html)
  const { rawCss, expr } = cssToClassMetadata(css, sourceNodes, false)
  
  importTailwind(ast) 

  await writeFile('./target/_index.css', expr)

  if (Object.keys(rawCss)) {
    // handle unsupported properties
    await fallback(rawCss)
    importCss(ast)
  }

  const res = HTML.stringify(ast)
  await writeFile(output, res)
}

module.exports = toTailwind
