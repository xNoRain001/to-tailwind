const metadataToExpr = classMetadataList => {
  let expr = '' 
  const selectors = Object.keys(classMetadataList)

  for (let i = 0, l = selectors.length; i < l; i++) {
    let helper = ''
    const selector = selectors[i]
    const metadata = classMetadataList[selector]

    for (const key in metadata) {
      helper += `${ metadata[key].tailwindExp } `
    }

    // empty expr
    if (/^\s*$/.test(helper)) {
      continue
    }

    expr += `${ selector } {\r\n\t@apply ${ helper }\r\n}\r\n\r\n`
  }

  return expr
}

module.exports = metadataToExpr
