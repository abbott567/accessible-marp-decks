import { readFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { renderDeck, readDeckInfo } from './core/render.js'
import { listThemes, themesDir } from './core/themes.js'

/**
 * Render a Marp markdown file into an accessible HTML document. Relative image
 * srcs are resolved (and inlined) against the file's own directory by default.
 *
 * @param {string} path - Path to a `.md` deck file.
 * @param {import('./core/render.js').RenderOptions} [options]
 * @returns {Promise<string>}
 */
export async function renderDeckFile (path, options = {}) {
  const markdown = await readFile(path, 'utf8')
  return renderDeck(markdown, { basePath: dirname(path), ...options })
}

export { renderDeck, readDeckInfo, listThemes, themesDir }
