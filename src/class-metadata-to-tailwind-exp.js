const classMetadataToTailwindExp = (classMetadata, selector, isInject) => {
  let tailwindExp =  `${ selector }${ isInject ? '' : ' {\r\n\t@apply' } ` 
  let helper = ''
  
  for (const key in classMetadata) {
    helper += `${ classMetadata[key].tailwindExp } `
  }

  // empty expr
  if (helper === ' ') {
    return ''
  } 

  tailwindExp += helper

  return `${ tailwindExp.slice(0, -1) }${ isInject ? '' : '\r\n}\r\n\r\n' }`
}

module.exports = classMetadataToTailwindExp
