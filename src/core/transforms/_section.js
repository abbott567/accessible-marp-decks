/**
 * Turn each Marpit `<section>` (a slide) into an accessible landmark:
 * strips presentational Marpit attributes, adds an `aria-label`, gives the
 * slide heading a stable id + `aria-describedby`, and appends a footer with
 * screen-reader pagination. The responsive 16:9 scaling is applied by
 * `themes/document.css` directly to `div.marpit > section` (so Marpit's
 * theme scoping is preserved — the section must stay a child of `.marpit`).
 *
 * @param {import('cheerio').CheerioAPI} $
 */
export function modifySection ($) {
  $('section').each(function (index) {
    const $section = $(this)
    $section.removeAttr('data-theme')
    $section.removeAttr('data-footer')
    $section.removeAttr('data-paginate')
    $section.removeAttr('data-marpit-pagination-total')
    $section.removeAttr('data-class')
    $section.removeAttr('style')

    const backgroundImage = $section.attr('data-background-image')
    if (backgroundImage !== undefined) {
      $section.css('background-image', backgroundImage)
      $section.removeAttr('data-background-image')
    }

    const hasFooter = $section.find('footer').length > 0
    if (!hasFooter) $section.append('<footer></footer>')
    const $footer = $section.find('footer')

    // Marpit only sets data-marpit-pagination when `paginate: true`; fall back
    // to the slide's position so labels never read "Slide undefined".
    const pageNo = $section.attr('data-marpit-pagination') ?? String(index + 1)
    $section.removeAttr('data-marpit-pagination')

    // Only the slide's FIRST heading gets the stable id and describedby —
    // applying them to every heading would emit duplicate ids and concatenate
    // all heading text into the label.
    const $heading = $section.find(':header').first()
    if ($heading.length > 0) {
      $heading.attr('aria-describedby', `page-number-${pageNo}`)
      $heading.attr('id', `slide-${pageNo}`)
      $section.attr('aria-label', `Slide ${pageNo}: ${$heading.text()}`)
    } else {
      // No heading to point at: label the slide plainly, with no dangling colon.
      $section.attr('aria-label', `Slide ${pageNo}`)
    }

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
