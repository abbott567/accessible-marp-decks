import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import * as cheerio from 'cheerio'
import { renderDeck, themesDir, listThemes } from '../src/index.js'

const deck = `---
title: Layouts
marp: true
theme: basic
---

# Columns

<div class="columns">
  <div class="box">One</div>
  <div class="box">Two</div>
</div>
`

test('layout classes in the source survive to the output', async () => {
  const html = await renderDeck(deck, { theme: 'basic' })
  const $ = cheerio.load(html)
  assert.equal($('div.columns').length, 1)
  assert.equal($('div.columns > div.box').length, 2)
})

test('the theme carries its own layout helpers (so the VSCode preview works)', async () => {
  // Helpers live in the theme file itself — self-contained — so the Marp
  // preview (which loads only the theme) renders them too.
  const themes = await listThemes()
  for (const name of themes) {
    const css = await readFile(join(themesDir, `${name}.css`), 'utf8')
    for (const cls of ['.box', '.stack', '.cluster', '.columns', '.grid', '.frame']) {
      assert.match(css, new RegExp(`\\${cls}\\s*\\{`), `${name}.css defines ${cls}`)
    }
  }
})

test('slide-level helper classes (_class:) style the whole slide', async () => {
  const coverDeck = '---\nmarp: true\ntheme: basic\n---\n\n<!-- _class: cover -->\n\n# Cover slide\n\nBottom text.\n'
  const html = await renderDeck(coverDeck, { prettify: false })
  const $ = cheerio.load(html)

  const $section = $('section').first()
  assert.ok($section.hasClass('cover'), 'directive class survives to the section')
  assert.equal($section.attr('data-class'), undefined, 'Marpit bookkeeping attr is stripped')

  // The emitted CSS must contain a rule that can actually match the section —
  // Marpit scopes a bare `.cover` to descendants, which never matches the
  // slide itself. `section.cover` scopes to `div.marpit > section.cover`.
  assert.match(html, /div\.marpit\s*>\s*section\.cover/)
})

test('every bundled theme (and the template) defines the slide-level variants', async () => {
  const themes = await listThemes()
  for (const name of [...themes, '_template']) {
    const css = await readFile(join(themesDir, `${name}.css`), 'utf8')
    for (const cls of ['section.cover', 'section.center', 'section.stack']) {
      assert.ok(css.includes(cls), `${name}.css defines ${cls}`)
    }
  }
})

/**
 * The helper block (spacing scale → slide-level variants) — comments stripped
 * and whitespace collapsed, so comment styles may differ but the rules can't.
 */
async function helperBlock (name) {
  const css = await readFile(join(themesDir, `${name}.css`), 'utf8')
  const start = css.indexOf('--space-xs')
  const endAnchor = css.indexOf('section.stack')
  const end = css.indexOf('}', endAnchor) + 1
  assert.ok(start > -1 && endAnchor > start, `${name}.css contains the helper block`)
  return css.slice(start, end)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

test('the helper block is identical across all themes (drift guard)', async () => {
  // The helpers are deliberately duplicated per theme so the Marp VSCode
  // preview works. This guard fails the moment someone edits one copy and
  // forgets the others.
  const reference = await helperBlock('basic')
  const themes = await listThemes()
  for (const name of [...themes.filter(n => n !== 'basic'), '_template']) {
    assert.equal(await helperBlock(name), reference, `${name}.css helper block has drifted from basic.css`)
  }
})
