const buildMarpit = require('./marpit')
const renderMarpDeck = require('./render-marp-deck')
const renderHTML = require('./render-html')
const saveHTML = require('./save-html')
const copyDemos = require('./copy-demos')
const copyImages = require('./copy-images')

async function build () {
  const marpit = await buildMarpit()
  const marpDeck = await renderMarpDeck(marpit)
  const html = await renderHTML(marpit, marpDeck)
  await saveHTML(html)
  await copyImages()
  await copyDemos()
}

build()
