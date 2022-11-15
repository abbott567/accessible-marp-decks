const fs = require('fs-jetpack')
const flags = require('./parse-cli-flags')

async function renderMarpDeck (marpit) {
  const markdown = await fs.read(`src/decks/${flags.deck}/slides.md`)
  const sectionOne = markdown.split('---')[1].trim()
  const data = sectionOne.split(/\n+/).map(line => line.split(': '))
  const deckInfo = Object.fromEntries(data)
  const { html, css, comments } = await marpit.render(markdown)
  return {
    deckInfo,
    html,
    css,
    comments
  }
}

module.exports = renderMarpDeck
