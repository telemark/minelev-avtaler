const jwt = require('jsonwebtoken')
const pkg = require('../../package.json')

module.exports = options => {
  const payload = {
    system: pkg.name,
    version: pkg.version,
    caller: options.userId
  }

  const data = {
    expiresIn: '1m',
    issuer: 'https://auth.t-fk.no'
  }

  return `Bearer ${jwt.sign(payload, options.secret, data)}`
}
