---

title: Layout gallery
description: A single deck showing the layout primitives accessible-marp-decks can render.
paginate: true
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

<!-- _footer: '`_class: title`' -->

---

## Title and content

The default slide. A heading followed by content in a single column. No Marp `_class` / directive needed to use this layout.

---

<!-- _class: section -->

## Section header

The `section` layout is used to break your talk into distinct parts.

<!-- _footer: '`_class: section`' -->

---

<!-- _class: two-content -->

## Two content

The `two-content` layout is used to split a slide in half. The heading spans the full width of the slide, then two blocks sit side by side underneath. A block can be a list, a paragraph, an image etc.


![An empty placeholder image.](./images/placeholder.png)

<!-- _footer: '`_class: two-content`' -->

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

<!-- _footer: '`_class: comparison`' -->

---

<!-- _class: title-only -->

## Title only

<!-- _footer: '`_class: title-only`' -->

---

<!-- _footer: 'Blank slide example.' -->

---

<!-- _class: content-caption -->

## Content with caption

This muted paragraph is the caption. It comes first in the source and takes the narrow column.

The content block sits beside it. It gets two thirds of the width. The built deck renders a true `<figure>` with a `<figcaption>`.

<!-- _footer: '`_class: content-caption`' -->

---

<!-- _class: picture-caption -->

## Picture with caption

![An empty placeholder image.](./images/placeholder.png)

The muted caption sits under the picture, like PowerPoint's Picture with Caption. The built deck renders a `<figure>` with a `<figcaption>`.

<!-- _footer: '`_class: picture-caption`' -->

---

<!-- _class: quote -->

> Quotes with an attribution are rendered as a `<figure>` with a nested `<blockquote>`. To add an attribution, add it as a list with a single item in your Markdown. In the built deck the it becomes a `<figcaption>`. Also, if you make the attribution a link, it will be added as the blockquote's `cite` URL.

- [Craig Abbott](https://www.craigabbott.co.uk)

<!-- _footer: '`_class: quote`' -->

---

<!-- _class: full-image -->

![A placeholder graphic with a circle and a rounded rectangle, filling the whole slide.](./images/placeholder.png)

<!-- _footer: '`_class: full-image`' -->

---

<!-- _class: quote -->

> Quotes will be rendered as a `<blockquote>` if they do not have an attribution. If you want to add an attribution, you can add a single list item. See the next slide for more details.

<!-- _footer: '`_class: quote`' -->

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

## Frame, maintain the aspect ratio on media

A `frame` crops an image or video to a fixed ratio.

<div class="frame" style="max-inline-size: 55%">

![An empty placeholder image.](./images/placeholder.png)

</div>

---

## Code block

Fenced code blocks. Add the language to the opening backticks for syntax highlighting.

```js
import { renderDeck } from 'accessible-marp-decks'

const html = await renderDeck(markdown, { theme: 'basic' })
```

---

## Keystrokes

Press <kbd>Tab</kbd> to move forward and <kbd>Shift</kbd> + <kbd>Tab</kbd> to move back.

---

## Table

| Helper     | Use it for                               |
| ---------- | ---------------------------------------- |
| `columns`  | Splitting a slide into equal columns     |
| `grid`     | A set of equal cards                     |
| `frame`    | Cropping media to a fixed aspect ratio   |
