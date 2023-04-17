const classMetadataToTailwindExp = (classMetadata, rawClass) => {

  let tailwindExp = rawClass ? `${ rawClass } ` : ''
  
  for (const key in classMetadata) {
    tailwindExp += `${ classMetadata[key].tailwindExp } `
  }

  return tailwindExp.slice(0, -1)
}

module.exports = classMetadataToTailwindExp
