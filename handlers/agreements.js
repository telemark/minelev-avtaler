const { pack, unpack } = require('jcb64')
const getAge = require('get-age')
const dateFromPersonalId = require('birthdate-from-id')
const uuid = require('uuid/v4')
const os = require('os')
const fs = require('fs')
const getMyClasses = require('../lib/get-my-classes')
const getStudents = require('../lib/get-students-in-class')
const getIdentities = require('../lib/get-identities-for-students')
const mergeIdentities = require('../lib/merge-identities')
const getAgreements = require('../lib/get-agreements-for-students')
const getSamtykker = require('../lib/get-samtykker-for-students')
const getAgreement = require('../lib/get-agreement-details')
const signAgreement = require('../lib/sign-agreement')
const logger = require('../lib/logger')
const createViewOptions = require('../lib/create-view-options')
const generateExcelFile = require('../lib/generate-excel-file')
const isValidAgreement = agreement => ['elevpc', 'laeremidler', 'images'].includes(agreement.agreementType)

function fixMultipleSignatures (agreement) {
  let result = ''
  if (agreement.signs && agreement.signs.length > 2) {
    // If any of parents have signed it is valid
    const parentSigns = agreement.signs.slice(1)
    const joined = parentSigns.includes('signed') ? 'signed' : parentSigns.includes('unsigned') ? 'unsigned' : 'unknown'
    result = getAgreementStatus({ signs: [agreement.signs[0], joined] })
  } else {
    result = getAgreementStatus(agreement)
  }
  return result
}

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
    ElevPC: data.elevpc,
    Bilder: data.images,
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
    let students = await getStudents({
      userId: userId,
      classId: classId
    })

    const identities = await getIdentities({
      userId: userId,
      students: students
    })

    students = mergeIdentities(students, identities)

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
      if (!Object.prototype.hasOwnProperty.call(prev, current.agreementId)) {
        prev[current.agreementId] = Object.assign({}, current, { parts: [] })
      }
      prev[current.agreementId].parts.push(current)
      prev[current.agreementId].parts.sort(ageSort)
      return prev
    }, {})

    const validAgreements = Object.values(groupedAgreements).map(agreement => Object.assign({}, agreement, { signs: agreement.parts.map(a => a.status) })).filter(isValidAgreement)

    const repackedAgreements = validAgreements.reduce((prev, curr) => {
      if (!Object.prototype.hasOwnProperty.call(prev, curr.agreementUserId)) {
        prev[curr.agreementUserId] = {}
      }
      prev[curr.agreementUserId][curr.agreementType] = fixMultipleSignatures(curr)
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
    let students = await getStudents({
      userId: userId,
      classId: classId
    })

    const identities = await getIdentities({
      userId: userId,
      students: students
    })

    students = mergeIdentities(students, identities)

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
      if (!Object.prototype.hasOwnProperty.call(prev, current.agreementId)) {
        prev[current.agreementId] = Object.assign({}, current, { parts: [] })
      }
      prev[current.agreementId].parts.push(current)
      prev[current.agreementId].parts.sort(ageSort)
      return prev
    }, {})

    const validAgreements = Object.values(groupedAgreements).map(agreement => Object.assign({}, agreement, { signs: agreement.parts.map(a => a.status) })).filter(isValidAgreement)

    const repackedAgreements = validAgreements.reduce((prev, curr) => {
      if (!Object.prototype.hasOwnProperty.call(prev, curr.agreementUserId)) {
        prev[curr.agreementUserId] = {}
      }
      prev[curr.agreementUserId][curr.agreementType] = {
        agreementId: curr.agreementId,
        status: fixMultipleSignatures(curr)
      }
      return prev
    }, {})

    const repackedStudents = students.map(student => Object.assign({}, student, repackedAgreements[student.personalIdNumber], { details: pack({ name: student.fullName, username: student.userName, sam: student.sam }) }))
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
  const myClasses = yar.get('myClasses') || []
  const userData = unpack(request.params.userData)
  const samtykkeId = request.params.agreementID
  const { isImage, classId } = request.query
  const isUnknown = id => id === 'unknown'

  logger('info', ['agreements', 'getAgreementDetails', 'userId', userId, 'samtykkeId', samtykkeId])

  let agreements = []

  if (!isUnknown(samtykkeId)) {
    if (isImage) {
      agreements = await getSamtykker({
        userId: userId,
        students: userData.sam !== undefined ? [{ sam: userData.sam }] : []
      })
      agreements = agreements.filter(agreement => agreement.agreementId === samtykkeId)
    } else {
      agreements = await getAgreement({
        userId: userId,
        agreementId: samtykkeId
      })
    }
  }

  const viewOptions = createViewOptions({ credentials: request.auth.credentials, mySchools: mySchools, myClasses: myClasses, isAdmin: isAdmin, agreements: agreements, userData: userData, classID: classId })

  return h.view('agreement-details', viewOptions)
}

module.exports.doSignAgreement = async (request, h) => {
  const userId = request.auth.credentials.data.userId
  const userName = request.auth.credentials.data.userName
  const aid = request.params.aid
  const { classId } = request.query
  const options = {
    userId: userId,
    userName: userName,
    aid: aid
  }
  try {
    logger('info', ['agreements', 'doSignAgreement', 'userId', userId, 'aid', aid, 'start'])
    await signAgreement(options)
    logger('info', ['agreements', 'doSignAgreement', 'userId', userId, 'aid', aid, 'success'])
  } catch (error) {
    logger('error', ['agreements', 'doSignAgreement', 'userId', userId, 'aid', aid, error])
  }
  return h.redirect(`/agreements/${classId}`)
}
