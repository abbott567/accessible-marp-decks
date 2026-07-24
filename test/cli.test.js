import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFile, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const run = promisify(execFile)
const here = dirname(fileURLToPath(import.meta.url))
const repo = join(here, '..')
const cli = join(repo, 'src', 'cli.js')

test('build-all builds every deck plus a landing index', async () => {
  const out = await mkdtemp(join(tmpdir(), 'amd-cli-'))
  try {
    await run('node', [cli, 'build-all', 'examples/decks', '--out', out], { cwd: repo })

    // Landing page links to the layouts deck.
    const index = await readFile(join(out, 'index.html'), 'utf8')
    assert.match(index, /<h1>Slide decks<\/h1>/)
    assert.match(index, /href="\.\/layouts\/"/)

    // Each deck is a self-contained page at /<name>/index.html with inlined images.
    const deck = await readFile(join(out, 'layouts', 'index.html'), 'utf8')
    assert.match(deck, /<section[^>]*aria-label="Slide 1/)
    assert.match(deck, /data:image\/svg\+xml;base64,/)
  } finally {
    await rm(out, { recursive: true, force: true })
  }
})
