/**
 * Escape a value for safe insertion into HTML text or attribute content.
 * Nullish values become the empty string. The one escape helper for the whole
 * codebase — template shell, CLI index page, and highlight fallback all share
 * the same rules.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml (value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
