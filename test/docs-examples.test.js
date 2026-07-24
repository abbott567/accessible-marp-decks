import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import * as cheerio from 'cheerio'
import { renderDeck } from '../src/index.js'

const here = dirname(fileURLToPath(import.meta.url))
const docs = await readFile(join(here, '..', 'docs', 'layouts.md'), 'utf8')

// Every fenced html example in the layout docs, exactly as a reader would copy it.
const htmlExamples = [...docs.matchAll(/```html\n([\s\S]*?)```/g)].map(m => m[1])

test('docs/layouts.md contains the documented HTML examples', () => {
  assert.ok(htmlExamples.length >= 4, `found ${htmlExamples.length} html examples`)
})

test('every HTML example in docs/layouts.md renders with its classes styled', async () => {
  for (const example of htmlExamples) {
    const deck = `---\nmarp: true\ntheme: basic\n---\n\n# Example\n\n${example}\n`
    const html = await renderDeck(deck, { prettify: false })
    const $ = cheerio.load(html)

    const classes = new Set()
    for (const m of example.matchAll(/class="([^"]+)"/g)) {
      m[1].split(/\s+/).forEach((c) => classes.add(c))
    }
    assert.ok(classes.size > 0, 'example uses at least one helper class')

    for (const cls of classes) {
      // The class must survive Marp's rendering into the slide…
      assert.ok($(`section .${cls}`).length > 0, `class "${cls}" survives in the rendered slide`)
      // …and the theme must actually define a rule for it.
      assert.match(html, new RegExp(`\\.${cls}[\\s,{.:>]`), `theme styles .${cls}`)
    }
  }
})

test('the documented _class directive example styles the slide', async () => {
  // The markdown example in the docs uses <!-- _class: cover -->; rendering it
  // must yield a section that the theme's slide-level rule can match.
  const mdExample = docs.match(/```markdown\n([\s\S]*?)```/)
  assert.ok(mdExample, 'docs contain the markdown directive example')
  const deck = `---\nmarp: true\ntheme: basic\n---\n\n${mdExample[1]}`
  const html = await renderDeck(deck, { prettify: false })
  const $ = cheerio.load(html)
  assert.ok($('section.cover').length > 0, 'section carries the directive class')
  assert.match(html, /div\.marpit\s*>\s*section\.cover/, 'a matchable slide-level rule exists')
})
