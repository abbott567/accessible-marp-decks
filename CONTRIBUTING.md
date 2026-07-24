# Contributing

Thanks for your interest in improving Accessible Marp Decks! Contributions of all kinds are welcome — bug reports, docs, themes, and code.

## Getting set up

```sh
git clone https://github.com/abbott567/accessible-marp-decks
cd accessible-marp-decks
npm install
npm test
```

Requires Node.js 20 or newer.

## Handy scripts

| Command | What it does |
| --- | --- |
| `npm test` | Runs the `node:test` suite. |
| `npm run coverage` | Runs the suite enforcing 100% line/branch/function coverage. Needs Node ≥ 22.8 (the threshold flags aren't in Node 20). |
| `npm run lint` | Lints `src` and `test` with [standard](https://standardjs.com). |
| `npm run build -- layouts` | Builds the example deck to `dist/decks/layouts`. |
| `npm run build:site` | Builds all example decks to `_site` with a landing page. |
| `npm run demo` | Builds the Eleventy demo site. |

## Guidelines

- **Accessibility is the point.** Changes to the rendering pipeline must keep the guarantees in [docs/accessibility.md](docs/accessibility.md). If you change the transforms, add or update a test that pins the behaviour.
- **Keep transforms element-scoped.** Modifications for an element live in their own file (`src/core/transforms/_section.js`, `_img.js`, `_code.js`).
- **Author slide CSS in `em`/`%`**, never `px`, so slides keep scaling. See [docs/creating-themes.md](docs/creating-themes.md).
- **Match the code style.** `standard` (no semicolons); run `npm run lint` before opening a PR.
- **Add a changelog entry** under "Unreleased" in `CHANGELOG.md` for anything user-facing.

## Pull requests

1. Fork and branch off `main`.
2. Make your change with tests and lint passing.
3. Open a PR describing the change and the motivation.

By contributing, you agree that your contributions are licensed under the project's [ISC License](LICENSE).

Please also read our [Code of Conduct](CODE_OF_CONDUCT.md).
