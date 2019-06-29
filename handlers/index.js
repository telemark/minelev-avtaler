const logger = require('../lib/logger')
const createViewOptions = require('../lib/create-view-options')

module.exports.getFrontpage = async (request, h) => {
  const userId = request.auth.credentials.data.userId
  const isAdmin = request.auth.credentials.data.isAdmin || false
  const mySchools = request.auth.credentials.data.mySchools || []
  const myClasses = request.auth.credentials.data.myClasses || []

  if (mySchools.length === 0) {
    logger('info', ['index', 'getFrontpage', 'no schools', 'userId', userId])
  }

  let viewOptions = createViewOptions({ credentials: request.auth.credentials, mySchools: mySchools, myClasses: myClasses, isAdmin: isAdmin })

  return h.view('index', viewOptions)
}

module.exports.getHelppage = async (request, h) => {
  const userId = request.auth.credentials.data.userId
  const isAdmin = request.auth.credentials.data.isAdmin || false
  const mySchools = request.auth.credentials.data.mySchools || []
  const myClasses = request.auth.credentials.data.myClasses || []

  if (mySchools.length === 0) {
    logger('info', ['index', 'getHelppage', 'no schools', 'userId', userId])
  }

  let viewOptions = createViewOptions({ credentials: request.auth.credentials, mySchools: mySchools, myClasses: myClasses, isAdmin: isAdmin })

  return h.view('help', viewOptions)
}
