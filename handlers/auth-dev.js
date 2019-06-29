const jwt = require('jsonwebtoken')
const pkg = require('../package.json')
const config = require('../config')
const verifyJwt = require('../lib/verify-jwt')
const resolveSchools = require('../lib/resolve-schools')
const logger = require('../lib/logger')

function buildUser () {
  return {
    userId: process.env.DEV_USER_ID,
    userName: process.env.DEV_USER_NAME,
    company: process.env.DEV_USER_COMPANY,
    mySchools: resolveSchools({ company: process.env.DEV_USER_COMPANY })
  }
}

function generateToken () {
  const payload = {
    system: pkg.name,
    version: pkg.version,
    caller: process.env.DEV_USER_ID
  }

  const options = {
    expiresIn: '1h',
    issuer: 'https://auth.t-fk.no'
  }

  const token = jwt.sign(payload, config.JWT_SECRET, options)

  return token
}

module.exports.doSignIn = async (request, h) => {
  const nextPath = request.query.nextPath
  const yar = request.yar
  const token = generateToken()
  logger('info', ['auth-dev', 'doSignIn', 'start'])
  const check = await verifyJwt(token)
  if (check.isValid === true) {
    logger('info', ['auth-dev', 'doSignIn', 'token is valid'])
    try {
      const user = buildUser()
      logger('info', ['auth-dev', 'doSignIn', 'user verified', 'userId', user.userId])

      yar.set('isAdmin', true)
      yar.set('mySchools', resolveSchools(user))
      yar.set('myClasses', [])

      request.cookieAuth.set({ data: user, token: token })

      if (nextPath && nextPath.length > 0) {
        logger('info', ['auth-dev', 'doSignIn', 'userId', user.userId, 'redirect to', nextPath])
        return h.redirect(nextPath)
      } else {
        logger('info', ['auth-dev', 'doSignIn', 'userId', user.userId, 'redirect to frontpage'])
        return h.redirect('/')
      }
    } catch (error) {
      logger('error', ['auth-dev', 'doSignIn', 'error', error])
      throw error
    }
  } else {
    logger('error', ['auth-dev', 'doSignIn', 'invalid token'])
    throw new Error('Invalid token')
  }
}

module.exports.doSignOut = (request, h) => {
  request.cookieAuth.clear()
  return { loggedOut: true }
}
