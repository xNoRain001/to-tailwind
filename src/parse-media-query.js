const regexp = /(@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+[^\}]+\})/g

const parseMediaQuery = css => {
  css = css.replace(regexp, (_, $1) => {
    return ''
  })

  return css
}

module.exports = parseMediaQuery
