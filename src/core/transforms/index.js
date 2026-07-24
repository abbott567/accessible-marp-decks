import * as cheerio from 'cheerio'
import { modifySection } from './_section.js'
import { modifyImg } from './_img.js'
import { modifyCodeBlocks } from './_code.js'

/**
 * Apply all accessibility transforms to a full HTML document string.
 *
 * @param {string} documentHTML
 * @param {object} [options]
 * @param {string} [options.basePath] - Directory for resolving local image srcs.
 * @param {boolean} [options.inlineAssets] - Base64-inline local images.
 * @returns {Promise<string>}
 */
export async function applyTransforms (documentHTML, options = {}) {
  const $ = cheerio.load(documentHTML)
  modifySection($)
  await modifyImg($, options)
  modifyCodeBlocks($)
  return $.html()
}

export { modifySection, modifyImg, modifyCodeBlocks }
