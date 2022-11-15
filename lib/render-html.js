const buildDocumentTemplate = require('./template/build-document-template')
const modifyDocument = require('./template/modify-document')
const getDocumentCSS = require('./template/get-document-css')

async function renderHTML (marpit, marp) {
  const documentCSS = await getDocumentCSS()
  const combinedCSS = `${marp.css}${documentCSS}`
  const documentHTML = buildDocumentTemplate(marp.html, combinedCSS, marp.deckInfo)
  const modifiedHTML = modifyDocument(documentHTML)
  return modifiedHTML
}

module.exports = renderHTML
