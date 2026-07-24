# Accessibility

The whole point of this project is that the shared slides are accessible. For every rendered deck, the transforms guarantee the following.

## Structure and landmarks

- The slides are wrapped in a `<main>` landmark.
- Every slide `<section>` becomes a labelled region: `aria-label="Slide N: <heading text>"`.
- Each slide heading gets a stable `id` (`slide-N`) so it can be linked to directly, and an `aria-describedby` pointing at that slide's page number.

## Pagination for screen readers

- Each slide gets a `<footer>` containing a visually-hidden "End of slide N" and a page-number chip. The end-of-slide text is announced to screen readers; the visible chip is `aria-hidden` so it isn't read twice.

## Code blocks

- `pre code` blocks are marked `role="region"` with an `aria-label` and put in the tab order (`tabindex="0"`) so keyboard users can focus and scroll a long, highlighted snippet. A visible focus outline is applied.
- That is the no-JavaScript default (every block focusable). A tiny inlined script then *removes* `tabindex`/`role`/`aria-label` from any block that does not actually overflow — re-checked on resize — so only genuinely scrollable code stays in the tab order. With JavaScript off, the safe default remains.

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

The `test/` suite pins these guarantees (labelled sections, heading ids, footer pagination, keyboard-scrollable code blocks, the responsive scaling rules). If you change the rendering pipeline, keep these green and add cases for new behaviour.
