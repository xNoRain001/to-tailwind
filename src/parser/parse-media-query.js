const regexp = /@media\((.*?):(.*?)\){(?:(?!}}).)*}}/gis

const parseMediaQuery = css => {
  const breakPoints = {
    'min-width': [],
    'max-width': [],
    'min-height': [],
    'max-height': []
  }

  css = css.replace(regexp, (_, p, v, cssText) => {
    breakPoints[p].push(parseInt(v))

    return ''
  })

  const props = Object.keys(breakPoints)

  for (let i = 0, l = props.length; i < l; i++) {
    const prop = props[i]

    if (prop.startsWith('max')) {
      breakPoints[prop].sort((a, b) => b - a)
    } else {
      breakPoints[prop].sort((a, b) => a - b)
    }
  }

  return css
}

module.exports = parseMediaQuery
