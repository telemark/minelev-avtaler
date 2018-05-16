const handlers = require('../handlers/auth')

module.exports = [
  {
    method: 'GET',
    path: '/signin',
    handler: handlers.doSignIn,
    config: {
      description: 'Sign in',
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/signout',
    handler: handlers.doSignOut,
    config: {
      description: 'Sign out'
    }
  }
]
