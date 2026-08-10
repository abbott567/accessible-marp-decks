/**
 * Give the caption layouts true caption semantics. The theme CSS can only make
 * a paragraph *look* like a caption; the caption/content relationship must
 * also be programmatically determinable (WCAG 1.3.1), so the pair is rewritten
 * into a `<figure>` with a real `<figcaption>`:
 *
 * - `picture-caption` — `<p><img></p><p>caption</p>` becomes
 *   `<figure><img><figcaption>caption</figcaption></figure>`.
 * - `content-caption` — the leading caption paragraph and the content blocks
 *   are wrapped together, with the paragraph as the figure's `<figcaption>`.
 * - `quote` — the blockquote and its attribution (written as a single-item
 *   list, so a body paragraph can never be mistaken for it) become the
 *   spec's own attributed-quote shape, `<figure><blockquote><figcaption>`;
 *   a link in the attribution doubles as the blockquote's `cite` URL.
 *
 * A slide that doesn't follow the layout's documented shape (no caption
 * paragraph, or an image mixed into a text paragraph) is left untouched — the
 * theme's paragraph styling still applies, exactly as in the Marp VSCode
 * preview where these transforms never run.
 *
 * @param {import('cheerio').CheerioAPI} $
 */
export function modifyCaptions ($) {
  $('section.picture-caption').each(function () {
    const $section = $(this)

    // The picture is a paragraph whose sole content is one image.
    const $pictureP = $section.children('p').filter((_, el) => {
      const $p = $(el)
      return $p.children('img').length === 1 &&
        $p.children().length === 1 &&
        $p.text().trim() === ''
    }).first()
    if ($pictureP.length === 0) return

    const $captionP = $pictureP.next('p')
    if ($captionP.length === 0) return

    const $figure = $('<figure></figure>')
    $pictureP.before($figure)
    $figure.append($pictureP.children('img'))
    $figure.append($('<figcaption></figcaption>').append($captionP.contents()))
    $pictureP.remove()
    $captionP.remove()
  })

  $('section.quote').each(function () {
    const $section = $(this)

    const $quote = $section.children('blockquote').first()
    if ($quote.length === 0) return

    // The attribution is the single item of a list directly after the quote —
    // an explicit marker, so ordinary paragraphs are never consumed.
    const $list = $quote.next('ul')
    if ($list.length === 0) return
    const $item = $list.children('li')
    if ($item.length !== 1) return

    const $figure = $('<figure></figure>')
    $quote.before($figure)

    const $figcaption = $('<figcaption></figcaption>').append($item.contents())
    const sourceURL = $figcaption.find('a[href]').first().attr('href')
    if (sourceURL) $quote.attr('cite', sourceURL)

    $figure.append($quote)
    $figure.append($figcaption)
    $list.remove()
  })

  $('section.content-caption').each(function () {
    const $section = $(this)

    // The body is everything the layout doesn't pin to a template zone.
    const $body = $section.children().not('header, footer, h1, h2')
    if ($body.length < 2) return

    const $captionP = $body.first()
    if (!$captionP.is('p')) return

    const $figure = $('<figure></figure>')
    $captionP.before($figure)
    $figure.append($('<figcaption></figcaption>').append($captionP.contents()))
    $captionP.remove()
    $figure.append($body.slice(1))
  })
}
