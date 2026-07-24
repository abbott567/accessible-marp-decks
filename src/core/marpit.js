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
  const marpit = new Marpit({
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

  // `layout:` picks a pre-built slide layout. It is sugar for the class
  // directive, so `<!-- layout: quote -->` puts `quote` on the slide's
  // <section> and the theme's `section.quote` rules take over. Like Marp's own
  // directives it applies to the following slides too; `_layout:` is the
  // one-slide (spot) form. If a slide sets both, `_class:` wins — Marpit keeps
  // one class value per slide.
  marpit.customDirectives.local.layout = (value) => {
    if (typeof value !== 'string' || value.trim() === '') return {}
    return { class: value.trim() }
  }

  return marpit
}
