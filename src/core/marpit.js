import hljs from 'highlight.js'
import { Marpit } from '@marp-team/marpit'

/**
 * Escape fence content for safe use as element text. markdown-it treats a
 * returned `<pre>` block as final HTML, so anything we splice in ourselves
 * must be escaped — highlight.js escapes its own output, but the no-language
 * fallback would otherwise inject the raw fence content into the page.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeHtml (value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

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
