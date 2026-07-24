/**
 * Make code blocks accessible: expose them as figures with a label and make
 * them keyboard-focusable so they can be scrolled by keyboard users.
 *
 * @param {import('cheerio').CheerioAPI} $
 */
export function modifyCodeBlocks ($) {
  $('pre code').each(function () {
    $(this).attr('role', 'figure')
    $(this).attr('aria-label', 'Code example')
    $(this).attr('tabindex', '0')
  })
}
