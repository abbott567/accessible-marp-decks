import { escapeHtml } from './escape.js'
import { pageScript } from './runtime-script.js'

/**
 * Build the outer HTML document shell that wraps the rendered slides.
 *
 * @param {object} params
 * @param {string} params.html - Marpit-rendered slide markup.
 * @param {string} params.css - Combined CSS to inline in the document head.
 * @param {object} [params.deckInfo] - Front-matter info (`title`, `description`).
 * @param {string} [params.lang] - Document language. Defaults to `"en"`.
 * @param {boolean} [params.runtimeScript] - Inline the code-block scrolling
 *   enhancement script. Defaults to `true`; set `false` for strict-CSP hosts.
 * @returns {string}
 */
export function buildDocument ({ html, css, deckInfo = {}, lang = 'en', runtimeScript = true }) {
  const title = escapeHtml(deckInfo.title)
  const description = escapeHtml(deckInfo.description)

  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}">
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
    ${runtimeScript ? pageScript : ''}
  </body>
</html>`
}
