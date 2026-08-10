import { test } from 'node:test'
import assert from 'node:assert/strict'
import { join } from 'node:path'
import * as cheerio from 'cheerio'
import { modifySection, modifyCaptions, modifyImg, modifyCodeBlocks } from '../src/core/transforms/index.js'

test('modifySection honours an existing footer and a background image', () => {
  const $ = cheerio.load(
    '<section data-background-image="pic.png" data-marpit-pagination="1" data-marpit-pagination-total="3">' +
    '<h2>Title</h2><footer>mine</footer></section>'
  )
  modifySection($)

  const $section = $('section')
  // Background image directive is turned into a CSS background-image.
  assert.match($section.attr('style') || '', /background-image/)
  // The consumed Marpit attributes are stripped.
  assert.equal($section.attr('data-background-image'), undefined)
  assert.equal($section.attr('data-marpit-pagination-total'), undefined)
  // The existing footer is reused, not duplicated.
  assert.equal($section.find('footer').length, 1)
  // Pagination markup is still injected into that footer.
  assert.equal($section.find('footer .pagination').length, 1)
  // With `paginate: true` the page-number chip is visible.
  assert.ok(!$section.find('#page-number-1').hasClass('visually-hidden'))
})

test('modifySection hides the visible page number when pagination is off', () => {
  const $ = cheerio.load('<section><h2>One</h2></section>')
  modifySection($)
  // The paragraph stays (the heading's aria-describedby points at it)…
  assert.equal($('h2').attr('aria-describedby'), 'page-number-1')
  assert.equal($('#page-number-1').length, 1)
  // …but nothing is shown on the slide.
  assert.ok($('#page-number-1').hasClass('visually-hidden'))
})

test('modifyImg leaves section styles without a url() token alone', async () => {
  const $ = cheerio.load('<section style="color: red"><p>x</p></section>')
  await modifyImg($, { basePath: process.cwd() })
  assert.equal($('section').attr('style'), 'color: red')
})

test('modifyImg leaves remote and unreadable section backgrounds as references', async () => {
  const $ = cheerio.load(
    '<section style="background-image: url(https://example.com/bg.png)"></section>' +
    '<section style="background-image: url(./missing.png)"></section>'
  )
  await modifyImg($, { basePath: '/definitely/not/here' })
  const styles = $('section').map((_, el) => $(el).attr('style')).toArray()
  assert.match(styles[0], /example\.com\/bg\.png/)
  assert.match(styles[1], /\.\/missing\.png/)
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

test('modifyImg decodes URL-encoded srcs and ignores query/fragment', async () => {
  const fixtures = join(process.cwd(), 'test', 'fixtures')
  const $ = cheerio.load(
    '<img id="a" src="./images/red%20dot.png">' +
    '<img id="b" src="./images/dot.png?v=2">' +
    '<img id="c" src="./images/dot.png#frag">'
  )
  await modifyImg($, { basePath: fixtures })
  assert.match($('#a').attr('src'), /^data:image\/png;base64,/, '%20 decodes to a space on disk')
  assert.match($('#b').attr('src'), /^data:image\/png;base64,/, 'query string ignored')
  assert.match($('#c').attr('src'), /^data:image\/png;base64,/, 'fragment ignored')
})

test('modifyImg tolerates malformed percent-escapes', async () => {
  // decodeURIComponent throws on "%E0%A4%A" — the src must survive untouched.
  const $ = cheerio.load('<img src="./images/bad%E0%A4%A.png">')
  await modifyImg($, { basePath: process.cwd() })
  assert.equal($('img').attr('src'), './images/bad%E0%A4%A.png')
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

test('modifyCaptions pairs a picture-caption image and caption into a figure', () => {
  const $ = cheerio.load(
    '<section class="picture-caption"><h2>Title</h2>' +
    '<p><img src="x.png" alt="A chart."></p>' +
    '<p>The <a href="https://example.com">caption</a>.</p></section>'
  )
  modifyCaptions($)

  const $figure = $('section > figure')
  assert.equal($figure.length, 1)
  assert.equal($figure.children('img').attr('alt'), 'A chart.')
  // The caption paragraph becomes the figcaption, inline markup intact.
  assert.equal($figure.children('img + figcaption').text(), 'The caption.')
  assert.equal($figure.find('figcaption a').length, 1)
  // The consumed paragraphs are gone; the heading stays outside the figure.
  assert.equal($('section > p').length, 0)
  assert.equal($('section > h2').length, 1)
})

test('modifyCaptions leaves a picture-caption slide alone without a clean picture/caption pair', () => {
  const $ = cheerio.load(
    // No paragraph after the image — nothing to pair.
    '<section class="picture-caption"><p><img src="a.png" alt=""></p></section>' +
    // The image shares its paragraph with text — not the layout's shape.
    '<section class="picture-caption"><p>Intro <img src="b.png" alt=""></p><p>Caption</p></section>' +
    // The image has an element sibling inside its paragraph.
    '<section class="picture-caption"><p><img src="c.png" alt=""><em>x</em></p><p>Caption</p></section>' +
    // No image at all.
    '<section class="picture-caption"><p><em>x</em></p><p>Caption</p></section>'
  )
  modifyCaptions($)
  assert.equal($('figure').length, 0)
})

test('modifyCaptions pairs a quote and its attribution into the attributed-quote shape', () => {
  const $ = cheerio.load(
    '<section class="quote"><blockquote><p>Words.</p></blockquote>' +
    '<ul><li><a href="https://example.com/talk">Someone</a>, <cite>A Talk</cite></li></ul></section>'
  )
  modifyCaptions($)

  const $figure = $('section > figure')
  assert.equal($figure.length, 1)
  // The spec's shape: blockquote inside the figure, attribution as figcaption.
  assert.deepEqual(
    $figure.children().toArray().map(el => el.tagName.toLowerCase()),
    ['blockquote', 'figcaption']
  )
  assert.equal($figure.find('blockquote p').text(), 'Words.')
  // The attribution keeps its inline markup, including a manual <cite>.
  assert.equal($figure.children('figcaption').text(), 'Someone, A Talk')
  assert.equal($figure.find('figcaption cite').text(), 'A Talk')
  // A link in the attribution doubles as the machine-readable source URL.
  assert.equal($figure.children('blockquote').attr('cite'), 'https://example.com/talk')
  assert.equal($('section > ul').length, 0)
})

test('modifyCaptions adds no cite URL when the attribution has no link', () => {
  const $ = cheerio.load(
    '<section class="quote"><blockquote><p>Words.</p></blockquote><ul><li>Someone</li></ul></section>'
  )
  modifyCaptions($)
  assert.equal($('section > figure > figcaption').text(), 'Someone')
  assert.equal($('blockquote').attr('cite'), undefined)
})

test('modifyCaptions leaves a quote slide alone without a single-item attribution list', () => {
  const $ = cheerio.load(
    // A paragraph after the quote is body content, not an attribution.
    '<section class="quote"><blockquote><p>Words.</p></blockquote><p>Commentary.</p></section>' +
    // A multi-item list is body content too.
    '<section class="quote"><blockquote><p>Words.</p></blockquote><ul><li>a</li><li>b</li></ul></section>' +
    // No blockquote at all.
    '<section class="quote"><ul><li>Someone</li></ul></section>'
  )
  modifyCaptions($)
  assert.equal($('figure').length, 0)
  assert.equal($('section > p').text(), 'Commentary.', 'the paragraph is untouched')
})

test('modifyCaptions wraps the content-caption body in a figure, caption first', () => {
  const $ = cheerio.load(
    '<section class="content-caption"><header>top</header><h2>Title</h2>' +
    '<p>The caption.</p><ul><li>a</li></ul><p>More content.</p>' +
    '<footer>bottom</footer></section>'
  )
  modifyCaptions($)

  const $figure = $('section > figure')
  assert.equal($figure.length, 1)
  // The caption paragraph becomes the figure's first child, as a figcaption.
  assert.ok($figure.children().first().is('figcaption'))
  assert.equal($figure.children('figcaption').text(), 'The caption.')
  // The content blocks follow it inside the figure, in source order.
  assert.deepEqual(
    $figure.children().toArray().map(el => el.tagName.toLowerCase()),
    ['figcaption', 'ul', 'p']
  )
  // The template zones and heading stay direct children of the slide.
  assert.deepEqual(
    $('section').children().toArray().map(el => el.tagName.toLowerCase()),
    ['header', 'h2', 'figure', 'footer']
  )
})

test('modifyCaptions leaves a content-caption slide alone without a caption-then-content pair', () => {
  const $ = cheerio.load(
    // A caption with no content beside it — nothing to relate.
    '<section class="content-caption"><h2>Title</h2><p>Lonely caption</p></section>' +
    // The first body block is not a paragraph, so there is no caption.
    '<section class="content-caption"><h2>Title</h2><ul><li>a</li></ul><p>text</p></section>'
  )
  modifyCaptions($)
  assert.equal($('figure').length, 0)
})

test('modifyCodeBlocks makes code a focusable scrollable region by default', () => {
  const $ = cheerio.load('<pre><code>x</code></pre>')
  modifyCodeBlocks($)
  assert.equal($('code').attr('role'), 'region')
  assert.equal($('code').attr('aria-label'), 'Code block, scrollable')
  assert.equal($('code').attr('tabindex'), '0')
})
