const hljs = require('highlight.js')
const { Marpit } = require('@marp-team/marpit')
const loadTheme = require('./load-theme')

async function buildMarpit () {
  const marpit = new Marpit({
    markdown: {
      html: true,
      linkify: true,
      breaks: true,
      typographer: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return '<pre class="hljs"><code>' +
              hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
              '</code></pre>'
          } catch (__) {}
        }
        return '<pre class="hljs"><code>' + str + '</code></pre>'
      }
    }
  })

  await loadTheme(marpit)
  return marpit
}

module.exports = buildMarpit
