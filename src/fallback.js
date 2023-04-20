const { writeFile } = require('fs').promises

const fallback = async (rawCss, output) => {
  let cssText = ''

  for (const selector in rawCss) {
    cssText += `${ selector } {`
    const rules = rawCss[selector]

    for (const prop in rules) {
      let value = rules[prop]

      value = value.startsWith('url("data:image')
        ? value.replace(/my-semicolon/, ';')
        : value
      cssText += `\r\n\t${ prop }: ${ value };`
    }

    cssText += '\r\n}\r\n\r\n'
  }

  await(writeFile(`${ output }/raw-css.css`, cssText))
}

module.exports = fallback
