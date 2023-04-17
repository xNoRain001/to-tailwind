const { writeFile } = require('fs').promises

const fallback = async rawCss => {
  let cssText = ''

  for (const selector in rawCss) {
    cssText += `${ selector } {`
    const rules = rawCss[selector]

    for (const prop in rules) {
      let value = rules[prop]

      value = value.startsWith('url("data:image')
        ? value.replace(/my-semicolon/, ';')
        : value
      cssText += `${ prop }: ${ value };`
    }

    cssText += '}\r\n'
  }

  await(writeFile('./target/index.css', cssText))
}

module.exports = fallback