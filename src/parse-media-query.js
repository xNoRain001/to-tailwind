const regexp = /@media([^{]*)\{(?:(?!\}\s*\}).)*/gis

const parseMediaQuery = css => {
  css = css.replace(regexp, (_, $1) => {
    return ''
  })

  return css
}

module.exports = parseMediaQuery
