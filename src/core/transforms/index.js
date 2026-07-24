import * as cheerio from 'cheerio'
import { modifySection } from './section.js'
import { modifyImg } from './img.js'
import { modifyCodeBlocks } from './code-blocks.js'

/**
 * Apply all accessibility transforms to a full HTML document string.
 *
 * @param {string} documentHTML
 * @param {object} [options]
 * @param {number} [options.imageWidth] - Default image width (see modifyImg).
 * @returns {string}
 */
export function applyTransforms (documentHTML, options = {}) {
  const $ = cheerio.load(documentHTML)
  modifySection($)
  modifyImg($, options)
  modifyCodeBlocks($)
  return $.html()
}

export { modifySection, modifyImg, modifyCodeBlocks }
