'use strict'

const jwt = require('jsonwebtoken')
const config = require('../config')

module.exports = (request, session, callback) => {
  const credentials = session
  if (!credentials) {
    console.log('Missing credentials')
    return callback(null, false)
  } else {
    const token = credentials.token
    jwt.verify(token, config.JWT_SECRET, (error, decoded) => {
      if (error) {
        console.log('JWT verification failed')
        return callback(null, false)
      } else {
        return callback(null, decoded)
      }
    })
  }
}
