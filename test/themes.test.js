import { test } from 'node:test'
import assert from 'node:assert/strict'
import { listThemes, renderDeck } from '../src/index.js'

test('listThemes returns the bundled themes', async () => {
  const themes = await listThemes()
  assert.deepEqual(themes, ['basic', 'high-contrast'])
  assert.ok(!themes.includes('document'), 'document.css is not a selectable theme')
  assert.ok(!themes.includes('_template'), '_template.css is a partial, not a theme')
})

test('unknown theme name throws a helpful error', async () => {
  await assert.rejects(
    () => renderDeck('# Hi', { theme: 'does-not-exist' }),
    /Theme "does-not-exist" does not exist\. Available themes:/
  )
})

test('raw css can be supplied instead of a bundled theme', async () => {
  const html = await renderDeck('# Hi', { css: '/* @theme custom */\nsection { color: red; }' })
  assert.match(html, /color: red/)
})
