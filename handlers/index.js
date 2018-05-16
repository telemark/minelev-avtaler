const logger = require('../lib/logger')
const createViewOptions = require('../lib/create-view-options')

module.exports.getFrontpage = async (request, h) => {
  const yar = request.yar
  const userId = request.auth.credentials.data.userId
  const isAdmin = yar.get('isAdmin') || false
  const mySchools = yar.get('mySchools') || []
  const myClasses = yar.get('myClasses') || []

  if (mySchools.length === 0) {
    logger('info', ['index', 'getFrontpage', 'no schools', 'userId', userId])
  }

  let viewOptions = createViewOptions({credentials: request.auth.credentials, mySchools: mySchools, myClasses: myClasses, isAdmin: isAdmin})

  return h.view('index', viewOptions)
}

module.exports.getHelppage = async (request, h) => {
  const yar = request.yar
  const userId = request.auth.credentials.data.userId
  const isAdmin = yar.get('isAdmin') || false
  const mySchools = yar.get('mySchools') || []
  const myClasses = yar.get('myClasses') || []

  if (mySchools.length === 0) {
    logger('info', ['index', 'getHelppage', 'no schools', 'userId', userId])
  }

  let viewOptions = createViewOptions({credentials: request.auth.credentials, mySchools: mySchools, myClasses: myClasses, isAdmin: isAdmin})

  return h.view('help', viewOptions)
}
