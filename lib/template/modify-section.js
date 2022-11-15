function modifySection ($) {
  $('section').each(function () {
    const $section = $(this)
    $section.removeAttr('data-theme')
    $section.removeAttr('data-footer')
    $section.removeAttr('data-paginate')
    $section.removeAttr('style')

    const backgroundImage = $section.attr('data-background-image')
    if (backgroundImage !== undefined) $section.css('background-image', backgroundImage)

    const hasFooter = $(this).find('footer').length > 0
    if (!hasFooter) $(this).append('<footer></footer>')
    const $footer = $(this).find('footer')

    const pageNo = $(this).attr('data-marpit-pagination')
    $section.removeAttr('data-marpit-pagination')

    const $heading = $(this).find(':header')
    $heading.attr('aria-describedby', `page-number-${pageNo}`)
    $heading.attr('id', `slide-${pageNo}`)

    $section.attr('aria-label', `Slide ${pageNo}: ${$heading.text()}`)

    $footer.append(`
      <div class="pagination">
        <p class="visually-hidden">End of slide ${pageNo}</p>
        <p id="page-number-${pageNo}" aria-hidden="true">
          <span class="visually-hidden">slide </span>
          <span>${pageNo}</span>
        </p>
      </div>
    `)
  })
}

module.exports = modifySection
