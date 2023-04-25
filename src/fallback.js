const { writeFile } = require('fs').promises

const genCssText = (rules, isMedia) => {
  let cssText = ''

  for (const prop in rules) {
    let value = rules[prop]

    value = value.startsWith('url("data:image')
      ? value.replace(/my-semicolon/, ';')
      : value
    cssText += `\r\n\t${ isMedia ? '\t' : '' }${ prop }: ${ value };`
  }

  cssText += `\r\n${ isMedia ? '\t' : '' }}\r\n${ isMedia ? '' : '\r\n' }`

  return cssText
}

const fallback = async (rawCss, output) => {
  let cssText = ''

  for (const selectorOrRawMediaPrefix in rawCss) {
    const isMedia = /^@media/.test(selectorOrRawMediaPrefix)
    const rules = rawCss[selectorOrRawMediaPrefix]
    // `.foo {` or `@media (max-width: 1024px) {`
    cssText += `${ selectorOrRawMediaPrefix } {`

    if (isMedia) {
      for (const selector in rules) {
        cssText += `\r\n\t${ selector } { ${ genCssText(rules[selector], isMedia) }`
      }

      cssText += `}\r\n\r\n`
    } else {
      cssText += genCssText(rules)
    }
  }

  await(writeFile(`${ output }/raw-css.css`, cssText))
}

module.exports = fallback
