---

title: Layout gallery
description: A single deck showing the layout primitives accessible-marp-decks can render.
paginate: false
marp: true
theme: basic

---

<!-- _class: title -->

# Layout gallery

A single deck that shows off the slide template, the pre-built layouts, and the layout **primitives** in **accessible-marp-decks**. This slide uses the `title` layout — applied with `_class:` throughout this deck so the VSCode preview shows every layout too (`layout:` works the same when building).

<!-- _footer: 'The first nine slides follow the order of the standard PowerPoint layout picker.' -->

---

<!-- _class: title -->

# Title slide

A title slide, usually used as the very first slide in the talk.

---

## Title and content

The default slide. A heading followed by content in a single column, with no Marp `_class` / directive needed.

---

<!-- _class: section -->

## Section header

The `section` layout divides your talk into distinct parts.

---

<!-- _class: two-content -->

## Two content

- The `two-content` layout
- The heading spans the slide
- Two blocks sit side by side
- A block can be a list, a paragraph, an image etc

![A placeholder graphic with a circle and a rounded rectangle.](./images/placeholder.svg)

<!-- _footer: 'Here the two blocks are a list and an image. Use `columns` primative for more than two per side.' -->

---

<!-- _class: comparison -->

## Comparison

### Heading which is long and wraps onto two lines

- Bullet point 1
- Bullet point 2
- Bullet point 3

### Shorter heading

- Bullet point 4
- Bullet point 5
- Bullet point 6

<!-- _footer: 'The only difference from `two-content`: `###` headings push both columns down together.' -->

---

<!-- _class: title-only -->

## Title only

<!-- _footer: 'The `title-only` layout pins the heading to the top and leaves the canvas free.' -->

---

<!-- _footer: 'Blank — an empty slide needs no directive.' -->

---

<!-- _class: content-caption -->

## Content with caption

This muted paragraph is the caption — it comes first in the source and takes the narrow column.

- The content block sits beside it
- It gets two thirds of the width
- Like PowerPoint's Content with Caption

---

<!-- _class: picture-caption -->

## Picture with caption

![A placeholder graphic with a circle and a rounded rectangle.](./images/placeholder.svg)

The muted caption sits under the picture — like PowerPoint's Picture with Caption.

---

## The slide template

Every slide is built on the cover shape: a top zone, the body, and a bottom zone.

This slide fills both zones with Marp's own directives — the header above and the footer below are `_header:` and `_footer:`. Build the deck with:

```sh
accessible-marp build layouts --theme basic
```

<!-- _header: 'This is the header zone' -->
<!-- _footer: 'This is the footer zone' -->

---

<!-- _class: quote -->

> Accessibility is not a feature you bolt on at the end. It is a property of building things the right way.

The `quote` layout, with this attribution line

---

<!-- _class: full-image -->

![A placeholder graphic with a circle and a rounded rectangle, filling the whole slide.](./images/placeholder.svg)

<!-- _footer: 'The `full-image` layout — the footer sits on a backing strip' -->

---

## Bulleted list

- Every slide is a labelled landmark
- Headings have stable ids
- Code blocks are keyboard-focusable figures
- Pagination is announced to screen readers
- Images keep their alt text

---

## Numbered steps

1. Write your slides in Marp markdown
2. Pick a bundled theme
3. Run the CLI, library, or Eleventy plugin
4. Ship a single, standalone accessible HTML page

---

<!-- _class: section -->

## Primitives

The slides before this one are whole-slide **layouts**, picked with a directive. From here on, each slide is composed by hand from the layout **helper classes** — small bits of CSS you put on raw HTML inside the slide.

---

## Columns — when a layout isn't enough

The `two-content` layout places one block per side. The `columns` helper covers the rest — like this intro paragraph above three columns:

<div class="columns columns-3">
<div class="box">

### Any count

Add `columns-3` for three across; plain `columns` gives two.

</div>
<div class="box">

### Any depth

Each wrapping `<div>` can hold as many blocks as you like.

</div>
<div class="box">

### Anywhere

Columns can sit under other content, or inside another helper.

</div>
</div>

---

## Grid — responsive cards

A `grid` auto-fits as many equal cards as will fit, each at least `14em` wide.

<div class="grid">
  <div class="box">1</div>
  <div class="box">2</div>
  <div class="box">3</div>
  <div class="box">4</div>
</div>

---

## Cluster — tags and chips

A `cluster` lays out a wrapping row of items with even gaps.

<ul class="cluster" role="list">
  <li><code>box</code></li>
  <li><code>stack</code></li>
  <li><code>cluster</code></li>
  <li><code>columns</code></li>
  <li><code>grid</code></li>
  <li><code>cover</code></li>
  <li><code>frame</code></li>
</ul>

---

## Stack — even vertical rhythm

A `stack` puts a consistent space between each child, whatever they are.

<div class="stack">
  <h3>First</h3>
  <p>The gap between items is the same all the way down.</p>
  <p>Change the rhythm with <code>stack--s</code> or <code>stack--l</code>.</p>
</div>

---

<!-- _class: cover -->

## Cover — style a whole slide

This slide uses the class directive `<!-- _class: cover -->`, which pins the heading to the top of the slide…

…and this closing line to the bottom. The `center` and `stack` slide classes work the same way.

---

## Frame — crop media to an aspect ratio

A `frame` crops an image or video to a fixed ratio (16:9 by default) so mixed media lines up.

<div class="frame">

![A placeholder graphic with a circle and a rounded rectangle.](./images/placeholder.svg)

</div>

---

## Code block

Fenced code is syntax-highlighted. A short block that fits needs no keyboard interaction, so it stays out of the tab order:

```js
import { renderDeck } from 'accessible-marp-decks'

const html = await renderDeck(markdown, { theme: 'basic' })
```

---

## Scrolling code block

When a line is too wide to fit, the block scrolls horizontally — so it becomes a focusable region you can reach with <kbd>Tab</kbd> and scroll with the arrow keys:

```js
const html = await renderDeck(markdown, { theme: 'basic', basePath: './decks/my-talk', inlineAssets: true, lang: 'en-GB', prettify: true })
```

Resize the window: a block that starts fitting drops out of the tab order, and one that starts overflowing joins it.

---

## Quote and keystrokes

> Accessibility is not a feature you bolt on at the end. It is a property of building things the right way.

Press <kbd>Tab</kbd> to move forward and <kbd>Shift</kbd> + <kbd>Tab</kbd> to move back.

---

## Table

| Helper     | Use it for                               |
| ---------- | ---------------------------------------- |
| `columns`  | Splitting a slide into equal columns     |
| `grid`     | A set of equal cards                     |
| `cluster`  | Tags, chips, button rows                 |
| `frame`    | Cropping media to a fixed aspect ratio   |

---

## Footer and links

Add a per-slide footer for sources and references.

It renders below the content and is kept out of the screen-reader pagination announcement.

<!-- _footer: '[accessible-marp-decks on npm](https://www.npmjs.com/package/accessible-marp-decks)' -->
