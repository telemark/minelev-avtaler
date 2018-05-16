'use strict'

module.exports = function (mainGroupName) {
  if (mainGroupName) {
    const list = mainGroupName.split(':')
    return list.length === 2 ? list[1] : mainGroupName
  } else {
    return ''
  }
}
