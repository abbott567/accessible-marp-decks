const fs = require('fs-jetpack')
const flags = require('./parse-cli-flags')

async function loadTheme (marpit) {
  let theme
  if (flags.theme) {
    const exists = fs.exists(`dist/themes/${flags.theme}.css`)
    if (exists) theme = await fs.read(`dist/themes/${flags.theme}.css`)
    else throw Error('Theme does not exists')
  } else {
    theme = await fs.read('dist/themes/purple-theme.css')
  }
  marpit.themeSet.default = marpit.themeSet.add(theme)
}

module.exports = loadTheme
