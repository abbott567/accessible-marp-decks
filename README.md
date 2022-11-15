# Accessible Marp Decks

This is a personal project which leverages other open source projects. You are free to use it.

This project is not intended to replace Marp or the VSCode extension, but is instead to share your slides in an accessible format. 

The slides produced by this project will be converted into an accessible webpage.

## Marp framework

This project uses [Marp](https://marp.app/). You should read the [Marpit Markdown documentation](https://marpit.marp.app/markdown) to understand how to build slides.

## VSCode Extension

To preview your slides as you build them, you should install the [Marp for VSCode extension](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode).

## Creating themes

Themes must be stored in the `dist/themes` folder and referenced in the `.vscode/settings.json` file. For example:

File path:
```
dist/themes/handwritten.css
```

.vscode/settings.json:
```json
{
  "markdown.marp.themes": [
    "dist/themes/handwritten.css"
  ]
}
```

In order for the VSCode extension to recognise the theme, you must add the name as a comment at the top of the CSS file. For example:

dist/themes/handwritten.css
```css
/* @theme handwritten */
/*!
 * @auto-scaling true
 * @size 16:9 1280px 720px
 * @size 4:3 960px 720px
 */
```

### SASS

You can build themes using SASS, but you will need to compile them before they can be used by the extension or in the shareable output. 

Command line example:
```
node-sass src/sass/themes/dwp-theme/all.scss dist/themes/dwp-theme.css
```

## Building a deck for sharing

Once you have finished your deck, to create an accessible shareable version, use the following command and replace the values with the folder name of the deck and the theme you wish to use:

```
npm run build deck=deck-folder theme=theme-name
```

A working example would be:
```
npm run build deck=my-adhd-and-me theme=handwritten
```

## Fonts

If you use custom fonts, you will need to install them on your device for them to work with the Marp extension and the previews it generates. It will not use web-fonts from within the project linked to with CSS.

When you export your project, you will need to package up the fonts like you would any other web-fonts for them to work.

See dist/handwritten for an example.