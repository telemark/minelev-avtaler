'use strict'

var formatDate = require('./formatDate')

module.exports = function (statuses) {
  var latest = statuses ? statuses[statuses.length - 1] : false
  if (latest) {
    return formatDate(latest.timeStamp)
  } else {
    return ''
  }
}
