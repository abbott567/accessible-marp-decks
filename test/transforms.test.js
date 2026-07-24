import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as cheerio from 'cheerio'
import { modifySection, modifyImg, modifyCodeBlocks } from '../src/core/transforms/index.js'

test('modifySection honours an existing footer and a background image', () => {
  const $ = cheerio.load(
    '<section data-background-image="pic.png" data-marpit-pagination="1">' +
    '<h2>Title</h2><footer>mine</footer></section>'
  )
  modifySection($)

  const $section = $('section')
  // Background image directive is turned into a CSS background-image.
  assert.match($section.attr('style') || '', /background-image/)
  // The existing footer is reused, not duplicated.
  assert.equal($section.find('footer').length, 1)
  // Pagination markup is still injected into that footer.
  assert.equal($section.find('footer .pagination').length, 1)
})

test('modifyImg inlines nothing when there is no basePath', async () => {
  const $ = cheerio.load('<img src="./a.png">')
  await modifyImg($, {})
  assert.equal($('img').attr('src'), './a.png')
})

test('modifyImg leaves a missing local file as a reference', async () => {
  const $ = cheerio.load('<img src="./missing.png">')
  await modifyImg($, { basePath: '/definitely/not/here' })
  assert.equal($('img').attr('src'), './missing.png')
})

test('modifyImg skips images with no src or an unknown extension', async () => {
  const $ = cheerio.load('<img><img src="./file.xyz"><img src="https://x/y.png">')
  await modifyImg($, { basePath: process.cwd() })
  const imgs = $('img').toArray()
  assert.equal($(imgs[0]).attr('src'), undefined) // no src
  assert.equal($(imgs[1]).attr('src'), './file.xyz') // unknown extension
  assert.equal($(imgs[2]).attr('src'), 'https://x/y.png') // remote
})

test('modifySection numbers slides by position when pagination is off', () => {
  const $ = cheerio.load('<section><h2>One</h2></section><section><h2>Two</h2></section>')
  modifySection($)
  const labels = $('section').map((_, el) => $(el).attr('aria-label')).toArray()
  assert.deepEqual(labels, ['Slide 1: One', 'Slide 2: Two'])
})

test('modifySection ids and labels only the first heading of a slide', () => {
  const $ = cheerio.load(
    '<section data-marpit-pagination="1"><h2>Title</h2><h3>Left</h3><h3>Right</h3></section>'
  )
  modifySection($)
  // Exactly one element carries the slide id, and it is the first heading.
  assert.equal($('[id="slide-1"]').length, 1)
  assert.equal($('#slide-1').prop('tagName'), 'H2')
  // Later headings are untouched.
  assert.equal($('h3[id]').length, 0)
  assert.equal($('h3[aria-describedby]').length, 0)
  // The label uses the first heading's text only — no concatenation.
  assert.equal($('section').attr('aria-label'), 'Slide 1: Title')
})

test('modifySection labels heading-less slides without a dangling colon', () => {
  const $ = cheerio.load('<section><p>Just a paragraph.</p></section>')
  modifySection($)
  assert.equal($('section').attr('aria-label'), 'Slide 1')
  assert.equal($('[id^="slide-"]').length, 0, 'no orphaned slide id')
  // Screen-reader pagination is still injected.
  assert.equal($('section footer .pagination').length, 1)
})

test('modifyCodeBlocks makes code a focusable scrollable region by default', () => {
  const $ = cheerio.load('<pre><code>x</code></pre>')
  modifyCodeBlocks($)
  assert.equal($('code').attr('role'), 'region')
  assert.equal($('code').attr('aria-label'), 'Code block, scrollable')
  assert.equal($('code').attr('tabindex'), '0')
})
