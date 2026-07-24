import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import * as cheerio from 'cheerio'
import { renderDeck, readDeckInfo } from '../src/index.js'

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

test('code blocks are exposed as focusable figures', async () => {
  const html = await renderDeck(sample)
  const $ = cheerio.load(html)
  const code = $('pre code').first()
  assert.equal(code.attr('role'), 'figure')
  assert.equal(code.attr('aria-label'), 'Code example')
  assert.equal(code.attr('tabindex'), '0')
})

test('images get a default width', async () => {
  const html = await renderDeck(sample, { imageWidth: 400 })
  const $ = cheerio.load(html)
  assert.equal($('img').first().attr('width'), '400')
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
