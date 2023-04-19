const classMetadataToTailwindExp = (classMetadata, rawClass, isInject) => {

  let tailwindExp = rawClass 
    ? `${ rawClass }${ isInject ? '' : ' { @apply' } ` 
    : ''
  
  for (const key in classMetadata) {
    tailwindExp += `${ classMetadata[key].tailwindExp } `
  }

  return `${ tailwindExp.slice(0, -1) }${ isInject ? '' : ' }' }`
}

module.exports = classMetadataToTailwindExp
