'use strict'

module.exports = input => {
  if (input) {
    const list = input.split(':')
    return list.length > 1 ? list.splice(1, list.length).join(' : ') : input
  } else {
    return ''
  }
}
