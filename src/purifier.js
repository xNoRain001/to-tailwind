const { readFile } = require('fs').promises

const purifier = async (htmlInput, cssInput) => {
  let css = await readFile(cssInput, 'utf-8')
  let html = await readFile(htmlInput, 'utf-8')

  // remove commented code
  css = css.replace(/\/\*[\s\S]*?\*\//g, '')
  html = html.replace(/<!--[\s\S]*?-->/g, '')

  // remove unnecessary white space
  css = css
    .replace(/\s{2,}/g, ' ')
    .replace(/\s?([{},:;])\s?/g, (_, $1) => $1)
    .replace(/\(\s/, '(')
    .replace(/\s\)/, ')')
    .trim()

  // replace ;
  css = css.replace(/url\(['"](.*?)['"]\)/g, (_, $1) => {
    return `url("${ $1.replace(/;/g, 'my-semicolon') }")`
  })
  // css = css.replace(/url\((['"]?)(data:.*?)['"]?\)/g, (_, $1, $2) => {
  //   return `url(${ $1 }${ $2.replace(/;/g, 'my-semicolon') }${ $1 })`
  // })

  return {
    html,
    css
  }
}

module.exports = purifier
