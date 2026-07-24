# Layouts

There are three levels of layout, from zero effort to full control:

1. **The slide template** — every slide already has a top zone, a body, and a bottom zone. Marp's `header:` and `footer:` directives fill the zones; you don't build anything.
2. **Pre-built layouts** — pick a whole-slide look (`title`, `quote`, `full-image`, …) with the `layout:` directive.
3. **Layout helpers** — compose your own arrangements from small CSS classes (`columns`, `grid`, `stack`, …).

## The slide template

Every slide is built on the cover shape: content pinned to the top and bottom edges, with the body centred between them. Marp's own [`header:` and `footer:` directives](https://marpit.marp.app/directives?id=header-and-footer) put content into those zones:

```markdown
<!-- header: 'Some header content' -->

The body content

<!-- footer: '[example.com](https://example.com)' -->
```

The zones are part of the slide's flow, not overlays, so body content can never collide with them. The injected slide number also lives in the bottom zone.

Like all Marp directives, `header:` and `footer:` apply from that slide onward — every following slide keeps them until they're changed. Use `_header:` / `_footer:` (leading underscore, the "spot" form) to affect a single slide.

## Pre-built layouts

Pick a ready-made layout for a slide with the `layout` directive:

```markdown
<!-- _layout: quote -->

> Accessibility is not a feature you bolt on at the end. It is a property of building things the right way.

Someone wise
```

| Layout | What you get |
| --- | --- |
| `title` | A hero slide: everything centred, oversized heading — for the opening slide or section breaks. |
| `quote` | One big centred quotation. A paragraph after the blockquote is styled as the attribution. |
| `full-image` | One image fills the whole slide edge to edge. Header and footer sit on top with a solid backing strip. The image still needs real alt text. |

```markdown
<!-- _layout: full-image -->

![A descriptive alt text.](./images/photo.jpg)
```

Notes on how the directive behaves:

- `_layout:` applies to that slide only; plain `layout:` applies from that slide onward, like every Marp directive.
- The slide-level helper classes (`cover`, `center`, `stack` — see below) are also valid values, e.g. `<!-- layout: center -->`.
- `layout:` is sugar for Marp's class directive, so a layout is just a class on the slide. If a slide sets both `layout:` and `_class:`, the class directive wins.
- The `layout:` directive is provided by this project's renderer, so the Marp VSCode preview ignores it. For preview parity write the equivalent `<!-- _class: quote -->` — the layouts are plain classes in the theme, and both forms produce identical slides.

## Layout helpers

Slides are composed with a small set of layout helper classes. Put them on raw HTML inside a slide (Marp allows HTML because the renderer enables it).

Because a slide is a fixed canvas that scales as a whole — it never reflows — these are plain CSS grid/flex layouts, not responsive "stacking" primitives. They are defined in the theme file, so they also show up in the Marp VSCode preview.

All spacing uses an `em`-based scale (`--space-xs`/`-s`/`-m`/`-l`) so gaps scale with the slide.

## Using the helpers

Wrap part of a slide in a `<div>` with the helper class:

```html
<div class="columns">
  <div>Left</div>
  <div>Right</div>
</div>
```

> When you put Markdown *inside* a block-level HTML element, leave a blank line after the opening tag so Marp processes the Markdown within.

## Styling a whole slide

Three helpers also have **slide-level variants**, applied with Marp's class directive:

```markdown
<!-- _class: cover -->

# A cover slide
```

| Slide class | Effect |
| --- | --- |
| `cover` | Pins the first block to the top and the last to the bottom. |
| `center` | Centres content horizontally and centres the text — a title-slide look. |
| `stack` | Flows content from the top with an even gap, instead of vertically centring. |

The other helpers lay out elements *inside* a slide and have no slide-level variant — use the `<div>` form for those. (Slide-level rules are written as `section.cover` in the theme because Marpit scopes bare class selectors to descendants of the slide.)

## The helpers

| Class | What it does |
| --- | --- |
| `box`, `box-s`, `box-l` | Padded container (three padding sizes). |
| `stack`, `stack-s`, `stack-l` | Vertical flow with an even gap between children. |
| `cluster` | A wrapping row of items with even gaps — tags, chips, buttons. |
| `columns`, `columns-3` | Two (or three) equal columns side by side. |
| `grid` | As many equal cards as fit, each at least `14em` wide. |
| `center` | A centred column capped at a comfortable reading measure. |
| `frame`, `frame-square` | Crop an image/video to 16:9 (or 1:1). |
| `cover` | Pin content to the top and bottom, fill the slide height. |
| `sidebar` | A self-sized side column beside a flexible main column. |
| `overlay-centre` | Centre an element over a positioned ancestor. |

## Examples

**Two columns**

```html
<div class="columns">
  <div class="box">Left column</div>
  <div class="box">Right column</div>
</div>
```

**A card grid**

```html
<div class="grid">
  <div class="box">Perceivable</div>
  <div class="box">Operable</div>
  <div class="box">Understandable</div>
  <div class="box">Robust</div>
</div>
```

**Tags**

```html
<ul class="cluster" role="list">
  <li><code>grid</code></li>
  <li><code>stack</code></li>
  <li><code>cluster</code></li>
</ul>
```

**Cropped media**

```html
<div class="frame">
  <img src="./images/photo.jpg" alt="A descriptive alt text.">
</div>
```

See the [`layouts` example deck](../examples/decks/layouts/slides.md) for all of these in context.

## Custom layouts

Helpers and pre-built layouts are just CSS classes in the theme. To add your own helper, add a class to your theme file (keep it in `em`/`%`). To add your own pre-built layout, add a slide-level rule — written as `section.my-layout` because Marpit scopes bare classes to descendants — and select it with `<!-- layout: my-layout -->`. See [creating-themes.md](creating-themes.md).
