'use strict'

module.exports = function (txt) {
  if (txt) {
    return txt.replace(/\n/g, '<br/>')
  } else {
    return ''
  }
}
