'use strict'

module.exports = function (statuses) {
  var latest = statuses ? statuses[statuses.length - 1] : false
  return latest ? latest.status : ''
}
