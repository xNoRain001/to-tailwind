const classMetadataToTailwindExp = classMetadata => {
  let tailwindExp = ''

  for (const key in classMetadata) {
    tailwindExp += `${ classMetadata[key].tailwindExp } `
  }

  return tailwindExp.slice(0, -1)
}

module.exports = classMetadataToTailwindExp
