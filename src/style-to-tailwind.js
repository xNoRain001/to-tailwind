const { stylesMap } = require("./const")
const shorthandParser = require('css-shorthand-parser')

const styleToTailwind = (selector, prop, value, specificity, classMetadata) => {
  let tailwindExp = ''
  const expOrMap = stylesMap[prop]
  const isStaticValue = typeof expOrMap === 'object'
  const key = isStaticValue ? prop : expOrMap
  const prefix = selector.endsWith(':before')
    ? 'before:'
    : selector.endsWith(':after')
      ? 'after:'
      : ''

  if (isStaticValue) {
    // position: absolute; -> absolute
    tailwindExp += `${ prefix }${ expOrMap[value] }`      
  } else {
    // width: 9999px; -> w-[9999px]
    value = String(value).replace(/\s{2,}/, ' ')
    const res = shorthandParser(prop, value)

    if (res) {
      const props = Object.keys(res)

      for (let i = 0, l = props.length; i < l; i++) {
        const prop = props[i]
        const value = res[prop]

        if (value !== 'unset') {
          styleToTailwind(selector, prop, value, specificity, classMetadata)
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
            p = p.slice(0, -1)
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
}

module.exports = styleToTailwind
