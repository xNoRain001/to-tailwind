const regexp = /@keyframes\s([^{]+)\{(?:(?!\}\s*\}).)*}}/gis

const parseKeyframes = css => {
  css = css.replace(regexp, (_, $1) => {
    return ''
  })

  return css
}

module.exports = parseKeyframes
