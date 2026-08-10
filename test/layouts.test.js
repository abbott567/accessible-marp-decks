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
    for (const cls of ['.box', '.stack', '.columns', '.grid', '.frame']) {
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

test('every bundled theme (and the template) defines the pre-built layouts', async () => {
  const themes = await listThemes()
  for (const name of [...themes, '_template']) {
    const css = await readFile(join(themesDir, `${name}.css`), 'utf8')
    const layouts = [
      'section.title', 'section.quote', 'section.full-image',
      'section.section', 'section.title-only', 'section.two-content',
      'section.comparison', 'section.content-caption', 'section.picture-caption'
    ]
    for (const cls of layouts) {
      assert.ok(css.includes(cls), `${name}.css defines ${cls}`)
    }
  }
})

test('the layout directive picks a pre-built layout for one slide', async () => {
  const deck = '---\nmarp: true\ntheme: basic\n---\n\n<!-- _layout: quote -->\n\n> A quotation.\n\n---\n\n## Plain slide\n'
  const html = await renderDeck(deck, { prettify: false })
  const $ = cheerio.load(html)
  assert.ok($('section').first().hasClass('quote'), 'the layout value lands on the slide class')
  assert.ok(!$('section').last().hasClass('quote'), '_layout is a one-slide (spot) directive')
  // The theme rule must be scoped so it can actually match the slide.
  assert.match(html, /div\.marpit\s*>\s*section\.quote/)
})

test('a plain layout directive carries to the following slides', async () => {
  const deck = '---\nmarp: true\ntheme: basic\n---\n\n<!-- layout: title -->\n\n# First\n\n---\n\n# Second\n'
  const html = await renderDeck(deck, { prettify: false })
  const $ = cheerio.load(html)
  assert.equal($('section.title').length, 2)
})

test('a layout directive with no usable value is ignored', async () => {
  // YAML parses a bare `layout:` as null and `layout: ' '` as blank — neither
  // should put a class on the slide (or crash the render).
  const deck = "---\nmarp: true\ntheme: basic\n---\n\n<!-- layout: -->\n\n# First\n\n---\n\n<!-- _layout: ' ' -->\n\n# Second\n"
  const html = await renderDeck(deck, { prettify: false })
  const $ = cheerio.load(html)
  for (const el of $('section').toArray()) {
    assert.equal($(el).attr('class') ?? '', '', 'no class lands on the slide')
  }
})

test('the caption layouts render as a figure with a true figcaption', async () => {
  const deck = '---\nmarp: true\ntheme: basic\n---\n\n' +
    '<!-- _class: picture-caption -->\n\n## Picture\n\n' +
    '![A placeholder.](./missing.png)\n\nThe picture caption.\n\n---\n\n' +
    '<!-- _class: content-caption -->\n\n## Content\n\n' +
    'The content caption.\n\n- One\n- Two\n'
  const html = await renderDeck(deck, { prettify: false })
  const $ = cheerio.load(html)

  const $picture = $('section.picture-caption > figure')
  assert.equal($picture.length, 1)
  assert.equal($picture.children('img').length, 1)
  assert.equal($picture.children('figcaption').text(), 'The picture caption.')

  const $content = $('section.content-caption > figure')
  assert.equal($content.length, 1)
  assert.ok($content.children().first().is('figcaption'), 'the caption paragraph leads the figure')
  assert.equal($content.children('figcaption').text(), 'The content caption.')
  assert.equal($content.children('ul').find('li').length, 2, 'the content block joins the figure')
  // The figure/figcaption styling is part of the shared theme block.
  assert.match(html, /section\.picture-caption\s+figcaption/)
  assert.match(html, /section\.content-caption\s+figcaption/)
})

test('the quote layout renders the attributed-quote shape with a cite URL', async () => {
  const deck = '---\nmarp: true\ntheme: basic\n---\n\n' +
    '<!-- _class: quote -->\n\n> A quotation.\n\n' +
    '- [Someone](https://example.com/source)\n'
  const html = await renderDeck(deck, { prettify: false })
  const $ = cheerio.load(html)

  const $figure = $('section.quote > figure')
  assert.equal($figure.length, 1)
  assert.equal($figure.children('blockquote').attr('cite'), 'https://example.com/source')
  assert.equal($figure.children('blockquote + figcaption').text(), 'Someone')
  // The figcaption styling is part of the shared theme block.
  assert.match(html, /section\.quote\s+figcaption/)
})

test('header and footer directives fill the slide template zones', async () => {
  const deck = "---\nmarp: true\ntheme: basic\n---\n\n<!-- header: 'Top zone' -->\n<!-- footer: 'Bottom zone' -->\n\n# Body\n"
  const html = await renderDeck(deck, { prettify: false })
  const $ = cheerio.load(html)
  const $section = $('section').first()
  const children = $section.children().toArray().map(el => el.tagName.toLowerCase())
  assert.equal(children[0], 'header', 'header is the slide\'s first child (top zone)')
  assert.equal(children[children.length - 1], 'footer', 'footer is the slide\'s last child (bottom zone)')
  assert.equal($section.find('footer .pagination').length, 1, 'pagination joins the existing footer')
  // The zones are pinned by flow-layout auto margins, not absolute overlays,
  // and Marpit's scoping must keep the structural rules matchable.
  assert.match(html, /div\.marpit\s*>\s*section\s*>\s*header\s*\{[^}]*margin-block-end:\s*auto/)
  assert.match(html, /div\.marpit\s*>\s*section:has\(\s*>\s*footer\)/)
})

/**
 * The shared layout block (spacing scale → pre-built layouts) — comments
 * stripped and whitespace collapsed, so comment styles may differ but the
 * rules can't.
 */
async function helperBlock (name) {
  const css = await readFile(join(themesDir, `${name}.css`), 'utf8')
  const start = css.indexOf('--space-xs')
  const end = css.indexOf('/* --- end shared layout block')
  assert.ok(start > -1 && end > start, `${name}.css contains the shared layout block`)
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
