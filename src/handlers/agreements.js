const { pack, unpack } = require('jcb64')
const getAge = require('get-age')
const dateFromPersonalId = require('birthdate-from-id')
const uuid = require('uuid/v4')
const os = require('os')
const fs = require('fs')
const getMyClasses = require('../lib/get-my-classes')
const getStudents = require('../lib/get-students-in-class')
const getAgreements = require('../lib/get-agreements-for-students')
const getSamtykker = require('../lib/get-samtykker-for-students')
const getAgreement = require('../lib/get-agreement-details')
const logger = require('../lib/logger')
const createViewOptions = require('../lib/create-view-options')
const generateExcelFile = require('../lib/generate-excel-file')
const isValidAgreement = agreement => ['elevpc', 'laeremidler', 'images'].includes(agreement.agreementType)

function getAgreementStatus (agreement) {
  let status = agreement.signs && agreement.signs.length > 0 ? agreement.signs.join('/') : 'unknown'
  if (status === 'expired/expired' || status === 'expired') {
    status = 'expired'
  } else if (status === 'cancelled/cancelled' || status === 'cancelled') {
    status = 'cancelled'
  } else if (status === 'unsigned/unsigned' || status === 'unsigned') {
    status = 'unsigned'
  } else if (status === 'signed/signed' || status === 'signed') {
    status = 'signed'
  } else if (status === 'exception/exception' || status === 'exception') {
    status = 'exception'
  } else if (status === 'manual/manual' || status === 'manual') {
    status = 'manual'
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

function ageSort (a, b) {
  let num = 0
  if (getAge(dateFromPersonalId(a.partUserId)) < getAge(dateFromPersonalId(b.partUserId))) {
    num = -1
  }
  if (getAge(dateFromPersonalId(a.partUserId)) > getAge(dateFromPersonalId(b.partUserId))) {
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
    'Bilder': data.images,
    'E-post': data.mail,
    Mobiltelefon: data.mobilePhone
  }
}

module.exports.downloadAgreements = async (request, h) => {
  const userId = request.auth.credentials.data.userId
  const mySchools = request.auth.credentials.data.mySchools || []
  const myClasses = getMyClasses(mySchools)
  const myClassIds = myClasses.map(c => c.id)
  const classId = request.params.classID
  const uniqueName = `${classId}-${uuid()}.xlsx`
  const filename = `${os.tmpdir()}/${uniqueName}`

  logger('info', ['agreements', 'downloadAgreements', 'classId', classId, 'userId', userId])

  if (myClassIds.includes(classId)) {
    const students = await getStudents({
      userId: userId,
      classId: classId
    })

    students.sort(nameSort)

    // Retrieves agreements and samtykker
    let [agreements, samtykker] = await Promise.all([
      getAgreements({
        userId: userId,
        students: students
      }),
      getSamtykker({
        userId: userId,
        students: students
      })
    ])

    // Filters images from agreements and concats with samtykker (basically images)
    agreements = agreements
      .filter(agreement => agreement.agreementType !== 'images')
      .concat(samtykker)

    const groupedAgreements = agreements.reduce((prev, current) => {
      if (!prev.hasOwnProperty(current.agreementId)) {
        prev[current.agreementId] = Object.assign({}, current, { parts: [] })
      }
      prev[current.agreementId].parts.push(current)
      prev[current.agreementId].parts.sort(ageSort)
      return prev
    }, {})

    const validAgreements = Object.values(groupedAgreements).map(agreement => Object.assign({}, agreement, { signs: agreement.parts.map(a => a.status) })).filter(isValidAgreement)

    const repackedAgreements = validAgreements.reduce((prev, curr) => {
      if (!prev.hasOwnProperty(curr.agreementUserId)) {
        prev[curr.agreementUserId] = {}
      }
      prev[curr.agreementUserId][curr.agreementType] = getAgreementStatus(curr)
      return prev
    }, {})

    const repackedStudents = students.map(student => Object.assign({}, student, repackedAgreements[student.personalIdNumber])).map(filterFields)

    await generateExcelFile({ filename: filename, data: repackedStudents })
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
  } else {
    logger('warn', ['agreements', 'getAgreements', 'classId', classId, 'userId', userId, 'classId not valid'])
    return h.response('Klasse ikke funnet. Har du tilgang?')
      .code(404)
  }
}

module.exports.getAgreements = async (request, h) => {
  const userId = request.auth.credentials.data.userId
  const isAdmin = request.auth.credentials.data.isAdmin || false
  const mySchools = request.auth.credentials.data.mySchools || []
  const myClasses = getMyClasses(mySchools)
  const myClassIds = myClasses.map(c => c.id)
  const classId = request.params.classID

  logger('info', ['agreements', 'getAgreements', 'classId', classId, 'userId', userId])

  if (myClassIds.includes(classId)) {
    logger('info', ['agreements', 'getAgreements', 'classId', classId, 'userId', userId, 'classId is valid'])
    const students = await getStudents({
      userId: userId,
      classId: classId
    })

    students.sort(nameSort)

    // Retrieves agreements and samtykker
    let [agreements, samtykker] = await Promise.all([
      getAgreements({
        userId: userId,
        students: students
      }),
      getSamtykker({
        userId: userId,
        students: students
      })
    ])

    // Filters images from agreements and concats with samtykker (basically images)
    agreements = agreements
      .filter(agreement => agreement.agreementType !== 'images')
      .concat(samtykker)

    const groupedAgreements = agreements.reduce((prev, current) => {
      if (!prev.hasOwnProperty(current.agreementId)) {
        prev[current.agreementId] = Object.assign({}, current, { parts: [] })
      }
      prev[current.agreementId].parts.push(current)
      prev[current.agreementId].parts.sort(ageSort)
      return prev
    }, {})

    const validAgreements = Object.values(groupedAgreements).map(agreement => Object.assign({}, agreement, { signs: agreement.parts.map(a => a.status) })).filter(isValidAgreement)

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

    const repackedStudents = students.map(student => Object.assign({}, student, repackedAgreements[student.personalIdNumber], { details: pack({ name: student.fullName, username: student.userName }) }))

    const viewOptions = createViewOptions({ credentials: request.auth.credentials, mySchools: mySchools, myClasses: myClasses, isAdmin: isAdmin, agreements: repackedStudents, classID: classId })

    return h.view('agreements', viewOptions)
  } else {
    logger('warn', ['agreements', 'getAgreements', 'classId', classId, 'userId', userId, 'classId not valid'])
    const viewOptions = createViewOptions({ credentials: request.auth.credentials, mySchools: mySchools, myClasses: myClasses, isAdmin: isAdmin, agreements: [], classID: classId })

    return h.view('agreements', viewOptions)
  }
}

module.exports.getAgreementDetails = async (request, h) => {
  const yar = request.yar
  const userId = request.auth.credentials.data.userId
  const isAdmin = request.auth.credentials.data.isAdmin || false
  const mySchools = request.auth.credentials.data.mySchools || []
  let myClasses = yar.get('myClasses') || []
  const userData = unpack(request.params.userData)
  const samtykkeId = request.params.agreementID
  const { isImage } = request.query

  logger('info', ['agreements', 'getAgreementDetails', 'userId', userId, 'samtykkeId', samtykkeId])

  let agreements = []

  if (isImage) {
    agreements = await getSamtykker({
      userId: userId,
      students: [{ userName: userData.username }]
    })
    agreements = agreements.filter(agreement => agreement.agreementId === samtykkeId)
  } else {
    agreements = await getAgreement({
      userId: userId,
      agreementId: samtykkeId
    })
  }

  let viewOptions = createViewOptions({ credentials: request.auth.credentials, mySchools: mySchools, myClasses: myClasses, isAdmin: isAdmin, agreements: agreements, userData: userData })

  return h.view('agreement-details', viewOptions)
}
