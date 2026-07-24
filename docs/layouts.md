# Layout helpers

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

These helpers are just CSS classes in the theme. To add your own, add a class to your theme file (keep it in `em`/`%`). See [creating-themes.md](creating-themes.md).
