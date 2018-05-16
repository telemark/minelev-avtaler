'use strict'

const config = require('../config')

const isAdmin = function (line) {
  const match = new RegExp(config.ACCESS_GROUP)
  return match.test(line)
}

module.exports = data => {
  const memberships = data.memberOf || []
  const access = memberships.filter(isAdmin)

  return access.length > 0
}
