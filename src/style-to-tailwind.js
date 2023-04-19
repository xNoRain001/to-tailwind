const shorthandParser = require('css-shorthand-parser')

const { stylesMap } = require("./const")

const rawCssCollector = (rawCss, selector, prop, value) => {
  rawCss[selector] = rawCss[selector] || {}
  rawCss[selector][prop] = value 
}

const prefixParser = selector => {
  let prefix = ''

  selector.replace(/:([a-z]+)/, (_, $1) => {
    prefix = `${ $1 }:`
  })
  
  return prefix
}

const styleToTailwind = (
  selector, prop, value, specificity, classMetadata, rawCss
) => {
  if (stylesMap[prop]) {
    if (value.startsWith('url("data:image')) {
      value = value.replace(/my-semicolon/g, ';')
    }

    let tailwindExp = ''
    const expOrMap = stylesMap[prop]
    const isStaticValue = typeof expOrMap === 'object'
    const key = isStaticValue ? prop : expOrMap
    const prefix = prefixParser(selector)
    
    if (isStaticValue) {
      const keywordValue = expOrMap[value]

      if (keywordValue) {
        // position: absolute; -> absolute  
        tailwindExp += `${ prefix }${ expOrMap[value] } `  
      } else {
        rawCssCollector(rawCss, selector, prop, value)
      }
    } else {
      // width: 9999px; -> w-[9999px]
      value = value.replace(/\s{2,}/, ' ')
      const res = shorthandParser(prop, value)

      if (res) {
        const props = Object.keys(res)

        for (let i = 0, l = props.length; i < l; i++) {
          const prop = props[i]
          const value = res[prop]

          if (value !== 'unset') {
            styleToTailwind(
              selector, prop, value, specificity, classMetadata, rawCss
            )
          }
        }
      } else {
        if (expOrMap === 'content') {
          const content = value.match(/['"](.*?)['"]/)[1]

          if (content) {
            tailwindExp += `${ prefix }${ expOrMap }-['${ content }']`
          }
        } else if (expOrMap === 'transform') {
          value.replace(/([a-z]+?)([A-Z]+)?\(([^,]+)(,.+)?\)/, (_, p, d = '', vx, vy) => {
            if (d) {
              d = d.toLowerCase()
              tailwindExp += `${ prefix }${ p }-${ d }-[${ vx }]`
            } else {
              tailwindExp += `${ prefix }${ p }-x-[${ vx }] ${ p }-y-[${ vx }]`
            }
          })
        } else {
          tailwindExp += `${ prefix }${ expOrMap }-[${ value }]`
        }
      }
    }

    classMetadata[key] = {
      tailwindExp,
      specificity
    }
  } else {
    rawCssCollector(rawCss, selector, prop, value)
  }
}

module.exports = styleToTailwind
