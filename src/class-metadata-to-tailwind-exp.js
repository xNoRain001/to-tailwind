const classMetadataToTailwindExp = (classMetadata, rawClass, flag) => {

  let tailwindExp = rawClass 
    ? `${ rawClass }${ flag ? ' { @apply' : '' } ` 
    : ''
  
  for (const key in classMetadata) {
    tailwindExp += `${ classMetadata[key].tailwindExp } `
  }

  return `${ tailwindExp.slice(0, -1) }${ flag ? ' }' : '' }`
}

module.exports = classMetadataToTailwindExp
