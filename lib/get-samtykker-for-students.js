const axios = require('axios')
const { SAMTYKKER_SERVICE_URL, SAMTYKKER_SERVICE_SECRET } = require('../config')
const generateSystemToken = require('./generate-system-token')
const logger = require('./logger')

module.exports = async options => {
  const token = generateSystemToken({
    secret: SAMTYKKER_SERVICE_SECRET,
    userId: options.userId
  })
  const url = `${SAMTYKKER_SERVICE_URL}/samtykker`
  const repack = samtykke => {
    const student = options.students.find(student => samtykke.userId === student.userName)
    const status = samtykke.state === true ? 'signed' : 'cancelled'
    const agreementId = samtykke._id
    return Object.assign({}, {
      status: status,
      agreementId: agreementId,
      agreementType: samtykke.agreement.id,
      partUserId: student.personalIdNumber,
      agreementUserId: student.personalIdNumber
    })
  }
  axios.defaults.headers.common['Authorization'] = token
  logger('info', ['get-samtykker-for-students', 'userId', options.userId, 'students', options.students.length, 'start'])
  if (options.students.length > 0) {
    const ids = options.students.map(student => student.userName)
    const payload = {
      userIds: ids
    }
    try {
      const { data } = await axios.post(url, payload)
      logger('info', ['get-samtykker-for-students', 'userId', options.userId, 'success', 'samtykker', data.length])
      return data.map(repack)
    } catch (error) {
      logger('error', ['get-samtykker-for-students', 'userId', options.userId, error])
      throw error
    }
  } else {
    logger('info', ['get-samtykker-for-students', 'userId', options.userId, 'no students - no lookup'])
    return []
  }
}
