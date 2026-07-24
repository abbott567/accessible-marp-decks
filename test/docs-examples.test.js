import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import * as cheerio from 'cheerio'
import { renderDeck } from '../src/index.js'

const here = dirname(fileURLToPath(import.meta.url))
// Normalise line endings so the fence regexes work on CRLF checkouts too.
const docs = (await readFile(join(here, '..', 'docs', 'layouts.md'), 'utf8')).replace(/\r\n/g, '\n')

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

// All fenced markdown examples in the layout docs.
const mdExamples = [...docs.matchAll(/```markdown\n([\s\S]*?)```/g)].map(m => m[1])

test('the documented _class directive example styles the slide', async () => {
  // The docs include a <!-- _class: cover --> example; rendering it must yield
  // a section that the theme's slide-level rule can match.
  const mdExample = mdExamples.find(e => e.includes('_class: cover'))
  assert.ok(mdExample, 'docs contain the markdown directive example')
  const deck = `---\nmarp: true\ntheme: basic\n---\n\n${mdExample}`
  const html = await renderDeck(deck, { prettify: false })
  const $ = cheerio.load(html)
  assert.ok($('section.cover').length > 0, 'section carries the directive class')
  assert.match(html, /div\.marpit\s*>\s*section\.cover/, 'a matchable slide-level rule exists')
})

test('every documented layout directive example renders with a styled class', async () => {
  // Each `layout:`/`_layout:` value used in the docs must land on the slide's
  // class and have a matching scoped rule in the theme.
  const values = new Set()
  for (const example of mdExamples) {
    for (const m of example.matchAll(/<!--\s*_?layout:\s*([\w-]+)\s*-->/g)) values.add(m[1])
  }
  assert.ok(values.size > 0, 'docs contain at least one layout directive example')
  for (const value of values) {
    const deck = `---\nmarp: true\ntheme: basic\n---\n\n<!-- layout: ${value} -->\n\n# Example\n`
    const html = await renderDeck(deck, { prettify: false })
    const $ = cheerio.load(html)
    assert.ok($(`section.${value}`).length > 0, `layout "${value}" lands on the slide class`)
    assert.match(html, new RegExp(`div\\.marpit\\s*>\\s*section\\.${value}`), `theme styles section.${value}`)
  }
})
