import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import * as cheerio from 'cheerio'
import { renderDeck, renderDeckFile } from '../src/index.js'

const here = dirname(fileURLToPath(import.meta.url))
const fixtures = join(here, 'fixtures')
const markdown = await readFile(join(fixtures, 'with-image.md'), 'utf8')

test('local images are base64-inlined into the page', async () => {
  const html = await renderDeck(markdown, { theme: 'basic', basePath: fixtures })
  const $ = cheerio.load(html)
  const local = $('img[alt="A red dot"]').attr('src')
  assert.ok(local.startsWith('data:image/png;base64,'), 'local image became a data URI')
  // No relative reference should survive — the file is self-contained.
  assert.ok(!html.includes('src="./images/'), 'no relative image references remain')
})

test('remote images are left untouched', async () => {
  const html = await renderDeck(markdown, { theme: 'basic', basePath: fixtures })
  const $ = cheerio.load(html)
  assert.equal($('img[alt="Remote"]').attr('src'), 'https://example.com/remote.png')
})

test('without a basePath, images are left as references', async () => {
  const html = await renderDeck(markdown, { theme: 'basic' })
  assert.ok(html.includes('./images/dot.png'), 'relative src preserved when basePath is unknown')
})

test('inlineAssets:false disables base64 inlining', async () => {
  const html = await renderDeck(markdown, { theme: 'basic', basePath: fixtures, inlineAssets: false })
  assert.ok(html.includes('./images/dot.png'), 'inlining can be turned off')
})

test('renderDeckFile inlines images relative to the file by default', async () => {
  const html = await renderDeckFile(join(fixtures, 'with-image.md'), { theme: 'basic' })
  assert.match(html, /data:image\/png;base64,/)
})

test('slide background images (![bg]) are inlined too', async () => {
  const bgDeck = '---\nmarp: true\ntheme: basic\n---\n\n# Slide with a background\n\n![bg](./images/dot.png)\n'
  const html = await renderDeck(bgDeck, { basePath: fixtures, prettify: false })
  const $ = cheerio.load(html)

  const style = $('section').first().attr('style') || ''
  assert.match(style, /background-image:\s*url\("data:image\/png;base64,/, 'background became a data URI')
  assert.ok(!style.includes('./images/'), 'no relative URL left in the style')

  // The consumed Marpit attributes are stripped from the output.
  assert.equal($('[data-background-image]').length, 0)
  assert.equal($('[data-marpit-pagination-total]').length, 0)
})
