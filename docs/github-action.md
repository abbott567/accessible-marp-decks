# Publishing decks with GitHub Actions

You can build and publish your decks to GitHub Pages on every push — no command line needed. Put your decks in a folder (each deck is a folder containing a `slides.md`), add one workflow file, and enable Pages.

## 1. Lay out your decks

```
decks/
  my-talk/
    slides.md
    images/…
  another-talk/
    slides.md
```

## 2. Add the workflow

Create `.github/workflows/decks.yml`:

```yaml
name: Deploy decks

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - name: Build decks
        uses: abbott567/accessible-marp-decks@v2
        with:
          decks-dir: decks
          out: _site
          # theme: basic          # optional: force one theme for all decks
      - uses: actions/upload-pages-artifact@v5
        with:
          path: _site

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

## 3. Enable Pages

In your repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Push to `main` (or run the workflow manually). Your decks are published at `https://<user>.github.io/<repo>/`, with a landing page linking each deck and each deck at `/<deck-name>/`.

## Action inputs

| Input | Default | Description |
| --- | --- | --- |
| `decks-dir` | `decks` | Folder of decks (each a folder with `slides.md`). |
| `out` | `_site` | Output directory for the built site. |
| `theme` | — | Force one theme for every deck. Omit to honour each deck's front matter. |
| `version` | `latest` | npm version/dist-tag of `accessible-marp-decks` to run. |
| `node-version` | `24` | Node.js version to set up. |

## Without the action

The action just runs the CLI, so any CI can do the same:

```sh
npx accessible-marp-decks build-all decks --out _site
```
