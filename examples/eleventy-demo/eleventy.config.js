import accessibleMarp from 'accessible-marp-decks/eleventy'

// Demo Eleventy site showing the accessible-marp-decks plugin.
// Run from this directory:  npx @11ty/eleventy
export default function (eleventyConfig) {
  eleventyConfig.addPlugin(accessibleMarp, {
    // Force a theme for every deck (omit to honour each deck's front matter).
    theme: 'basic'
  })

  return {
    dir: {
      input: 'content',
      output: '_site'
    }
  }
}
