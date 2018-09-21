const getMyClasses = require('../lib/get-my-classes')
const logger = require('../lib/logger')
const createViewOptions = require('../lib/create-view-options')

module.exports.getClasses = async (request, h) => {
  const userId = request.auth.credentials.data.userId
  const isAdmin = request.auth.credentials.data.isAdmin || false
  const mySchools = request.auth.credentials.data.mySchools || []
  const myClasses = getMyClasses(mySchools)
  const schoolId = request.params.schoolID
  const mySchoolIds = mySchools.map(school => school.id)
  const selectedClasses = myClasses.filter(c => mySchoolIds.includes(c.schoolId))

  logger('info', ['classes', 'getClasses', 'got classes', selectedClasses.length, 'schoolId', schoolId, 'userId', userId])

  let viewOptions = createViewOptions({ credentials: request.auth.credentials, mySchools: mySchools, myClasses: selectedClasses, isAdmin: isAdmin })

  return h.view('classes', viewOptions)
}
