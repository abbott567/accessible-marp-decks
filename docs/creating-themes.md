# Creating a theme

A theme controls colours, type, and element styling. The responsive 16:9 scaling and the accessibility utilities come from the always-injected `document.css`, so a theme doesn't have to set those up.

## Quick start

1. Copy the template:

   ```sh
   cp themes/_template.css themes/midnight.css
   ```

2. Rename the theme on the first line to match the file name:

   ```css
   /* @theme midnight */
   ```

3. Edit the colours in **EDIT ZONE 1** (light mode, and the dark-mode block). For most themes that's the only change you need.

4. Optionally tweak the fonts in **EDIT ZONE 2** and the element styles further down.

5. Use it:

   ```sh
   accessible-marp build my-deck --theme midnight
   ```

   or set `theme: midnight` in the deck's front matter.

## The one rule: size things in `em`

Everything inside a slide must be sized in `em` or `%`, never `px`. The slide's font-size tracks the window width, so `em`-based sizes scale with it and the slide never reflows. The template already follows this — keep any new rules the same way.

## Colour tokens

Colours are CSS custom properties so light/dark mode is a single set of overrides. The important ones:

| Token | Used for |
| --- | --- |
| `--bg`, `--fg` | Slide background and text. |
| `--muted` | Footer, pagination, secondary text. |
| `--accent` | Headings and links. |
| `--border` | Rules, table borders, image borders. |
| `--code-bg`, `--chip-bg` | Inline code and the page-number chip. |
| `--focus-bg`, `--focus-fg` | Focus highlight for links and code. |
| `--hl-*` | Syntax-highlighting colours. |

The dark-mode block under `@media (prefers-color-scheme: dark)` overrides the same tokens.

## Previewing in VSCode

Because the layout helpers live in the theme file, the [Marp for VSCode extension](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode) previews them correctly. Register your theme in `.vscode/settings.json`:

```json
{
  "markdown.marp.themes": ["themes/midnight.css"]
}
```

## Fonts

The bundled themes use the reader's `system-ui` font stack, so nothing is downloaded. If you use a web font, add an `@font-face` with the font embedded as a `data:` URI (or self-host it) so the exported deck stays self-contained.

## Sharing a theme

A theme file is plain CSS you own — the primitives and scaling aren't baked in from anywhere proprietary — so you can share or publish it freely.
