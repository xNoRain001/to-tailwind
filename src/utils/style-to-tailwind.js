const { stylesMap } = require("../const")
const shorthandParser = require('css-shorthand-parser')

const styleToTailwind = (selector, prop, value, specificity, classMetadata) => {
  let tailwindExp = ''
  const expOrMap = stylesMap[prop]

  if (expOrMap) {
    const isStaticValue = typeof expOrMap === 'object'
    const key = isStaticValue ? prop : expOrMap

    if (isStaticValue) {
      // position: absolute; -> absolute
      tailwindExp += `${ expOrMap[value] }`      
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
            const index = selector.lastIndexOf(':')
            const prefix = selector.slice(index + 1)
            
            tailwindExp += `${ prefix }:${ expOrMap }-['${ content }']`
          }
        } else if (expOrMap === 'transform') {
          value.replace(/([a-z]+?)([A-Z]+)?\(([^,]+)(,.+)?\)/, (_, p, d = '', vx, vy) => {
            if (d) {
              p = p.slice(0, -1)
              d = d.toLowerCase()
              tailwindExp += `${ p }-${ d }-[${ vx }]`
            } else {
              tailwindExp += `${ p }-x-[${ vx }] ${ p }-y-[${ vx }]`
            }
          })
        } else {
          tailwindExp += `${ expOrMap }-[${ value }]`
        }
      }
    }

    classMetadata[key] = {
      tailwindExp,
      specificity
    }
  } else {
    // not support
    // console.log(prop)
  }
}

module.exports = styleToTailwind
