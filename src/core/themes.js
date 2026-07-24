import { readFile, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))

/** Absolute path to the bundled `themes/` directory. */
export const themesDir = resolve(here, '..', '..', 'themes')

/**
 * List the names of the bundled themes (without the `.css` extension).
 *
 * @returns {Promise<string[]>}
 */
export async function listThemes () {
  const entries = await readdir(themesDir)
  return entries
    .filter(name => name.endsWith('.css') && name !== 'document.css')
    .map(name => name.replace(/\.css$/, ''))
    .sort()
}

/**
 * Resolve a theme to its CSS string. Accepts either the name of a bundled
 * theme (e.g. `"basic"`) or, if `css` is provided, returns that verbatim.
 *
 * @param {string} [name] - Bundled theme name.
 * @param {string} [css] - Raw CSS to use instead of a bundled theme.
 * @returns {Promise<string>}
 */
export async function resolveThemeCSS (name, css) {
  if (typeof css === 'string') return css
  const themeName = name || 'basic'
  const available = await listThemes()
  if (!available.includes(themeName)) {
    throw new Error(
      `Theme "${themeName}" does not exist. Available themes: ${available.join(', ')}`
    )
  }
  return readFile(join(themesDir, `${themeName}.css`), 'utf8')
}

/**
 * Read the base accessible-layout stylesheet that is always injected.
 *
 * @returns {Promise<string>}
 */
export async function readDocumentCSS () {
  return readFile(join(themesDir, 'document.css'), 'utf8')
}
