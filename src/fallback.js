const { writeFile } = require('fs').promises

const genCssText = rules => {
  let cssText = ''

  for (const prop in rules) {
    let value = rules[prop]

    value = value.startsWith('url("data:image')
      ? value.replace(/my-semicolon/, ';')
      : value
    cssText += `\r\n\t${ prop }: ${ value };`
  }

  cssText += '\r\n}\r\n\r\n'

  return cssText
}

const fallback = async (rawCss, output) => {
  let cssText = ''

  for (const selector in rawCss) {
    const isMedia = /^@media/.test(selector)
    const rules = rawCss[selector]
    cssText += `${ selector } {`

    if (isMedia) {
      // const selector = Object.keys(rules)
      // for (let i = 0, l = selector.length; i < l; i++) {
      //   const rule = selector[i]
      //   cssText += genCssText(rule)
      // }
    } else {
      cssText += genCssText(rules)
    }

    cssText += isMedia ? '\r\n}\r\n\r\n' : ''
  }

  await(writeFile(`${ output }/raw-css.css`, cssText))
}

module.exports = fallback
