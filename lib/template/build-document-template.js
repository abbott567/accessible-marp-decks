function generateDocumentHTML (html, css, deckInfo) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${deckInfo.title}</title>
        <meta name="description" content="${deckInfo.description}">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <style>${css}</style>
      </head>
      <body>
        <main>
          ${html}
        </main>
      </body>
    </html>
  `
}

module.exports = generateDocumentHTML
