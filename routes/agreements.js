const handlers = require('../handlers/agreements')

module.exports = [
  {
    method: 'GET',
    path: '/agreements/{classID}',
    handler: handlers.getAgreements,
    config: {
      description: 'List all agreements from a class'
    }
  }
]
