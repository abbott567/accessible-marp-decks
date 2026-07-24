import hljs from 'highlight.js'
import { Marpit } from '@marp-team/marpit'
import { escapeHtml } from './escape.js'

/**
 * Create a Marpit instance configured the way this project expects:
 * HTML enabled, smart typography, and syntax highlighting via highlight.js.
 *
 * @returns {import('@marp-team/marpit').Marpit}
 */
export function createMarpit () {
  return new Marpit({
    markdown: {
      html: true,
      linkify: true,
      breaks: true,
      typographer: true,
      highlight (str, lang) {
        // `ignoreIllegals` means highlight() won't throw for a language we've
        // already confirmed is registered, so no defensive catch is needed.
        if (lang && hljs.getLanguage(lang)) {
          const highlighted = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
          return `<pre class="hljs"><code>${highlighted}</code></pre>`
        }
        return `<pre class="hljs"><code>${escapeHtml(str)}</code></pre>`
      }
    }
  })
}
