'use strict'

const jwt = require('jsonwebtoken')
const config = require('../config')
const pkg = require('../package.json')

module.exports = userId => {
  const payload = {
    system: pkg.name,
    version: pkg.version,
    caller: userId
  }

  const options = {
    expiresIn: '1m',
    issuer: 'https://auth.t-fk.no'
  }

  const token = jwt.sign(payload, config.JWT_SECRET, options)

  return token
}
