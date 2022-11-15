const fs = require('fs-jetpack')
const flags = require('./parse-cli-flags')

async function copyDemos () {
  const imagesDir = fs.exists(`src/decks/${flags.deck}/demos`)
  if (imagesDir) {
    fs.copy(`src/decks/${flags.deck}/demos`, `dist/decks/${flags.deck}/demos`, { overwrite: true })
  }
}

module.exports = copyDemos
