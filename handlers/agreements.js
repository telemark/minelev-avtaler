const getStudents = require('../lib/get-students-in-class')
const getAgreements = require('../lib/get-agreements-for-students')
const logger = require('../lib/logger')
const createViewOptions = require('../lib/create-view-options')
const isValidAgreement = agreement => ['elevpc', 'boker', 'images'].includes(agreement.agreementType)

function getAgreementStatus (agreement) {
  let status = 'unknown'
  if (agreement.signs.includes('expired')) {
    status = 'expired'
  } else if (agreement.signs.includes('cancelled')) {
    status = 'cancelled'
  } else if (agreement.signs.includes('unsigned')) {
    status = 'unsigned'
  } else if (agreement.signs.includes('signed')) {
    status = 'signed'
  }
  return status
}

module.exports.getAgreements = async (request, h) => {
  const yar = request.yar
  const userId = request.auth.credentials.data.userId
  const isAdmin = yar.get('isAdmin') || false
  const mySchools = yar.get('mySchools') || []
  let myClasses = yar.get('myClasses') || []
  const classId = request.params.classID

  logger('info', ['agreements', 'getAgreements', 'classId', classId, 'userId', userId])

  const students = await getStudents({
    userId: userId,
    classId: classId
  })

  const agreements = await getAgreements({
    userId: userId,
    students: students
  })

  const groupedAgreements = agreements.reduce((prev, current) => {
    if (!prev.hasOwnProperty(current.agreementId)) {
      prev[current.agreementId] = Object.assign({}, current, {parts: []})
    }
    prev[current.agreementId].parts.push(current)
    return prev
  }, {})

  const validAgreements = Object.values(groupedAgreements).map(agreement => Object.assign({}, agreement, {signs: agreement.parts.map(a => a.status)})).filter(isValidAgreement)

  const repackedAgreements = validAgreements.reduce((prev, curr) => {
    if (!prev.hasOwnProperty(curr.agreementUserId)) {
      prev[curr.agreementUserId] = {}
    }
    prev[curr.agreementUserId][curr.agreementType] = {
      agreementId: curr.agreementId,
      status: getAgreementStatus(curr)
    }
    return prev
  }, {})

  const repackedStudents = students.map(student => Object.assign({}, student, repackedAgreements[student.personalIdNumber]))

  let viewOptions = createViewOptions({credentials: request.auth.credentials, mySchools: mySchools, myClasses: myClasses, isAdmin: isAdmin, agreements: repackedStudents, classID: classId})

  return h.view('agreements', viewOptions)
}
