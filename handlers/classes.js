const logger = require('../lib/logger')
const resolveClasses = require('../lib/resolve-classes')
const createViewOptions = require('../lib/create-view-options')

module.exports.getClasses = async (request, h) => {
  const yar = request.yar
  const userId = request.auth.credentials.data.userId
  const isAdmin = yar.get('isAdmin') || false
  const mySchools = yar.get('mySchools') || []
  let myClasses = yar.get('myClasses') || []
  const schoolId = request.params.schoolID

  if (myClasses.length === 0) {
    logger('info', ['classes', 'getClasses', 'looking up classes', 'schoolId', schoolId, 'userId', userId])
    const selectedClasses = await resolveClasses({id: userId, schoolId: schoolId})
    const mySchoolIds = mySchools.map(school => school.id)
    myClasses = selectedClasses.filter(c => mySchoolIds.includes(c.schoolId))
    logger('info', ['classes', 'getClasses', 'looking up classes', 'schoolId', schoolId, 'userId', userId, 'number of classes', myClasses.length])
    yar.set('myClasses', myClasses)
  } else {
    logger('info', ['classes', 'getClasses', 'got classes', 'schoolId', schoolId, 'userId', userId])
  }

  let viewOptions = createViewOptions({credentials: request.auth.credentials, mySchools: mySchools, myClasses: myClasses, isAdmin: isAdmin})

  return h.view('classes', viewOptions)
}
