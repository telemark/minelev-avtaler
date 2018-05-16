'use strict'

module.exports = function (myId, highlightId) {
  if (myId && highlightId) {
    return myId.toString() === highlightId.toString() ? 'highlight-me' : ''
  } else {
    return ''
  }
}
