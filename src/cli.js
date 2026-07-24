#!/usr/bin/env node
import { parseArgs } from 'node:util'
import { readFile, writeFile, mkdir, cp, stat } from 'node:fs/promises'
import { dirname, join, basename, resolve } from 'node:path'
import { renderDeck } from './core/render.js'
import { listThemes } from './core/themes.js'

const USAGE = `accessible-marp — build accessible HTML decks from Marp markdown

Usage:
  accessible-marp build <deck|path> [--theme <name>] [--out <dir>] [--decks-dir <dir>]
  accessible-marp themes
  accessible-marp --help

Arguments:
  <deck|path>          A deck name (resolved under --decks-dir) or a path to a .md file.

Options:
  --theme, -t <name>   Theme to use. Defaults to the deck's front-matter theme.
  --out, -o <dir>      Output directory. Defaults to dist/decks/<deck>.
  --decks-dir <dir>    Where named decks live. Defaults to examples/decks.
  --help, -h           Show this help.

Examples:
  accessible-marp build layouts --theme basic
  accessible-marp build ./slides.md --out ./public
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

async function buildCommand (deckArg, opts) {
  const decksDir = opts['decks-dir'] || 'examples/decks'

  // Resolve the markdown source: a path, or a named deck under decksDir.
  let mdPath
  let deckName
  let sourceDir
  if (deckArg.endsWith('.md') || deckArg.includes('/')) {
    mdPath = resolve(deckArg)
    sourceDir = dirname(mdPath)
    deckName = basename(sourceDir) || basename(mdPath, '.md')
  } else {
    deckName = deckArg
    sourceDir = resolve(decksDir, deckName)
    mdPath = join(sourceDir, 'slides.md')
  }

  if (!(await exists(mdPath))) {
    throw new Error(`Deck not found: ${mdPath}`)
  }

  const outDir = resolve(opts.out || join('dist', 'decks', deckName))
  const markdown = await readFile(mdPath, 'utf8')
  const html = await renderDeck(markdown, { theme: opts.theme, basePath: sourceDir })

  await mkdir(outDir, { recursive: true })
  await writeFile(join(outDir, 'slides.html'), html)

  // Images are base64-inlined into the page, so only companion `demos/`
  // (standalone linked HTML pages) need copying next to the output.
  const demosSrc = join(sourceDir, 'demos')
  if (await exists(demosSrc)) {
    await cp(demosSrc, join(outDir, 'demos'), { recursive: true })
  }

  console.log(`Built "${deckName}" → ${join(outDir, 'slides.html')}`)
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
