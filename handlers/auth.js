const config = require('../config')
const lookupUser = require('../lib/lookup-user')
const verifyJwt = require('../lib/verify-jwt')
const logger = require('../lib/logger')

module.exports.doSignIn = async (request, h) => {
  const token = request.query.jwt
  const nextPath = request.query.nextPath
  const yar = request.yar
  const check = await verifyJwt(token)
  if (check.isValid === true) {
    logger('info', ['auth', 'doSignIn', 'token is valid'])
    try {
      const user = await lookupUser(token)
      logger('info', ['auth', 'doSignIn', 'user verified', 'userId', user.userId])

      yar.set('isAdmin', user.isAdmin)
      yar.set('mySchools', user.mySchools)
      yar.set('myClasses', [])

      request.cookieAuth.set({ data: user, token: token })

      if (nextPath && nextPath.length > 0) {
        return h.redirect(nextPath)
      } else {
        return h.redirect('/')
      }
    } catch (error) {
      logger('error', ['auth', 'doSignIn', 'error', error])
      return h(error)
    }
  } else {
    logger('error', ['auth', 'doSignIn', 'invalid token'])
    return h(new Error('Invalid token'))
  }
}

module.exports.doSignOut = (request, h) => {
  request.cookieAuth.clear()
  if (config.LOGOUT_URL) {
    return h.redirect(`${config.LOGOUT_URL}`)
  } else {
    return h.redirect(`${config.AUTH_SERVICE_URL}/logout`)
  }
}
