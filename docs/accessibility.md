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

- Slides scale down proportionally with the window using pure CSS (see [the 16:9 scaling notes](#responsive-scaling)); the DOM order is the reading order, unaffected by the visual scaling.
- The output is a normal scrolling HTML document — not a JavaScript slideshow — so browser find, zoom, reader modes, and screen-reader navigation all work.

## Colour and motion

- The bundled `basic` theme (and the template) provide automatic light/dark modes via `prefers-color-scheme`, with colours chosen for contrast.
- No animation or autoplay is introduced by the renderer.

## Presentational cleanup

- Marp's presentational `data-*` attributes are stripped from the output.

## <a id="responsive-scaling"></a>Responsive scaling

Marpit's own container (`div.marpit`) is capped at the 1280px design width and made a query container; each slide (`div.marpit > section`) fills it at a 16:9 ratio, and its font-size is derived from the container width with a container-query unit. Everything inside is sized in `em`/`%`, so the slide scales as a single unit and never reflows. This is why theme and helper CSS must be authored in relative units.

## Testing

The `test/` suite pins these guarantees (labelled sections, heading ids, footer pagination, focusable code figures, the scaling frame). If you change the rendering pipeline, keep these green and add cases for new behaviour.
