import matter from 'gray-matter'
import jsBeautify from 'js-beautify'
import { createMarpit } from './marpit.js'
import { resolveThemeCSS, readDocumentCSS } from './themes.js'
import { buildDocument } from './template.js'
import { applyTransforms } from './transforms/index.js'

const { html: beautifyHTML } = jsBeautify

/**
 * @typedef {object} RenderOptions
 * @property {string} [theme] - Bundled theme name (default `"basic"`).
 * @property {string} [css] - Raw theme CSS, used instead of a bundled theme.
 * @property {string} [documentCss] - Override the base accessible-layout CSS.
 * @property {number} [imageWidth=500] - Default `width` applied to images.
 * @property {string} [lang='en'] - Document language attribute.
 * @property {boolean} [prettify=true] - Pretty-print the HTML output.
 */

/**
 * Render Marp markdown into a standalone, accessible HTML document.
 *
 * @param {string} markdown - Marp markdown, including front matter.
 * @param {RenderOptions} [options]
 * @returns {Promise<string>}
 */
export async function renderDeck (markdown, options = {}) {
  const {
    theme,
    css,
    documentCss,
    imageWidth = 500,
    lang = 'en',
    prettify = true
  } = options

  const { data: deckInfo } = matter(markdown)

  const marpit = createMarpit()
  const themeCSS = await resolveThemeCSS(theme ?? deckInfo.theme, css)
  marpit.themeSet.default = marpit.themeSet.add(themeCSS)

  const { html, css: marpitCSS } = marpit.render(markdown)

  const baseCSS = documentCss ?? await readDocumentCSS()
  const combinedCSS = `${marpitCSS}${baseCSS}`

  const documentHTML = buildDocument({ html, css: combinedCSS, deckInfo, lang })
  const modifiedHTML = applyTransforms(documentHTML, { imageWidth })

  if (!prettify) return modifiedHTML
  return beautifyHTML(modifiedHTML, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: false,
    unformatted: ['code', 'pre']
  }).trim() + '\n'
}

/**
 * Extract the deck front matter (title, description, theme, …) without
 * rendering. Useful for tooling around a deck.
 *
 * @param {string} markdown
 * @returns {Record<string, unknown>}
 */
export function readDeckInfo (markdown) {
  return matter(markdown).data
}
