---

title: Layout gallery
description: A single deck showing the layout primitives accessible-marp-decks can render.
paginate: false
marp: true
theme: basic

---

<!-- _class: title -->

# Layout gallery

A single deck that shows off the slide template, the pre-built layouts, and the layout **primitives** in **accessible-marp-decks**.

<!-- _footer: 'The first nine slides follow the order of the standard PowerPoint layout picker.' -->

---

<!-- _class: title -->

## Title slide

This slide uses the `title` layout, which is usually the first slide to introduce your talk.

<!-- _footer: `_class: title` -->

---

## Title and content

The default slide. A heading followed by content in a single column. No Marp `_class` / directive needed to use this layout.

---

<!-- _class: section -->

## Section header

The `section` layout is used to break your talk into distinct parts.

<!-- _footer: `_class: section` -->

---

<!-- _class: two-content -->

## Two content

The `two-content` layout is used to split a slide in half. The heading spans the full width of the slide, then two blocks sit side by side underneath. A block can be a list, a paragraph, an image etc.


![A placeholder graphic with a circle and a rounded rectangle.](./images/placeholder.svg)

<!-- _footer: `_class: two-content` -->

---

<!-- _class: comparison -->

## Comparison

### Similar to two-content, but the body content is kept aligned

- Bullet point 1
- Bullet point 2
- Bullet point 3

### This helps for comparisons

- Bullet point 4
- Bullet point 5
- Bullet point 6

<!-- _footer: `_class: comparison` -->

---

<!-- _class: title-only -->

## Title only

<!-- _footer: `_class: title-only` -->

---

<!-- _footer: 'Blank slide example.' -->

---

<!-- _class: content-caption -->

## Content with caption

This muted paragraph is the caption. It comes first in the source and takes the narrow column.

The content block sits beside it. It gets two thirds of the width. The built deck renders a true `<figure>` with a `<figcaption>`.

<!-- _footer: `_class: content-with-caption` -->

---

<!-- _class: picture-caption -->

## Picture with caption

![A placeholder graphic with a circle and a rounded rectangle.](./images/placeholder.svg)

The muted caption sits under the picture, like PowerPoint's Picture with Caption. The built deck renders a `<figure>` with a `<figcaption>`.

<!-- _footer: `_class: picture-caption` -->

---

<!-- _class: quote -->

> Quotes with an attribution are rendered as a `<figure>` with a nested `<blockquote>`. To add an attribution, add it as a list with a single item in your Markdown. In the built deck the it becomes a `<figcaption>`. Also, if you make the attribution a link, it will be added as the blockquote's `cite` URL.

- [Craig Abbott](https://www.craigabbott.co.uk)

<!-- _footer: `_class: quote` -->

---

<!-- _class: full-image -->

![A placeholder graphic with a circle and a rounded rectangle, filling the whole slide.](./images/placeholder.svg)

<!-- _footer: '`_class: full-image`' -->

---

<!-- _class: quote -->

> Quotes will be rendered as a `<blockquote>` if they do not have an attribution. If you want to add an attribution, you can add a single list item. See the next slide for more details.

<!-- _footer: `_class: quote` -->

---

<!-- _class: section -->

## How it works

Now that you've seen the layouts, this section explains a little more about how it works and how to get the most out of this project. Each slide is built to showcase the different HTML elements you can use.

---

## The slide template

<!-- _header: 'The `_header` content will render at the top' -->

The slide template is the main container for the slides. It's built to use Marp's own `_header` and `_footer` directives. The regular slide content will render in the middle.

<!-- _footer: 'The `_footer` content will render at the bottom' -->

---

## Some accessibility features

- Every slide is a labelled landmark
- Headings have stable ids
- Code blocks are keyboard-focusable figures
- Pagination is announced to screen readers
- Images keep their alt text
- Figures are generated automatically

---

## How to use it

1. Write your slides in Marp markdown
2. Pick (or build) a theme
3. Run the CLI, library, or Eleventy plugin
4. Ship a single, standalone accessible HTML page

---

<!-- _class: section -->

## Primitives

We've looked at **layouts** already, picked with a directive. From here on, each slide is composed by hand from the layout using **helper classes**. These are small bits of CSS you put on raw HTML inside the slide, if you need more control.

---

## Columns, for when a layout isn't enough

The `two-content` layout places one block per side. The `columns` helper gives you more control over which part of the page is in columns.

<div class="columns columns-3">
<div class="box">

### Any count

Add `columns-3` for three columns.

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

## Grid, creating responsive cards

A `grid` auto-fits as many equal cards as will fit, each at least `14em` wide.

<div class="grid">
  <div class="box">Card 1</div>
  <div class="box">Card 2</div>
  <div class="box">Card 3</div>
  <div class="box">Card 4</div>
</div>

---

<div class="stack">
  <h2>Stack, for even vertical rhythm</h2>
  <p>
    A `stack` puts a consistent space between each child, whatever they are.
  </p>
  <p>
    The gap between items is the same all the way down.
  </p>
  <p>
    Change the rhythm with <code>stack--s</code> or <code>stack--l</code>.
  </p>
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
| `frame`    | Cropping media to a fixed aspect ratio   |

---

## Footer and links

Add a per-slide footer for sources and references.

It renders below the content and is kept out of the screen-reader pagination announcement.

<!-- _footer: '[accessible-marp-decks on npm](https://www.npmjs.com/package/accessible-marp-decks)' -->
