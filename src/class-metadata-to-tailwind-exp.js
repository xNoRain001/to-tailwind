const classMetadataToTailwindExp = (classMetadata, rawClass, isInject) => {

  let tailwindExp = rawClass 
    ? `${ rawClass }${ isInject ? '' : ' {\r\n\t@apply' } ` 
    : ''
  
  for (const key in classMetadata) {
    tailwindExp += `${ classMetadata[key].tailwindExp } `
  }

  return `${ tailwindExp.slice(0, -1) }${ isInject ? '' : '\r\n}\r\n\r\n' }`
}

module.exports = classMetadataToTailwindExp
