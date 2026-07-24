---

title: Layout gallery
description: A single deck showing the slide layouts accessible-marp-decks can render.
paginate: true
marp: true
theme: basic

---

# Layout gallery

A single deck that shows off the layouts **accessible-marp-decks** can render.

Each slide that follows is one layout. Build it with:

```sh
accessible-marp build layouts --theme basic
```

---

## Title and prose

The simplest layout: a heading followed by paragraphs.

Headings get a stable id and an `aria-label`, and the paragraph text flows in a single readable column.

This is the default — write Markdown, get an accessible slide.

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

## Two columns

<div class="row">
  <div class="col">

### Left column

Wrap content in a `.row` with two `.col` children to split a slide into columns.

Use it for a point on one side and supporting detail on the other.

  </div>
  <div class="col">

### Right column

The columns are flexbox, so they share the width evenly and stack predictably.

Keep each column to a single idea so the reading order stays clear.

  </div>
</div>

---

## Code block

Fenced code becomes a focusable `<figure>` with syntax highlighting:

```js
import { renderDeck } from 'accessible-marp-decks'

const html = await renderDeck(markdown, { theme: 'basic' })
```

The figure is reachable with the keyboard so the highlighted code can be scrolled.

---

## Quote and keystrokes

> Accessibility is not a feature you bolt on at the end. It is a property of building things the right way.

Press <kbd>Tab</kbd> to move forward and <kbd>Shift</kbd> + <kbd>Tab</kbd> to move back.

---

## Table

| Layout      | Use it for                          |
| ----------- | ----------------------------------- |
| Prose       | A single idea per slide             |
| Lists       | Sequential or unordered points      |
| Two columns | Comparing or pairing two things     |
| Code        | Showing a focusable, highlighted snippet |

---

## Image

![A placeholder graphic with a circle and a rounded rectangle.](./images/placeholder.svg)

Images keep their alt text and are constrained to a sensible width, so they stay accessible and don't overflow the slide.

---

## Footer and links

Add a per-slide footer for sources and references.

It renders below the content and is kept out of the screen-reader pagination announcement.

<!-- _footer: '[accessible-marp-decks on npm](https://www.npmjs.com/package/accessible-marp-decks)' -->
