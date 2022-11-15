function modifyCodeBlocks ($) {
  $('pre code').each(function () {
    $(this).attr('role', 'figure')
    $(this).attr('aria-label', 'Code example')
    $(this).attr('tabindex', 0)
  })
}

module.exports = modifyCodeBlocks
