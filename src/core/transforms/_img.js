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

/** Matches the first url(...) token in a CSS value, quoted or bare. */
const CSS_URL_RE = /url\(\s*(['"]?)([^'")]+)\1\s*\)/

/** A src that already points somewhere self-contained or remote — leave it. */
function isExternal (src) {
  return /^(https?:)?\/\//.test(src) || src.startsWith('data:')
}

/**
 * Read a local asset and return it as a `data:` URI, or `null` when it can't
 * be inlined (unknown type, missing or unreadable file).
 *
 * Srcs are written as URLs, so before touching the filesystem the query string
 * and fragment are dropped and percent-escapes decoded — `my%20image.png?v=2`
 * resolves to `my image.png` on disk.
 *
 * @param {string} src - Relative source path from the markup.
 * @param {string} basePath - Directory to resolve `src` against.
 * @returns {Promise<string | null>}
 */
async function toDataURI (src, basePath) {
  const cleaned = src.split(/[?#]/)[0]
  let decoded
  try {
    decoded = decodeURIComponent(cleaned)
  } catch {
    // Malformed percent-escapes — fall back to the raw path.
    decoded = cleaned
  }

  const mime = MIME_BY_EXT[extname(decoded).toLowerCase()]
  if (!mime) return null

  try {
    const filePath = join(basePath, decoded.replace(/^\.?\//, ''))
    const data = await readFile(filePath)
    return `data:${mime};base64,${data.toString('base64')}`
  } catch {
    // Missing/unreadable asset — caller leaves the original reference intact.
    return null
  }
}

/**
 * Portability pass over the deck's images: base64-inlines local assets into
 * `data:` URIs (when `basePath` is known and `inlineAssets` is on) so the
 * rendered deck is a single, self-contained file. Covers both `<img>` elements
 * and slide background images (Marp's `![bg](…)` becomes a `background-image`
 * style on the section). Remote and already-inlined sources are left untouched.
 * Image sizing is left to the theme CSS so images scale with the slide.
 *
 * @param {import('cheerio').CheerioAPI} $
 * @param {object} [options]
 * @param {string} [options.basePath] - Directory to resolve relative srcs against.
 * @param {boolean} [options.inlineAssets=true] - Base64-inline local images.
 */
export async function modifyImg ($, { basePath, inlineAssets = true } = {}) {
  if (!inlineAssets || !basePath) return

  for (const el of $('img').toArray()) {
    const $img = $(el)
    const src = $img.attr('src')
    if (!src || isExternal(src)) continue

    const dataURI = await toDataURI(src, basePath)
    if (dataURI) $img.attr('src', dataURI)
  }

  // Slide backgrounds: ![bg](…) ends up as url(...) inside the section's
  // style attribute, which <img>-only inlining would miss.
  for (const el of $('section[style]').toArray()) {
    const $section = $(el)
    const style = $section.attr('style')
    const match = CSS_URL_RE.exec(style)
    if (!match) continue

    const src = match[2]
    if (isExternal(src)) continue

    const dataURI = await toDataURI(src, basePath)
    if (dataURI) $section.attr('style', style.replace(match[0], `url("${dataURI}")`))
  }
}
