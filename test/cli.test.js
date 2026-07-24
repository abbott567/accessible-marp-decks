import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const run = promisify(execFile)
const here = dirname(fileURLToPath(import.meta.url))
const repo = join(here, '..')
const cli = join(repo, 'src', 'cli.js')

const node = (args, opts = {}) => run('node', [cli, ...args], { cwd: repo, ...opts })

/** Run the CLI expecting a non-zero exit; resolve with its stderr. */
async function expectFailure (args, opts = {}) {
  try {
    await node(args, opts)
    throw new Error('expected the CLI to exit non-zero')
  } catch (err) {
    assert.equal(err.code, 1, 'exit code 1')
    return err.stderr
  }
}

test('build resolves a named deck and writes a single slides.html', async () => {
  const out = await mkdtemp(join(tmpdir(), 'amd-'))
  try {
    const { stdout } = await node(['build', 'layouts', '--theme', 'basic', '--out', out])
    assert.match(stdout, /Built "layouts"/)
    const html = await readFile(join(out, 'slides.html'), 'utf8')
    assert.match(html, /<section[^>]*aria-label="Slide 1/)
  } finally {
    await rm(out, { recursive: true, force: true })
  }
})

test('build accepts a path to a markdown file', async () => {
  const out = await mkdtemp(join(tmpdir(), 'amd-'))
  try {
    await node(['build', 'test/fixtures/with-image.md', '--out', out])
    const html = await readFile(join(out, 'slides.html'), 'utf8')
    assert.match(html, /data:image\/png;base64,/)
  } finally {
    await rm(out, { recursive: true, force: true })
  }
})

test('build copies a companion demos/ folder and defaults the output dir', async () => {
  const work = await mkdtemp(join(tmpdir(), 'amd-'))
  try {
    const deck = join(work, 'decks', 'talk')
    await mkdir(join(deck, 'demos'), { recursive: true })
    await writeFile(join(deck, 'slides.md'), '---\ntitle: Talk\nmarp: true\ntheme: basic\n---\n\n# Talk\n')
    await writeFile(join(deck, 'demos', 'x.html'), '<p>demo</p>')

    // No --out: falls back to <cwd>/dist/decks/talk.
    await node(['build', join(deck, 'slides.md')], { cwd: work })
    const html = await readFile(join(work, 'dist', 'decks', 'talk', 'slides.html'), 'utf8')
    assert.match(html, /Talk/)
    const demo = await readFile(join(work, 'dist', 'decks', 'talk', 'demos', 'x.html'), 'utf8')
    assert.match(demo, /demo/)
  } finally {
    await rm(work, { recursive: true, force: true })
  }
})

test('build-all builds every deck, an index, and handles missing title/description', async () => {
  const work = await mkdtemp(join(tmpdir(), 'amd-'))
  try {
    const decks = join(work, 'decks')
    await mkdir(join(decks, 'alpha'), { recursive: true })
    await mkdir(join(decks, 'beta'), { recursive: true })
    await mkdir(join(decks, 'gamma'), { recursive: true })
    await writeFile(join(decks, 'alpha', 'slides.md'), '---\ntitle: Alpha\ndescription: First deck\nmarp: true\ntheme: basic\n---\n\n# Alpha\n')
    await writeFile(join(decks, 'beta', 'slides.md'), '---\ntitle: Beta\nmarp: true\ntheme: basic\n---\n\n# Beta\n')
    // gamma has neither title nor description → falls back to the folder name.
    await writeFile(join(decks, 'gamma', 'slides.md'), '---\nmarp: true\ntheme: basic\n---\n\n# Gamma\n')

    // No --out: defaults to <cwd>/dist/site.
    const { stdout } = await node(['build-all', 'decks'], { cwd: work })
    assert.match(stdout, /3 decks/)

    const index = await readFile(join(work, 'dist', 'site', 'index.html'), 'utf8')
    assert.match(index, /href="\.\/alpha\/"/)
    assert.match(index, /First deck/) // alpha's description rendered
    assert.match(index, /<a href="\.\/gamma\/">gamma<\/a>/) // title falls back to folder name
    await readFile(join(work, 'dist', 'site', 'beta', 'index.html'), 'utf8')
  } finally {
    await rm(work, { recursive: true, force: true })
  }
})

test('build resolves a named deck under a custom --decks-dir', async () => {
  const work = await mkdtemp(join(tmpdir(), 'amd-'))
  try {
    const decks = join(work, 'my-decks')
    await mkdir(join(decks, 'talk'), { recursive: true })
    await writeFile(join(decks, 'talk', 'slides.md'), '---\ntitle: Talk\nmarp: true\ntheme: basic\n---\n\n# Talk\n')
    await node(['build', 'talk', '--decks-dir', decks, '--out', join(work, 'out')])
    await readFile(join(work, 'out', 'slides.html'), 'utf8')
  } finally {
    await rm(work, { recursive: true, force: true })
  }
})

test('themes lists the bundled themes', async () => {
  const { stdout } = await node(['themes'])
  assert.equal(stdout.trim(), 'basic\nhigh-contrast')
})

test('--help and no arguments print usage', async () => {
  const help = await node(['--help'])
  assert.match(help.stdout, /Usage:/)
  const bare = await node([])
  assert.match(bare.stdout, /Usage:/)
})

test('legacy deck=/theme=/out= tokens still work', async () => {
  const out = await mkdtemp(join(tmpdir(), 'amd-'))
  try {
    await node(['deck=layouts', 'theme=basic', `out=${out}`])
    await readFile(join(out, 'slides.html'), 'utf8')
  } finally {
    await rm(out, { recursive: true, force: true })
  }
})

test('build-all keeps building when one deck fails', async () => {
  const work = await mkdtemp(join(tmpdir(), 'amd-'))
  try {
    const decks = join(work, 'decks')
    await mkdir(join(decks, 'good'), { recursive: true })
    await mkdir(join(decks, 'broken'), { recursive: true })
    await writeFile(join(decks, 'good', 'slides.md'), '---\ntitle: Good\nmarp: true\ntheme: basic\n---\n\n# Good\n')
    await writeFile(join(decks, 'broken', 'slides.md'), '---\ntitle: Broken\nmarp: true\ntheme: no-such-theme\n---\n\n# Broken\n')

    const stderr = await expectFailure(['build-all', 'decks'], { cwd: work })
    assert.match(stderr, /Failed "broken"/)
    assert.match(stderr, /1 of 2 decks failed to build/)

    // The healthy deck is still built and the index lists only it.
    const good = await readFile(join(work, 'dist', 'site', 'good', 'index.html'), 'utf8')
    assert.match(good, /aria-label="Slide 1: Good/)
    const index = await readFile(join(work, 'dist', 'site', 'index.html'), 'utf8')
    assert.match(index, /href="\.\/good\/"/)
    assert.ok(!index.includes('broken'), 'failed deck is not listed')
  } finally {
    await rm(work, { recursive: true, force: true })
  }
})

test('build-all with only broken decks exits non-zero without an index', async () => {
  const work = await mkdtemp(join(tmpdir(), 'amd-'))
  try {
    const decks = join(work, 'decks')
    await mkdir(join(decks, 'broken'), { recursive: true })
    await writeFile(join(decks, 'broken', 'slides.md'), '---\nmarp: true\ntheme: no-such-theme\n---\n\n# B\n')

    const stderr = await expectFailure(['build-all', 'decks'], { cwd: work })
    assert.match(stderr, /1 of 1 decks failed to build/)
    await assert.rejects(() => readFile(join(work, 'dist', 'site', 'index.html'), 'utf8'), 'no index written')
  } finally {
    await rm(work, { recursive: true, force: true })
  }
})

test('backslash-separated arguments are treated as paths, not deck names', async () => {
  const stderr = await expectFailure(['build', 'no-such-dir\\talk'])
  assert.match(stderr, /Deck not found/)
  // As a path it is resolved directly — the CLI must NOT go looking for
  // <decks-dir>/no-such-dir\talk/slides.md as if it were a deck name.
  assert.ok(!stderr.includes('slides.md'), 'not resolved as a named deck under decks-dir')
})

test('errors: missing deck, no deck argument, no directory, empty directory', async () => {
  assert.match(await expectFailure(['build', 'does-not-exist']), /Deck not found/)
  assert.match(await expectFailure(['build', './nope']), /Deck not found/) // path (has "/", not ".md")
  assert.match(await expectFailure(['build']), /No deck specified/)
  assert.match(await expectFailure(['build-all']), /No directory specified/)
  assert.match(await expectFailure(['build-all', 'no-such-dir']), /Directory not found/)

  const empty = await mkdtemp(join(tmpdir(), 'amd-'))
  try {
    assert.match(await expectFailure(['build-all', empty]), /No decks/)
  } finally {
    await rm(empty, { recursive: true, force: true })
  }
})
