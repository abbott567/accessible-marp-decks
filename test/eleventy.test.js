import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import Eleventy from '@11ty/eleventy'

const here = dirname(fileURLToPath(import.meta.url))
const demo = join(here, '..', 'examples', 'eleventy-demo')

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
