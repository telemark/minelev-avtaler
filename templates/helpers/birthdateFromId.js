'use strict'

const datePadding = require('../../lib/date-padding')

module.exports = function birthdateFromId (id) {
  if (!id) {
    throw new Error('Missing required input')
  }

  const personalid = id.toString().replace(/\D+/, '').toString()

  if (personalid.length !== 11) {
    throw new Error('Input must be 11 digits')
  }

  const now = new Date()
  const personalYearEnd = parseInt(personalid.substr(4, 2), 10)
  const realYearEnd = parseInt(now.getFullYear().toString().substr(2, 2), 10)
  var realYearStart = parseInt(now.getFullYear().toString().substr(0, 2), 10)
  var birthYear

  if (personalYearEnd > realYearEnd) {
    realYearStart--
  }

  birthYear = realYearStart.toString() + datePadding(personalYearEnd.toString())

  return personalid.substr(0, 2) + '.' + personalid.substr(2, 2) + '.' + birthYear
}
