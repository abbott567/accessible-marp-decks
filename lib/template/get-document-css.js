const fs = require('fs-jetpack')

async function getDocumentCSS () {
  const documentCSS = await fs.read('dist/layouts/document.css')
  return documentCSS
}

module.exports = getDocumentCSS
