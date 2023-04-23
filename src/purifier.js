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
  
  // .foo{color:red} -> .foo{color:red;}
  css = css.replace(/([^;])}/g, (_, $1) => `${ $1 };}`)

  // replace base64's semicolon
  // background-image: url(data:...);
  // background: url(data...) no-repeat ...;
  css = css.replace(/data:(.*?)\)([\s;])/g, (_, $1, $2) => {
    return `data:${ $1.replace(/;/g, 'my-semicolon') })${ $2 }`
  })

  return {
    html,
    css
  }
}

module.exports = purifier
