# Accessibility

The whole point of this project is that the shared slides are accessible. For every rendered deck, the transforms guarantee the following.

## Structure and landmarks

- The slides are wrapped in a `<main>` landmark.
- Every slide `<section>` becomes a labelled region: `aria-label="Slide N: <heading text>"`.
- Each slide heading gets a stable `id` (`slide-N`) so it can be linked to directly, and an `aria-describedby` pointing at that slide's page number.

## Pagination for screen readers

- Each slide gets a `<footer>` containing a visually-hidden "End of slide N" and a page-number chip. The end-of-slide text is announced to screen readers; the visible chip is `aria-hidden` so it isn't read twice.

## Code blocks

- Long code lines **wrap** in the bundled themes instead of scrolling — slides render at a fixed size, so an overflowing block would hide the same content from every viewer (and a projected slide can't be scrolled at all). Nothing needs interaction to be read.
- A scrolling safety net remains for themes that restore `nowrap`: `pre code` blocks ship marked `role="region"` with an `aria-label` and `tabindex="0"` (the no-JavaScript default), and the inlined script *removes* those from any block that does not actually overflow — so with the bundled themes nothing is focusable, and a genuinely scrollable block in a custom theme is keyboard-operable rather than a trap. A visible focus outline is applied.

## Caption and quote layouts

- The `picture-caption` and `content-caption` layouts emit a real `<figure>` with the caption paragraph as its `<figcaption>` — the caption/content relationship is programmatically determinable (WCAG 1.3.1, Info and Relationships), not just a visual pairing of styled paragraphs.
- The `quote` layout emits the HTML spec's attributed-quote shape — `<figure><blockquote><figcaption>` — so the attribution is programmatically tied to the quotation, and a link in the attribution becomes the machine-readable `cite` URL on the `<blockquote>`. The attribution is authored as a single-item list, an explicit marker that can't be confused with body paragraphs.

## Reading order and scaling

- Slides scale down proportionally with the window (see [the 16:9 scaling notes](#responsive-scaling)); the DOM order is the reading order, unaffected by the visual scaling.
- The output is a normal scrolling HTML document — not a JavaScript slideshow — so browser find, zoom, reader modes, and screen-reader navigation all work.

## Colour and motion

- The bundled `basic` theme (and the template) provide automatic light/dark modes via `prefers-color-scheme`, with colours chosen for contrast.
- No animation or autoplay is introduced by the renderer.

## Presentational cleanup

- Marp's presentational `data-*` attributes are stripped from the output.

## <a id="responsive-scaling"></a>Responsive scaling

Marpit renders every slide at a fixed 1280×720 design size. The inlined runtime script sets `--slide-scale` on `div.marpit` to (container width ÷ 1280), and the CSS `zoom` magnifies each slide — text, spacing, layout, everything — as one rigid unit. The layout is computed once at 1280px and simply scaled, so nothing reflows or shifts. Without JavaScript, slides render at full size and the page scrolls (a readable fallback).

**Browser zoom is respected.** Fitting to the window width would normally cancel page zoom (the viewport shrinks in CSS pixels and the deck just re-fits), so the script also multiplies the fit scale by the page-zoom factor (detected via `devicePixelRatio`). Zooming with <kbd>Cmd</kbd>/<kbd>Ctrl</kbd> and <kbd>+</kbd> genuinely enlarges the slides — they overflow and scroll like any zoomed content — meeting WCAG 1.4.4 (Resize Text).

## Testing

The `test/` suite pins these guarantees (labelled sections, heading ids, footer pagination, the code-block focus safety net, the responsive scaling rules). If you change the rendering pipeline, keep these green and add cases for new behaviour.
