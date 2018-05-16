'use strict'

const jwt = require('jsonwebtoken')
const config = require('../config')
const logger = require('./logger')

module.exports = token => {
  return new Promise((resolve, reject) => {
    logger('info', ['verify-jwt'])
    jwt.verify(token, config.JWT_SECRET, (error, decoded) => {
      if (error) {
        logger('error', ['verify-jwt', 'invalid token'])
        resolve({isValid: false})
      } else {
        logger('info', ['verify-jwt', 'token is valid'])
        resolve({isValid: true})
      }
    })
  })
}
