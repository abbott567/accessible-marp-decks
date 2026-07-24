# Accessible Marp Decks

Render [Marp](https://marp.app/) markdown slide decks into a **single, self-contained, accessible HTML page** — every slide is a labelled landmark, headings have stable ids, long code lines wrap instead of scrolling, pagination is announced to screen readers, images are inlined, and the whole thing scales to any window in 16:9 without reflowing.

Use it four ways:

- **CLI** — build a deck (or a whole folder) into shareable HTML.
- **Library** — `import { renderDeck }` and render Marp markdown anywhere.
- **Eleventy plugin** — drop deck files into an [Eleventy](https://www.11ty.dev/) site.
- **GitHub Action** — publish decks to GitHub Pages on push, no command line.

This project isn't a replacement for Marp or the VSCode preview extension — it's for **sharing** your slides in an accessible format.

## Requirements

- Node.js 24 (LTS) — the version pinned in [`.nvmrc`](.nvmrc). Older versions may work but aren't tested.

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

Every slide is built on a template with a top and bottom zone — Marp's `header:` and `footer:` directives fill them. Pick a whole-slide look with `<!-- layout: title -->` (`title`, `quote`, `full-image`, …), or compose richer slides with the [layout helpers](docs/layouts.md) (`columns`, `grid`, `cluster`, `frame`, …). To preview as you write, install the [Marp for VSCode extension](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode).

## What you get out

A built deck is **one HTML file**. CSS is inlined, images are base64-encoded into the page, and the slides scale to fit the window. Nothing else needs to ship alongside it (except any linked `demos/` pages), so it's trivial to email, host, or attach.

## CLI usage

The package installs an `accessible-marp` binary.

```sh
# Build a named deck (looked up under examples/decks/<name>/slides.md by default)
accessible-marp build layouts --theme basic

# Build a specific markdown file to a chosen output directory
accessible-marp build ./slides.md --out ./public

# Build every deck in a folder into a browsable site with a landing page
accessible-marp build-all decks --out _site

# List the bundled themes
accessible-marp themes
```

Options:

| Flag | Description |
| --- | --- |
| `--theme`, `-t` | Theme to use. Defaults to the deck's front-matter `theme`. |
| `--out`, `-o` | Output directory. Defaults to `dist/decks/<deck>` (or `dist/site` for `build-all`). |
| `--decks-dir` | Where named decks live. Defaults to `examples/decks`. |

`build` writes a single `slides.html` (plus any `demos/` folder). `build-all` writes each deck to `<out>/<name>/index.html` and an accessible landing page at `<out>/index.html`; if a deck fails, the rest are still built and the command exits non-zero with a summary. The legacy `npm run build deck=<name> theme=<name>` form still works.

## Library usage

```js
import { renderDeck, renderDeckFile, listThemes } from 'accessible-marp-decks'

const html = await renderDeck(markdownString, { theme: 'basic', basePath: './my-deck' })

// or straight from a file (basePath defaults to the file's directory)
const html2 = await renderDeckFile('./my-deck/slides.md', { theme: 'basic' })

await listThemes() // ['basic', 'high-contrast']
```

### `renderDeck(markdown, options)` → `Promise<string>`

| Option | Default | Description |
| --- | --- | --- |
| `theme` | front matter, else `basic` | A bundled theme name. |
| `css` | — | Raw theme CSS, used instead of a bundled theme. An `/* @theme */` comment is added automatically if missing. |
| `documentCss` | bundled `document.css` | Override the base accessible-layout CSS. |
| `basePath` | — | Directory used to resolve and inline relative image paths. |
| `inlineAssets` | `true` | Base64-inline local images for a single-file output. |
| `lang` | `'en'` | Document `lang` attribute. |
| `runtimeScript` | `true` | Inline the code-block scrolling enhancement script. Set `false` for strict-CSP hosts. |
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
| `lang` | `'en'` | Document language. |

Images are inlined into each page automatically. Companion `demos/` folders (standalone HTML pages your slides link to) are **not** copied by the plugin — add a passthrough copy for them in your Eleventy config if you use them:

```js
eleventyConfig.addPassthroughCopy('content/**/demos/**')
```

A working demo lives in [`examples/eleventy-demo`](examples/eleventy-demo) — run it with `npm run demo`.

## GitHub Action

Publish decks to GitHub Pages on every push — no command line. Add one workflow and enable Pages; full walkthrough in [docs/github-action.md](docs/github-action.md).

```yaml
- name: Build decks
  uses: abbott567/accessible-marp-decks@v2
  with:
    decks-dir: decks
    out: _site
- uses: actions/upload-pages-artifact@v5
  with:
    path: _site
```

## Layouts and themes

- **Slide template** — every slide has a top and bottom zone filled by Marp's `header:`/`footer:` directives; the body is centred between them.
- **Pre-built layouts** — `title`, `quote`, `full-image` via the `layout:` directive. See [docs/layouts.md](docs/layouts.md).
- **Layout helpers** — `box`, `stack`, `cluster`, `columns`, `grid`, `center`, `frame`, `cover`, `sidebar`, `overlay-centre`. See [docs/layouts.md](docs/layouts.md).
- **Themes** live in [`themes/`](themes). Two are bundled: **`basic`** (the default) and **`high-contrast`** — both neutral designs with automatic light/dark modes via `prefers-color-scheme`, using the reader's `system-ui` font. To make your own, copy [`themes/_template.css`](themes/_template.css) and recolour it — see [docs/creating-themes.md](docs/creating-themes.md).

## Accessibility

Every rendered deck is a labelled-landmark structure with screen-reader pagination, wrap-by-default code blocks (with a keyboard-scrollable safety net for custom themes), and reflow-free 16:9 scaling. The full list of guarantees is in [docs/accessibility.md](docs/accessibility.md).

## Development

```sh
npm install
npm test        # node:test — accessibility, images, scaling, layouts, CLI, Eleventy
npm run lint    # standard
npm run build:site   # build the example decks into _site/
npm run demo    # build the Eleventy demo site
```

The publishable package is the engine (`src/`) and `themes/`. The `layouts` deck under `examples/decks` is a demo of the layouts the renderer supports and is excluded from the npm tarball.

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md). Security reports: [SECURITY.md](SECURITY.md).

## License

[ISC](LICENSE). Third-party credits are in [NOTICE](NOTICE).
