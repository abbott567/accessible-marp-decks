/**
 * Make code blocks keyboard-scrollable as a safe, no-JS default: mark each as a
 * labelled region and put it in the tab order. The inlined runtime script (see
 * `src/core/runtime-script.js`) then *removes* these from any block that does
 * not actually overflow, so only genuinely scrollable code stays focusable.
 *
 * @param {import('cheerio').CheerioAPI} $
 */
export function modifyCodeBlocks ($) {
  $('pre code').each(function () {
    $(this).attr('role', 'region')
    $(this).attr('aria-label', 'Code block, scrollable')
    $(this).attr('tabindex', '0')
  })
}
