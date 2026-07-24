import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import Eleventy from '@11ty/eleventy'
import accessibleMarp from '../src/eleventy.js'

const here = dirname(fileURLToPath(import.meta.url))
const demo = join(here, '..', 'examples', 'eleventy-demo')
const fixtures = join(here, 'fixtures')

test('plugin registers the default .deck extension and honours front-matter theme', async () => {
  // Drive the plugin with a mock config to capture what it registers, then run
  // its hooks directly — no options, so the deck's own front-matter theme wins.
  let format
  let ext
  const config = {
    addTemplateFormats: (f) => { format = f },
    addExtension: (e, opts) => { ext = { name: e, opts } }
  }
  accessibleMarp(config)

  assert.equal(format, 'deck')
  assert.equal(ext.name, 'deck')

  const inputPath = join(fixtures, 'with-image.md')
  const data = await ext.opts.getData(inputPath)
  assert.equal(data.theme, 'basic')

  const render = ext.opts.compile(null, inputPath)
  const html = await render(data)
  assert.match(html, /<section[^>]*aria-label="Slide 1: Local image/)
})

// The demo config uses input/output dirs relative to its own location, so run
// the build with the demo as the working directory (as a real user would).
let cwd
before(() => { cwd = process.cwd(); process.chdir(demo) })
after(() => { process.chdir(cwd) })

test('eleventy plugin renders a deck into an accessible page', async () => {
  const eleventy = new Eleventy(undefined, undefined, {
    configPath: join(demo, 'eleventy.config.js')
  })

  const results = await eleventy.toJSON()
  const page = results.find(r => r.url.includes('my-talk'))

  assert.ok(page, 'a my-talk page was produced')
  assert.match(page.content, /<!DOCTYPE html>/)
  assert.match(page.content, /<section[^>]*aria-label="Slide 1: My Talk/)
  assert.match(page.content, /id="slide-1"/)
})
