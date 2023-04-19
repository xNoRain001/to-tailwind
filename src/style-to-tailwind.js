const shorthandParser = require('css-shorthand-parser')

const { stylesMap } = require("./const")

const rawCssCollector = (rawCss, selector, prop, value) => {
  rawCss[selector] = rawCss[selector] || {}
  rawCss[selector][prop] = value 
}

const prefixParser = selector => {
  let prefixs = []

  selector.replace(/:([a-z]+)/g, (_, $1) => {
    prefixs.push(`${ $1 }:`)
  })
  
  return prefixs.length ? prefixs : ['']
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
    const prefixs = prefixParser(selector)
    
    if (isStaticValue) {
      const keywordValue = expOrMap[value]

      if (keywordValue) {
        // position: absolute; -> absolute 
        for (let i = 0, l = prefixs.length; i < l; i++) {
          tailwindExp += `${ prefixs[i] }${ expOrMap[value] } `  
        } 
      } else {
        rawCssCollector(rawCss, selector, prop, value)
      }
    } else {
      // width: 9999px; -> w-[9999px]
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
            for (let i = 0, l = prefixs.length; i < l; i++) {
              tailwindExp += `${ prefixs[i] }${ expOrMap }-['${ content }' `  
            } 
          }
        } else if (expOrMap === 'transform') {
          value.replace(/([a-z]+?)([A-Z]+)?\(([^,]+)(,.+)?\)/, (_, p, d = '', vx, vy) => {
            if (d) {
              d = d.toLowerCase()

              for (let i = 0, l = prefixs.length; i < l; i++) {
                tailwindExp += `${ prefixs[i] }${ p }-${ d }-[${ vx }]`
              } 
            } else {
              for (let i = 0, l = prefixs.length; i < l; i++) {
                tailwindExp += `${ prefixs[i] }${ p }-x-[${ vx }] ${ p }-y-[${ vx }]`
              } 
            }
          })
        } else {
          for (let i = 0, l = prefixs.length; i < l; i++) {
            tailwindExp += `${ prefixs[i] }${ expOrMap }-[${ value }]`
          } 
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
