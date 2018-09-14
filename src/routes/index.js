const handlers = require('../handlers')

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: handlers.getFrontpage
  },
  {
    method: 'GET',
    path: '/help',
    handler: handlers.getHelppage,
    config: {
      description: 'Show the helppage'
    }
  }
]
