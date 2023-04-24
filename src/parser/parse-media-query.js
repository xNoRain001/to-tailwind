const cssToMetadata = require("../css-to-metadata")

const regexp = /@media\((.*?):(.*?)\){((?:(?!}}).)+)}/g

const parseMediaQuery = (rawCss, classMetadataList, css, sourceNode, isInject) => {
  const breakPoints = {
    'min-width': [],
    'max-width': [],
    'min-height': [],
    'max-height': []
  }

  css = css.replace(regexp, (_, p, v, cssText) => {
    breakPoints[p].push(({ 
      size: parseInt(v),
      cssText: `${ cssText }}` 
    }))

    return ''
  })

  const props = Object.keys(breakPoints)

  for (let i = 0, l = props.length; i < l; i++) {
    const prop = props[i]

    if (prop.startsWith('max')) {
      breakPoints[prop].sort((a, b) => b.size - a.size)
    } else {
      breakPoints[prop].sort((a, b) => a.size - b.size)
    }
  }

  const maxWidthList = breakPoints['max-width']

  for (let i = 0, l = maxWidthList.length; i < l; i++) {
    const { size, cssText } = maxWidthList[i]
    cssToMetadata(`${ size }:`, cssText, sourceNode, isInject, rawCss, classMetadataList)
  }

  return css
}

module.exports = parseMediaQuery
