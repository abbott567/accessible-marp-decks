/**
 * Escape a string for safe insertion into an HTML attribute value.
 *
 * @param {unknown} value
 * @returns {string}
 */
function escapeAttr (value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Build the outer HTML document shell that wraps the rendered slides.
 *
 * @param {object} params
 * @param {string} params.html - Marpit-rendered slide markup.
 * @param {string} params.css - Combined CSS to inline in the document head.
 * @param {object} [params.deckInfo] - Front-matter info (`title`, `description`).
 * @param {string} [params.lang] - Document language. Defaults to `"en"`.
 * @returns {string}
 */
export function buildDocument ({ html, css, deckInfo = {}, lang = 'en' }) {
  const title = escapeAttr(deckInfo.title ?? '')
  const description = escapeAttr(deckInfo.description ?? '')

  return `<!DOCTYPE html>
<html lang="${escapeAttr(lang)}">
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${css}</style>
  </head>
  <body>
    <main>
      ${html}
    </main>
  </body>
</html>`
}
