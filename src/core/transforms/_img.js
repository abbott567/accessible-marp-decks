import { readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'

const MIME_BY_EXT = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.bmp': 'image/bmp',
  '.ico': 'image/x-icon'
}

/** A src that already points somewhere self-contained or remote — leave it. */
function isExternal (src) {
  return /^(https?:)?\/\//.test(src) || src.startsWith('data:')
}

/**
 * Portability pass over `<img>` elements: base64-inlines local images into
 * `data:` URIs (when `basePath` is known and `inlineAssets` is on) so the
 * rendered deck is a single, self-contained file. Remote and already-inlined
 * sources are left untouched. Image sizing is left to the theme CSS
 * (`max-inline-size: 100%`) so images scale with the slide.
 *
 * @param {import('cheerio').CheerioAPI} $
 * @param {object} [options]
 * @param {string} [options.basePath] - Directory to resolve relative srcs against.
 * @param {boolean} [options.inlineAssets=true] - Base64-inline local images.
 */
export async function modifyImg ($, { basePath, inlineAssets = true } = {}) {
  if (!inlineAssets || !basePath) return

  const images = $('img').toArray()

  for (const el of images) {
    const $img = $(el)
    const src = $img.attr('src')
    if (!src || isExternal(src)) continue

    const mime = MIME_BY_EXT[extname(src).toLowerCase()]
    if (!mime) continue

    try {
      const filePath = join(basePath, src.replace(/^\.?\//, ''))
      const data = await readFile(filePath)
      $img.attr('src', `data:${mime};base64,${data.toString('base64')}`)
    } catch {
      // Missing/unreadable asset — leave the original src so the link still resolves.
    }
  }
}
