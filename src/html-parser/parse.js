const selfClosingTags = require('./self-closing-tags')

const regexp = /<[\s\S]*?>[^<]*/g
const documentType = '<!DOCTYPE html>'

const parse = html => {
  html = html.trim()

  if (html.startsWith(documentType)) {
    html = html.slice(documentType.length)
  }

  const ast = {
    type: 'root',
    attrs: {},
    parent: null,
    tagName: null,
    children: []
  }
  const matched = html.match(regexp)
  const nodes = []
  let parent = ast

  for (let i = 0, l = matched.length; i < l; i++) {
    // <html lang="en">
    // <input foo="bar" />
    // <title>Document
    // <div foo="bar">foo
    // </div>
    let m = matched[i].trim()

    if (!m.startsWith('</')) {
      // <html lang="en"> -> html lang="en">
      m = m.slice(1)

      const tagName = m.match(/[^\s>]*/)[0]
      const attrs = {}
      const node = {
        type: 'tag',
        attrs,
        parent,
        tagName,
        children: []
      }
    
      // div foo="bar">foo -> foo="bar">foo
      // html lang="en"> -> lang="en">
      // title>Document -> >Document
      m = m.slice(tagName.length).trimStart()

      if (m !== '>') {
        // >Document
        if (m.startsWith('>')) {
          node.children.push({
            type: 'text',
            text: m.slice(1).trimStart()
          })
        } else {
          // lang="en">
          // foo="bar">foo
          m.replace(/\s*(.*?)=['"]\s*([\s\S]*?)\s*['"]/g, (_, attr, value) => {
            let formattedValue = {}
            
            if (attr === 'style') {
              value.replace(
                /\s*(.*?)\s*:\s*(.*?)\s*[;]/g, 
                (_, styleName, styleValue) => {
                  formattedValue[styleName] = styleValue
                }
              )
            } else if (attr === 'class') {
              const segments = value.split(/\s+/)

              for (let i = 0, l = segments.length; i < l; i++) {
                formattedValue[segments[i]] = null
              }
            }
              
            attrs[attr] = Object.keys(formattedValue).length
              ? formattedValue
              : value
          })

          const text = m.match(/>([\s\S]*)/)[1]
          
          if (text) {
            node.children.push({
              type: 'text',
              text
            }) 
          }
        }
      }

      parent.children.push(node)
      nodes.push(node)

      if (!selfClosingTags.hasOwnProperty(tagName)) {
        parent = node
      }
    } else {
      parent = parent.parent
    }
  }

  return { ast, nodes }
}

module.exports = parse
