'use strict'

const config = require('../config')
const jwt = require('jsonwebtoken')
const encryptor = require('simple-encryptor')(config.ENCRYPTOR_SECRET)
const axios = require('axios')
const checkAccess = require('./check-access')
const resolveSchools = require('./resolve-schools')
const logger = require('./logger')

module.exports = token => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error('Missing required signin jwt'))
    } else {
      jwt.verify(token, config.JWT_SECRET, async (error, decoded) => {
        if (error) {
          logger('error', ['verify-signin-jwt', 'JWT verification failed', error])
          reject(error)
        } else {
          const decrypted = encryptor.decrypt(decoded.data)
          const sessionUrl = `${config.SESSION_STORAGE_URL}/${decrypted.session}`

          axios.get(sessionUrl)
            .then(async result => {
              const user = encryptor.decrypt(result.data.value)
              const userId = user.sAMAccountName || user.uid || ''
              const mySchools = resolveSchools(user)

              const data = {
                userName: user.displayName || user.cn || '',
                userId: userId,
                company: user.company || config.api.defaults.company,
                mail: user.mail || config.api.defaults.mail,
                isAdmin: checkAccess(user),
                mySchools: mySchools
              }
              logger('info', ['verify-signin-jwt', 'External session retrieved', 'userId', data.userId])
              resolve(data)
            })
            .catch(error => {
              logger('error', ['verify-signin-jwt', 'Getting external session failed', 'sessionUrl', sessionUrl])
              logger('error', ['verify-signin-jwt', 'Getting external session failed', error])

              reject(error)
            })
        }
      })
    }
  })
}
