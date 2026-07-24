import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildDocument } from '../src/core/template.js'

test('buildDocument fills sensible defaults when deckInfo/lang are omitted', () => {
  const html = buildDocument({ html: '<p>slide</p>', css: 'body{}' })
  assert.match(html, /<html lang="en">/)
  assert.match(html, /<title><\/title>/)
  assert.match(html, /content=""/) // empty description
  assert.match(html, /<style>body\{\}<\/style>/)
  assert.match(html, /<p>slide<\/p>/)
})

test('buildDocument escapes and applies deckInfo and lang', () => {
  const html = buildDocument({
    html: '',
    css: '',
    deckInfo: { title: 'A & B <c> "d"', description: 'desc' },
    lang: 'cy'
  })
  assert.match(html, /<html lang="cy">/)
  assert.match(html, /<title>A &amp; B &lt;c&gt; &quot;d&quot;<\/title>/)
  assert.match(html, /content="desc"/)
})
