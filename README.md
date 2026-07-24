# Accessible Marp Decks

Render [Marp](https://marp.app/) markdown slide decks into a **standalone, accessible HTML format** — a single web page where every slide is a labelled landmark, headings have stable ids, code blocks are keyboard-focusable figures, and pagination is announced to screen readers.

Use it three ways:

- **CLI** — build a deck folder into a shareable HTML page.
- **Library** — `import { renderDeck }` and render Marp markdown to accessible HTML anywhere.
- **Eleventy plugin** — drop deck files into an [Eleventy](https://www.11ty.dev/) site and get accessible pages.

This project isn't a replacement for Marp or the VSCode preview extension — it's for **sharing** your slides in an accessible format.

## Requirements

- Node.js 20 or newer.

## Install

```sh
npm install accessible-marp-decks
```

## Writing slides

Slides are [Marpit markdown](https://marpit.marp.app/markdown). A deck starts with front matter and separates slides with `---`:

```markdown
---
title: My Talk
description: A short description used for the page <title> and meta description.
paginate: true
marp: true
theme: basic
---

# My Talk

Intro text.

---

## Second slide

More content.
```

To preview slides as you write them, install the [Marp for VSCode extension](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode).

## CLI usage

The package installs an `accessible-marp` binary.

```sh
# Build a named deck (looked up under examples/decks/<name>/slides.md by default)
accessible-marp build layouts --theme basic

# Build a specific markdown file to a chosen output directory
accessible-marp build ./slides.md --out ./public

# List the bundled themes
accessible-marp themes
```

Options:

| Flag | Description |
| --- | --- |
| `--theme`, `-t` | Theme to use. Defaults to the deck's front-matter `theme`. |
| `--out`, `-o` | Output directory. Defaults to `dist/decks/<deck>`. |
| `--decks-dir` | Where named decks live. Defaults to `examples/decks`. |

The build writes `slides.html` plus copies the deck's `images/` and `demos/` folders and the theme `fonts/` next to the output so all relative links resolve.

The legacy `npm run build deck=<name> theme=<name>` form still works.

## Library usage

```js
import { renderDeck, renderDeckFile, listThemes } from 'accessible-marp-decks'

const html = await renderDeck(markdownString, { theme: 'basic' })

// or straight from a file
const html2 = await renderDeckFile('./slides.md', { theme: 'basic' })

await listThemes() // ['basic']
```

### `renderDeck(markdown, options)` → `Promise<string>`

| Option | Default | Description |
| --- | --- | --- |
| `theme` | front matter, else `basic` | A bundled theme name. |
| `css` | — | Raw theme CSS, used instead of a bundled theme. |
| `documentCss` | bundled `document.css` | Override the base accessible-layout CSS. |
| `imageWidth` | `500` | Default `width` applied to images without one. |
| `lang` | `'en'` | Document `lang` attribute. |
| `prettify` | `true` | Pretty-print the HTML output. |

## Eleventy plugin

Render Marp decks as accessible pages inside an [Eleventy](https://www.11ty.dev/) (3.0+) site.

```js
// eleventy.config.js
import accessibleMarp from 'accessible-marp-decks/eleventy'

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(accessibleMarp, {
    // theme: 'basic',   // force one theme for all decks (optional)
  })
}
```

By default the plugin registers a **`.deck`** extension, so any `*.deck` file (containing Marp markdown) is built as an accessible deck page. Using a dedicated extension means your site's normal `.md` files are left untouched.

| Option | Default | Description |
| --- | --- | --- |
| `extension` | `'deck'` | File extension that marks a deck. Set to `'md'` to treat **every** markdown file as a deck (fully overrides Eleventy's markdown rendering). |
| `theme` | per-deck front matter | Force a theme for all decks. |
| `imageWidth` | `500` | Default image width. |
| `lang` | `'en'` | Document language. |

A working demo lives in [`examples/eleventy-demo`](examples/eleventy-demo) — run it with `npm run demo`.

## Accessibility features

For each rendered deck the transform:

- Wraps the slides in a `<main>` landmark.
- Turns every slide `<section>` into a labelled region (`aria-label="Slide N: <heading>"`).
- Gives each slide heading a stable `id` (`slide-N`) and links it to its page number via `aria-describedby`.
- Appends a `<footer>` with screen-reader pagination ("End of slide N").
- Marks code blocks as `role="figure"` with a label and `tabindex="0"` so keyboard users can scroll them.
- Strips Marp's presentational `data-*` attributes from the output.

## Themes

Themes are plain CSS files in [`themes/`](themes). One theme is bundled: **`basic`** (the default).

`basic` ships a single neutral design with **automatic light and dark modes** — its colours come from CSS custom properties, and a `@media (prefers-color-scheme: dark)` block swaps them when the reader's operating system prefers dark. No fonts are bundled; the theme uses the reader's `system-ui` font stack.

To add your own theme, drop a `<name>.css` file in `themes/` with a `/* @theme <name> */` comment at the top (required by the Marp VSCode extension), then reference it via `--theme <name>` or front matter. The quickest way to make one is to copy [`themes/basic.css`](themes/basic.css) and re-colour the variables at the top.

## Development

```sh
npm install
npm test        # node:test — accessibility, theme resolution, Eleventy smoke
npm run lint    # standard
npm run demo    # build the Eleventy demo site
```

The publishable package is the engine (`src/`) and `themes/`. The single `layouts` deck under `examples/decks` is a demo of the slide layouts the renderer supports and is excluded from the npm tarball.

## License

ISC
