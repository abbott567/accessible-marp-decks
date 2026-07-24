import { readFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { renderDeck, readDeckInfo } from './core/render.js'

/**
 * @typedef {object} PluginOptions
 * @property {string} [extension='deck'] - File extension that marks a deck.
 *   Deck files contain Marp markdown. Defaults to `deck` (e.g. `talk.deck`) so
 *   it never clobbers your site's normal `.md` files. Set to `md` to treat
 *   *every* markdown file as a deck (this fully overrides Eleventy's built-in
 *   markdown rendering).
 * @property {string} [theme] - Force a theme for all decks. When omitted, each
 *   deck's own front-matter `theme` (falling back to the default) is used.
 * @property {string} [lang] - Document language attribute.
 */

/**
 * Eleventy plugin: render Marp decks as accessible HTML pages.
 *
 * Thin wrapper around {@link renderDeck} — all rendering logic lives in the
 * core engine; this only wires it into Eleventy's template pipeline.
 *
 * @param {import('@11ty/eleventy').UserConfig} eleventyConfig
 * @param {PluginOptions} [options]
 */
export default function accessibleMarpPlugin (eleventyConfig, options = {}) {
  const {
    extension = 'deck',
    theme,
    lang
  } = options

  eleventyConfig.addTemplateFormats(extension)

  eleventyConfig.addExtension(extension, {
    // We read the raw file ourselves so Marp's front-matter directives survive.
    read: false,
    getData: async (inputPath) => {
      const markdown = await readFile(inputPath, 'utf8')
      return readDeckInfo(markdown)
    },
    compile: (_inputContent, inputPath) => async (data) => {
      const markdown = await readFile(inputPath, 'utf8')
      return renderDeck(markdown, {
        theme: theme ?? data?.theme,
        basePath: dirname(inputPath),
        lang: lang ?? data?.lang
      })
    }
  })
}

export { renderDeck, readDeckInfo }
