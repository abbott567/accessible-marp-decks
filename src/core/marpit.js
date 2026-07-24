import hljs from 'highlight.js'
import { Marpit } from '@marp-team/marpit'

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
        if (lang && hljs.getLanguage(lang)) {
          try {
            return '<pre class="hljs"><code>' +
              hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
              '</code></pre>'
          } catch {}
        }
        return '<pre class="hljs"><code>' + str + '</code></pre>'
      }
    }
  })
}
