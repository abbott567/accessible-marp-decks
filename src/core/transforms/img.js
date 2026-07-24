/**
 * Constrain image sizing. Only sets a `width` when one isn't already present
 * (e.g. via an inline style in the source markdown), so author intent wins.
 *
 * @param {import('cheerio').CheerioAPI} $
 * @param {object} [options]
 * @param {number} [options.imageWidth=500] - Default width in pixels.
 */
export function modifyImg ($, { imageWidth = 500 } = {}) {
  $('img').each(function () {
    const $img = $(this)
    if ($img.attr('width') === undefined) $img.attr('width', String(imageWidth))
  })
}
