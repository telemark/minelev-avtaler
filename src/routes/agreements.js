const handlers = require('../handlers/agreements')

module.exports = [
  {
    method: 'GET',
    path: '/agreements/{classID}',
    handler: handlers.getAgreements,
    config: {
      description: 'List all agreements from a class'
    }
  },
  {
    method: 'GET',
    path: '/agreements/download/{classID}',
    handler: handlers.downloadAgreements,
    config: {
      description: 'Download all agreements from a class'
    }
  },
  {
    method: 'GET',
    path: '/agreements/{userData}/details/{agreementID}',
    handler: handlers.getAgreementDetails,
    config: {
      description: 'Get details for an agreement'
    }
  },
  {
    method: 'GET',
    path: '/agreements/sign/{aid}',
    handler: handlers.doSignAgreement,
    config: {
      description: 'Sign agreement on behalf of user'
    }
  }
]
