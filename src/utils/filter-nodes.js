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

  universal (nodes) {
    return nodes
  },

  element (nodes, name) {
    return nodes.filter(node => node.tagName === name)
  },

  child (nodes) {
    const res = []

    for (let i = 0, l = nodes.length; i < l; i++) {
      Array.prototype.push.apply(res, nodes[i].children)
    }

    return res
  },

  sibling (nodes) {
    const res = []

    for (let i = 0, l = nodes.length; i < l; i++) {
      const node = nodes[i]
      const { children } = node.parent
      const index = children.indexOf(node)

      for (let i = index + 1, l = children.length; i < l; i++) {
        res.push(children[i])
      }
    }

    return res
  },

  descendant (nodes) {
    const res = []

    const getDescendantNodes = (res, nodes) => {
      for (let i = 0, l = nodes.length; i < l; i++) {
        const node = nodes[i]
        const { type } = node

        if (type === 'text') {
          continue
        }

        res.push(node)
        const { children } = node

        if (children.length) {
          getDescendantNodes(res, children)
        }
      }
    }

    for (let i = 0, l = nodes.length; i < l; i++) {
      const node = nodes[i]
      getDescendantNodes(res, node.children)
    }
    
    return res
  },

  adjacent (nodes) {
    const res = []

    for (let i = 0, l = nodes.length; i < l; i++) {
      const node = nodes[i]
      const { children } = node.parent
      const index = children.indexOf(node)
      const adjacentNode = children[index + 1]
      
      adjacentNode && res.push(adjacentNode)
    }

    return res
  },

  'pseudo-class' () {},

  'pseudo-element' () {}
}

const filterNodes = (sourceNodes, selector) => {
  let nodes = sourceNodes
  const selectorNodes = spec.getNodes(selector)

  for (let i = 0, l = selectorNodes.length; i < l; i++) {
    const { type, name, value } = selectorNodes[i]
    nodes = strategies[type](nodes, name, value) || []
    // console.log(nodes)

    if (!nodes.length) {
      break
    }
  }

  return nodes
}

module.exports = filterNodes
