import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import * as cheerio from 'cheerio'
import { renderDeck, renderDeckFile, readDeckInfo } from '../src/index.js'

const here = dirname(fileURLToPath(import.meta.url))
const sample = await readFile(join(here, 'fixtures', 'sample.md'), 'utf8')

test('renders a full accessible HTML document', async () => {
  const html = await renderDeck(sample, { theme: 'basic' })
  assert.match(html, /^<!DOCTYPE html>/)
  assert.match(html, /<html lang="en">/)
  assert.match(html, /<main>/)
})

test('document head carries front-matter title and description', async () => {
  const html = await renderDeck(sample)
  const $ = cheerio.load(html)
  assert.equal($('title').text(), 'Sample Deck')
  assert.equal($('meta[name="description"]').attr('content'), 'A tiny deck used by the test suite.')
})

test('each slide becomes a labelled landmark with paginated footer', async () => {
  const html = await renderDeck(sample)
  const $ = cheerio.load(html)

  const sections = $('section')
  assert.equal(sections.length, 2)

  // Slide 1
  const slide1 = $('section').eq(0)
  assert.match(slide1.attr('aria-label'), /^Slide 1: First Slide/)
  assert.equal($('#slide-1').length, 1)
  assert.equal($('#slide-1').attr('aria-describedby'), 'page-number-1')
  assert.equal(slide1.find('footer .pagination').length, 1)
  assert.equal(slide1.find('#page-number-1').length, 1)

  // Marpit presentational attributes are stripped
  assert.equal(slide1.attr('data-marpit-pagination'), undefined)
  assert.equal(slide1.attr('data-paginate'), undefined)
})

test('code blocks are exposed as focusable scrollable regions by default', async () => {
  const html = await renderDeck(sample)
  const $ = cheerio.load(html)
  const code = $('pre code').first()
  assert.equal(code.attr('role'), 'region')
  assert.equal(code.attr('aria-label'), 'Code block, scrollable')
  assert.equal(code.attr('tabindex'), '0')
})

test('the runtime script (scaling + code focus) is inlined', async () => {
  const html = await renderDeck(sample)
  assert.match(html, /--slide-scale/, 'sets the slide scale')
  assert.match(html, /devicePixelRatio/, 'compensates for browser zoom')
  assert.match(html, /querySelectorAll\("pre > code"\)/, 'refines code focus')
  assert.match(html, /removeAttribute\("tabindex"\)/)
  assert.match(html, /fonts\.ready/, 're-evaluates after fonts load')
  assert.match(html, /blocks\.forEach\(\(code\) => observer\.observe\(code\)\)/, 'observes code blocks directly')
})

test('runtimeScript:false omits the enhancement script', async () => {
  const html = await renderDeck(sample, { runtimeScript: false })
  assert.doesNotMatch(html, /querySelectorAll\("pre > code"\)/)
  assert.doesNotMatch(html, /<script>/)
  // The no-JS default still leaves every code block focusable.
  const $ = cheerio.load(html)
  assert.equal($('pre code').first().attr('tabindex'), '0')
})

test('slides stay direct children of div.marpit so theme scoping applies', async () => {
  const html = await renderDeck(sample)
  const $ = cheerio.load(html)
  // No wrapper: sections must remain direct children of div.marpit, otherwise
  // Marpit's `div.marpit > section` scoped theme rules would not match.
  assert.equal($('.slide-frame').length, 0, 'no scaling wrapper is inserted')
  assert.equal($('div.marpit > section').length, 2, 'sections are direct children')
})

test('document CSS scales slides uniformly via zoom on div.marpit > section', async () => {
  const html = await renderDeck(sample)
  assert.match(html, /div\.marpit\s*\{[^}]*max-width:\s*1280px/, 'container capped at the design width')
  assert.match(html, /div\.marpit\s*>\s*section\s*\{[^}]*zoom:\s*var\(--slide-scale/, 'whole-slide zoom')
})

test('the built demo deck contains no duplicate ids', async () => {
  // Regression net for the multi-heading bug: render the real layouts deck
  // (which has slides with h2 + h3s) and sweep the whole document for id reuse.
  const html = await renderDeckFile(join(here, '..', 'examples', 'decks', 'layouts', 'slides.md'), {})
  const $ = cheerio.load(html)
  const counts = {}
  $('[id]').each((_, el) => {
    const id = $(el).attr('id')
    counts[id] = (counts[id] || 0) + 1
  })
  const dupes = Object.entries(counts).filter(([, n]) => n > 1)
  assert.deepEqual(dupes, [], `duplicate ids found: ${JSON.stringify(dupes)}`)
})

test('readDeckInfo extracts front matter without rendering', () => {
  const info = readDeckInfo(sample)
  assert.equal(info.title, 'Sample Deck')
  assert.equal(info.theme, 'basic')
})

test('prettify:false still produces valid markup', async () => {
  const html = await renderDeck(sample, { prettify: false })
  assert.match(html, /<section/)
  assert.ok(!html.includes('\n  <section'), 'unprettified output is not indented')
})

test('falls back to the default theme with no theme and no front matter', async () => {
  const html = await renderDeck('# Hi')
  assert.match(html, /<section/)
  assert.match(html, /div\.marpit\s*>\s*section\s*\{/)
})

test('code blocks without a known language still render', async () => {
  const html = await renderDeck('```\nplain text\n```\n\n```js\nconst a = 1\n```\n')
  const $ = cheerio.load(html)
  // Two highlighted code figures: the plain one (no language) and the js one.
  assert.equal($('pre code').length, 2)
  assert.match(html, /plain text/)
})

test('unhighlighted fences escape HTML instead of injecting it', async () => {
  const md = '# T\n\n```\n<div>hi</div><img src=x onerror=alert(1)>\n```\n\n```nosuchlang\n<b>bold?</b> & "quotes"\n```\n'
  const html = await renderDeck(md, { prettify: false })

  // The fence content must appear as escaped text, never as live markup.
  assert.ok(!html.includes('<div>hi</div>'), 'no raw <div> injected')
  assert.ok(!html.includes('<img src=x'), 'no raw <img> injected')
  assert.ok(!html.includes('<b>bold?</b>'), 'no raw <b> injected')
  assert.match(html, /&lt;div&gt;hi&lt;\/div&gt;/)
  // Cheerio serializes text nodes with the security-relevant entities escaped;
  // bare quotes are valid in text content.
  assert.match(html, /&lt;b&gt;bold\?&lt;\/b&gt; &amp; "quotes"/)

  // The rendered code element contains the original text verbatim.
  const $ = cheerio.load(html)
  assert.equal($('pre code').first().text(), '<div>hi</div><img src=x onerror=alert(1)>\n')
})

test('highlighted fences containing HTML stay escaped too', async () => {
  const html = await renderDeck('```html\n<script>alert(1)</script>\n```\n', { prettify: false })
  assert.ok(!html.includes('<script>alert(1)'), 'no live script element')
  const $ = cheerio.load(html)
  assert.equal($('pre code').first().text().trim(), '<script>alert(1)</script>')
})
