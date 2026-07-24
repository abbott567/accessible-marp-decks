# Changelog

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] — 2026

Version 2 is a ground-up modernisation. The rendered output is now a single, self-contained, responsive, accessible file, and the project ships as an ESM package usable as a CLI, a library, an Eleventy plugin, or a GitHub Action.

### Added

- **Single-file output** — local images are base64-inlined into the page, so a built deck is one self-contained HTML file (`inlineAssets`, `basePath` render options).
- **Responsive 16:9 scaling** — each fixed-size slide is scaled to the window as one rigid unit via CSS `zoom` (a small inlined script sets the scale factor), so text, spacing, and layout shrink together and nothing reflows. Browser page zoom still enlarges the deck (the script compensates via `devicePixelRatio`), per WCAG 1.4.4.
- **Layout helpers** — slide-native `box`, `stack`, `cluster`, `columns`, `grid`, `center`, `frame`, `cover`, `sidebar`, and `overlay-centre` classes.
- **Smarter code-block focus** — code blocks are keyboard-scrollable by default (no-JS safe), and a tiny inlined script removes the tab stop from blocks that don't actually overflow, re-checking on resize.
- **`build-all <dir>`** CLI command — builds every deck in a folder and writes an accessible landing page linking them.
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

### Fixed

- Slides in decks without `paginate: true` are now numbered by position instead of being labelled "Slide undefined".

### Removed

- The `imageWidth` option (images are now sized responsively by CSS).
- The SASS build and the dead dependencies from 1.x (`node-sass`, `html-minifier`, and others).

[2.0.0]: https://github.com/abbott567/accessible-marp-decks/releases/tag/v2.0.0
