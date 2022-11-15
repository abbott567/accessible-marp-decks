const pretty = require('pretty')
const fs = require('fs-jetpack')
const flags = require('./parse-cli-flags')

async function saveHTML (html) {
  const htmlPretty = pretty(html)
  await fs.write(`dist/decks/${flags.deck}/slides.html`, htmlPretty.trim())
}

module.exports = saveHTML
