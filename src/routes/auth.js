const handlers = require(process.env.NODE_ENV !== 'development' ? '../handlers/auth' : '../handlers/auth-dev')

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
