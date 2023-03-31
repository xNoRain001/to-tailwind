const spec = require('selector-specificity')

const strategies = {
  id (nodes, name) {
    return nodes.filter(node => node.id === name)
  },

  class (nodes, name) {
    return nodes.filter(node => node.classList?.hasOwnProperty(name))
  },
 
  attribute (nodes, name, value) {
    return nodes.filter(node => node.attrs[name] === value)
  },

  universal () {

  },

  element (nodes, name) {
    return nodes.filter(node => node.tagName === name)
  },

  child (nodes) {
    return nodes.children
  },

  sibling () {},

  descendant () {},

  adjacent () {},

  'pseudo-class' () {},

  'pseudo-element' () {}
}

const filterNodes = (sourceNodes, selector) => {
  let nodes = sourceNodes
  const selectorNodes = spec.getNodes(selector)

  for (let i = 0, l = selectorNodes.length; i < l; i++) {
    const { type, name, value } = selectorNodes[i]
    nodes = strategies[type](nodes, name, value) || []

    if (!nodes.length) {
      break
    }
  }

  return nodes
}

module.exports = filterNodes
