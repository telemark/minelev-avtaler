const { pack, unpack } = require('jcb64')
const uuid = require('uuid/v4')
const os = require('os')
const fs = require('fs')
const getStudents = require('../lib/get-students-in-class')
const getAgreements = require('../lib/get-agreements-for-students')
const getAgreement = require('../lib/get-agreement-details')
const logger = require('../lib/logger')
const createViewOptions = require('../lib/create-view-options')
const generateExcelFile = require('../lib/generate-excel-file')
const isValidAgreement = agreement => ['elevpc', 'laeremidler'].includes(agreement.agreementType)

function getAgreementStatus (agreement) {
  let status = agreement.signs && agreement.signs.length > 0 ? agreement.signs.join('/') : 'unknown'
  if (status === 'expired/expired') {
    status = 'expired'
  } else if (status === 'cancelled/cancelled') {
    status = 'cancelled'
  } else if (status === 'unsigned/unsigned') {
    status = 'unsigned'
  } else if (status === 'signed/signed') {
    status = 'signed'
  }
  return status
}

function nameSort (a, b) {
  let num = 0
  if (a.lastName < b.lastName) {
    num = -1
  }
  if (a.lastName > b.lastName) {
    num = 1
  }
  return num
}

function filterFields (data) {
  return {
    Etternavn: data.lastName,
    Fornavn: data.firstName,
    'ElevPC': data.elevpc,
    'Læremidler': data.laeremidler,
    'E-post': data.mail,
    Mobiltelefon: data.mobilePhone
  }
}

module.exports.downloadAgreements = async (request, h) => {
  const userId = request.auth.credentials.data.userId
  const classId = request.params.classID
  const uniqueName = `${classId}-${uuid()}.xlsx`
  const filename = `${os.tmpdir()}/${uniqueName}`

  logger('info', ['agreements', 'downloadAgreements', 'classId', classId, 'userId', userId])

  const students = await getStudents({
    userId: userId,
    classId: classId
  })

  students.sort(nameSort)

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
    prev[curr.agreementUserId][curr.agreementType] = getAgreementStatus(curr)
    return prev
  }, {})

  const repackedStudents = students.map(student => Object.assign({}, student, repackedAgreements[student.personalIdNumber])).map(filterFields)

  await generateExcelFile({filename: filename, data: repackedStudents})
  const excel = fs.readFileSync(filename)

  request.raw.req.once('end', () => {
    logger('info', ['agreements', 'downloadAgreements', 'user', userId, uniqueName, 'success'])
    try {
      fs.unlinkSync(filename)
      logger('info', ['agreements', 'downloadAgreements', 'user', userId, uniqueName, 'cleanup finished'])
    } catch (error) {
      logger('error', ['agreements', 'downloadAgreements', 'user', userId, 'unlink', error])
    }
  })

  return h.response(excel)
    .header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    .header('Content-Disposition', 'attachment; filename=' + uniqueName)
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

  students.sort(nameSort)

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

  const repackedStudents = students.map(student => Object.assign({}, student, repackedAgreements[student.personalIdNumber], {details: pack({name: student.fullName, username: student.userName})}))

  const viewOptions = createViewOptions({credentials: request.auth.credentials, mySchools: mySchools, myClasses: myClasses, isAdmin: isAdmin, agreements: repackedStudents, classID: classId})

  return h.view('agreements', viewOptions)
}

module.exports.getAgreementDetails = async (request, h) => {
  const yar = request.yar
  const userId = request.auth.credentials.data.userId
  const isAdmin = yar.get('isAdmin') || false
  const mySchools = yar.get('mySchools') || []
  let myClasses = yar.get('myClasses') || []
  const userData = unpack(request.params.userData)
  const agreementId = request.params.agreementID

  logger('info', ['agreements', 'getAgreementDetails', 'userId', userId, 'agreementId', agreementId])

  const agreements = await getAgreement({
    userId: userId,
    agreementId: agreementId
  })

  let viewOptions = createViewOptions({credentials: request.auth.credentials, mySchools: mySchools, myClasses: myClasses, isAdmin: isAdmin, agreements: agreements, userData: userData})

  return h.view('agreement-details', viewOptions)
}
