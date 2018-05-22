const handlers = require('../handlers/classes')

module.exports = [
  {
    method: 'GET',
    path: '/classes/{schoolID}',
    handler: handlers.getClasses,
    config: {
      description: 'List all classes from a school'
    }
  }
]
