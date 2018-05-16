'use strict'

module.exports = function (errorMessage) {
  var msg = ''

  if (errorMessage === 'InvalidCredentialsError') {
    msg = 'Du har tastet feil brukernavn og/eller passord. Vennligst prøv igjen.'
  }

  return msg
}
