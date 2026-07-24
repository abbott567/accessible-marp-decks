# Changelog

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] — Unreleased

### Added

- **Slide template zones** — every slide is built on the cover shape: Marp's `header:` and `footer:` directives fill real top and bottom zones in the slide's flow (not absolute overlays), with the body centred between them so content can never collide with a zone.
- **Pre-built layouts** — pick a whole-slide look with the new `layout:` directive (`title`, `quote`, `full-image`, or any slide-level class). `layout:` is renderer-provided sugar for the class directive; `_layout:` is the one-slide form.
- **PowerPoint-parity layouts** — the standard PowerPoint set as `layout:` values: `section`, `title-only`, `two-content`, `comparison`, `content-caption`, and `picture-caption` (Title Slide is `title`; Title and Content and Blank are the default slide). The two-column ones are CSS grid with one block per content region.

### Changed

- Code blocks in the bundled themes **wrap** long lines instead of scrolling. Slides render at a fixed size, so an overflowing block hid the same content from every viewer — and a projected slide can't be scrolled. The keyboard-focus machinery remains as a safety net: it only activates for blocks that genuinely overflow (e.g. under a custom theme that restores `nowrap`).

### Fixed

- The updated `.frame` helper (no forced centring) is carried to every bundled theme, not just `basic` — the cross-theme drift guard now delimits the shared layout block with an explicit end marker.

## [2.0.0] — 2026

Version 2 is a ground-up modernisation. The rendered output is now a single, self-contained, responsive, accessible file, and the project ships as an ESM package usable as a CLI, a library, an Eleventy plugin, or a GitHub Action.

### Added

- **Single-file output** — local images are base64-inlined into the page, so a built deck is one self-contained HTML file (`inlineAssets`, `basePath` render options).
- **Responsive 16:9 scaling** — each fixed-size slide is scaled to the window as one rigid unit via CSS `zoom` (a small inlined script sets the scale factor), so text, spacing, and layout shrink together and nothing reflows. Browser page zoom still enlarges the deck (the script compensates via `devicePixelRatio`), per WCAG 1.4.4.
- **Layout helpers** — slide-native `box`, `stack`, `cluster`, `columns`, `grid`, `center`, `frame`, `cover`, `sidebar`, and `overlay-centre` classes.
- **Smarter code-block focus** — code blocks are keyboard-scrollable by default (no-JS safe), and a tiny inlined script removes the tab stop from blocks that don't actually overflow, re-checking on resize.
- **`build-all <dir>`** CLI command — builds every deck in a folder and writes an accessible landing page linking them. A failing deck doesn't abort the site: the rest are built, the failure is reported, and the command exits non-zero with a summary.
- **GitHub Action** — a reusable composite `action.yml` plus an example Pages-deploy workflow, so decks can be published without a command line.
- **Theme template** — `themes/_template.css`, a documented, self-contained starter to copy and recolour.
- **`high-contrast` theme** — a second bundled theme (pure black/white, auto light/dark).
- **`runtimeScript` render option** — set `false` to omit the inlined code-block script for strict-CSP hosts.
- **Tests** (`node:test`) and **CI** covering accessibility invariants, image inlining, scaling, layout helpers, theme resolution, the CLI, and the Eleventy plugin — with 100% line, branch, and function coverage enforced in CI.

### Changed

- Rewritten as **ESM** with package `exports` (`.` and `./eleventy`) and an `accessible-marp` bin.
- Transforms are **element-scoped** files — `_section.js`, `_img.js`, `_code.js`.
- The `basic` theme is re-authored in `em` units with automatic light/dark modes.
- Dependencies trimmed to the five that are actually used.
- js-beautify is loaded on demand — rendering with `prettify: false` never loads it.
- Node 24 (LTS) is the development, CI, and Action runtime, pinned in `.nvmrc`; the npm `engines` field is no longer set.

### Fixed

- Code fences without a language (or with an unrecognised one) now escape their content instead of injecting it into the page as raw HTML.
- Slides with several headings no longer emit duplicate `slide-N` ids or concatenate every heading into the slide's `aria-label` — only the first heading is used. Heading-less slides are labelled `"Slide N"` with no dangling colon.
- Slide background images (`![bg](…)`) are now base64-inlined like every other image, so decks with backgrounds stay a single self-contained file. The consumed `data-background-image` and `data-marpit-pagination-total` attributes are stripped from the output.
- Applying a helper to a whole slide with `<!-- _class: … -->` now actually works: Marpit scopes bare class selectors to descendants of the slide, so the documented pattern silently did nothing. Themes now ship slide-level variants (`cover`, `center`, `stack`) written as `section.X`, and Marpit's bookkeeping `data-class` attribute is stripped.
- The `css` render option no longer requires a `/* @theme */` comment — one is prepended automatically, instead of Marpit rejecting the CSS.
- Image srcs are treated as URLs when inlining: percent-escapes are decoded (`my%20image.png` finds `my image.png` on disk) and query strings/fragments are ignored, instead of silently leaving a broken reference.
- The runtime script re-evaluates code-block focus after web fonts finish loading and observes the blocks directly — slides are fixed-size, so a block's overflow can change without the deck resizing.
- The CLI recognises backslash-separated (Windows) paths as paths rather than deck names, and CI now also runs the suite on Windows.
- Slides in decks without `paginate: true` are now numbered by position instead of being labelled "Slide undefined".

### Security

- The GitHub Action passes its inputs to the build script via environment variables instead of interpolating `${{ }}` expressions into bash, closing a shell-injection surface.

### Removed

- The `imageWidth` option (images are now sized responsively by CSS).
- The SASS build and the dead dependencies from 1.x (`node-sass`, `html-minifier`, and others).

[2.0.0]: https://github.com/abbott567/accessible-marp-decks/releases/tag/v2.0.0
