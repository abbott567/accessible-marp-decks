#!/usr/bin/env node
import { parseArgs } from 'node:util'
import { readFile, writeFile, mkdir, cp, stat, readdir } from 'node:fs/promises'
import { dirname, join, basename, resolve } from 'node:path'
import { renderDeck, readDeckInfo } from './core/render.js'
import { listThemes } from './core/themes.js'
import { escapeHtml } from './core/escape.js'

const USAGE = `accessible-marp — build accessible HTML decks from Marp markdown

Usage:
  accessible-marp build <deck|path> [--theme <name>] [--out <dir>] [--decks-dir <dir>]
  accessible-marp build-all <dir> [--theme <name>] [--out <dir>]
  accessible-marp themes
  accessible-marp --help

Arguments:
  <deck|path>          A deck name (resolved under --decks-dir) or a path to a .md file.
  <dir>                A directory of decks (each a folder containing slides.md).

Options:
  --theme, -t <name>   Theme to use. Defaults to the deck's front-matter theme.
  --out, -o <dir>      Output directory. Defaults to dist/decks/<deck> (build)
                       or dist/site (build-all).
  --decks-dir <dir>    Where named decks live. Defaults to examples/decks.
  --help, -h           Show this help.

Examples:
  accessible-marp build layouts --theme basic
  accessible-marp build ./slides.md --out ./public
  accessible-marp build-all examples/decks --out _site
  npm run build deck=layouts theme=basic`

async function exists (p) {
  try {
    await stat(p)
    return true
  } catch {
    return false
  }
}

/** Accept legacy `key=value` tokens (e.g. `deck=x theme=y`) alongside flags. */
function extractLegacyTokens (argv) {
  const legacy = {}
  const rest = []
  for (const arg of argv) {
    const m = /^(deck|theme|out)=(.*)$/.exec(arg)
    if (m) legacy[m[1]] = m[2]
    else rest.push(arg)
  }
  return { legacy, rest }
}

/**
 * Render one deck's markdown to `<outDir>/<htmlName>` and copy any `demos/`.
 * Returns metadata about the built deck.
 */
async function buildOne ({ mdPath, sourceDir, deckName, outDir, theme, htmlName }) {
  const markdown = await readFile(mdPath, 'utf8')
  const html = await renderDeck(markdown, { theme, basePath: sourceDir })

  await mkdir(outDir, { recursive: true })
  await writeFile(join(outDir, htmlName), html)

  // Images are base64-inlined into the page, so only companion `demos/`
  // (standalone linked HTML pages) need copying next to the output.
  const demosSrc = join(sourceDir, 'demos')
  if (await exists(demosSrc)) {
    await cp(demosSrc, join(outDir, 'demos'), { recursive: true })
  }

  const info = readDeckInfo(markdown)
  return { deckName, title: info.title || deckName, description: info.description || '' }
}

async function buildCommand (deckArg, opts) {
  const decksDir = opts['decks-dir'] || 'examples/decks'

  // Resolve the markdown source: a path, or a named deck under decksDir.
  // Anything containing a separator (either flavour, so Windows paths work)
  // or ending in .md is a path; a bare word is a deck name.
  let mdPath
  let deckName
  let sourceDir
  if (deckArg.endsWith('.md') || /[\\/]/.test(deckArg)) {
    mdPath = resolve(deckArg)
    sourceDir = dirname(mdPath)
    deckName = basename(mdPath, '.md')
    // A conventional `<name>/slides.md` should be named after its folder.
    if (deckName === 'slides') deckName = basename(sourceDir)
  } else {
    deckName = deckArg
    sourceDir = resolve(decksDir, deckName)
    mdPath = join(sourceDir, 'slides.md')
  }

  if (!(await exists(mdPath))) {
    throw new Error(`Deck not found: ${mdPath}`)
  }

  const outDir = resolve(opts.out || join('dist', 'decks', deckName))
  await buildOne({ mdPath, sourceDir, deckName, outDir, theme: opts.theme, htmlName: 'slides.html' })
  console.log(`Built "${deckName}" → ${join(outDir, 'slides.html')}`)
}

async function buildAllCommand (dir, opts) {
  const root = resolve(dir)
  if (!(await exists(root))) throw new Error(`Directory not found: ${root}`)

  const entries = await readdir(root, { withFileTypes: true })
  const outRoot = resolve(opts.out || join('dist', 'site'))

  const built = []
  const failures = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const sourceDir = join(root, entry.name)
    const mdPath = join(sourceDir, 'slides.md')
    if (!(await exists(mdPath))) continue

    // Each deck becomes /<name>/index.html for clean URLs on a static host.
    // One broken deck must not abort the site — collect failures and keep going.
    try {
      const meta = await buildOne({
        mdPath,
        sourceDir,
        deckName: entry.name,
        outDir: join(outRoot, entry.name),
        theme: opts.theme,
        htmlName: 'index.html'
      })
      built.push(meta)
      console.log(`Built "${entry.name}" → ${join(outRoot, entry.name, 'index.html')}`)
    } catch (err) {
      failures.push(entry.name)
      console.error(`Failed "${entry.name}": ${err.message}`)
    }
  }

  if (built.length === 0 && failures.length === 0) {
    throw new Error(`No decks (folders containing slides.md) found in ${root}`)
  }

  if (built.length > 0) {
    await writeFile(join(outRoot, 'index.html'), renderIndex(built))
    console.log(`Wrote index → ${join(outRoot, 'index.html')} (${built.length} decks)`)
  }

  if (failures.length > 0) {
    throw new Error(`${failures.length} of ${built.length + failures.length} decks failed to build`)
  }
}

/** A minimal, accessible landing page linking to each built deck. */
function renderIndex (decks) {
  const items = decks
    .sort((a, b) => a.title.localeCompare(b.title))
    .map(d => `      <li>
        <a href="./${encodeURIComponent(d.deckName)}/">${escapeHtml(d.title)}</a>
        ${d.description ? `<p>${escapeHtml(d.description)}</p>` : ''}
      </li>`)
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Slide decks</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: system-ui, sans-serif; max-width: 44rem; margin: 0 auto; padding: 2rem 1rem; line-height: 1.5; }
      ul { list-style: none; padding: 0; }
      li { margin: 0 0 1.5rem; }
      a { font-size: 1.25rem; }
      p { margin: .25rem 0 0; color: #555; }
      @media (prefers-color-scheme: dark) {
        body { background: #111; color: #eee; } p { color: #aaa; } a { color: #8ab4f8; }
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Slide decks</h1>
      <ul>
${items}
      </ul>
    </main>
  </body>
</html>
`
}

async function main () {
  const { legacy, rest } = extractLegacyTokens(process.argv.slice(2))

  const { values, positionals } = parseArgs({
    args: rest,
    allowPositionals: true,
    options: {
      theme: { type: 'string', short: 't' },
      out: { type: 'string', short: 'o' },
      'decks-dir': { type: 'string' },
      help: { type: 'boolean', short: 'h' }
    }
  })

  if (values.help) {
    console.log(USAGE)
    return
  }

  const command = positionals[0]

  if (command === 'themes') {
    const themes = await listThemes()
    console.log(themes.join('\n'))
    return
  }

  const opts = {
    theme: values.theme || legacy.theme,
    out: values.out || legacy.out,
    'decks-dir': values['decks-dir']
  }

  if (command === 'build-all') {
    const dir = positionals[1]
    if (!dir) throw new Error('No directory specified. See --help.')
    await buildAllCommand(dir, opts)
    return
  }

  if (command === 'build' || legacy.deck) {
    const deckArg = positionals[1] || legacy.deck
    if (!deckArg) throw new Error('No deck specified. See --help.')
    await buildCommand(deckArg, opts)
    return
  }

  console.log(USAGE)
}

main().catch((err) => {
  console.error(`Error: ${err.message}`)
  process.exitCode = 1
})
