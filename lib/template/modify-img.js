function modifyImg ($) {
  $('img').each(function () {
    $(this).attr('width', 500)
  })
}

module.exports = modifyImg
