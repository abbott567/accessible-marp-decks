const fs = require('fs-jetpack')
const flags = require('./parse-cli-flags')

async function copyImages () {
  const imagesDir = fs.exists(`src/decks/${flags.deck}/images`)
  if (imagesDir) fs.copy(`src/decks/${flags.deck}/images`, `dist/decks/${flags.deck}/images`, { overwrite: true })
}

module.exports = copyImages
