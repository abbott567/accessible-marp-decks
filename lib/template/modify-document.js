const cheerio = require('cheerio')

function modifyDocument (documentHTML) {
  const $ = cheerio.load(documentHTML)
  const modifySection = require('./modify-section.js')
  const modifyImg = require('./modify-img.js')
  const modifyCodeBlocks = require('./modify-code-blocks.js')
  modifySection($)
  modifyImg($)
  modifyCodeBlocks($)
  return $.html()
}

module.exports = modifyDocument
