const axios = require('axios')
const { IDENTITY_SERVICE_URL, IDENTITY_SERVICE_SECRET } = require('../config')
const generateSystemToken = require('./generate-system-token')
const logger = require('./logger')

module.exports = async options => {
  const token = generateSystemToken({
    secret: IDENTITY_SERVICE_SECRET,
    userId: options.userId
  })
  const url = `${IDENTITY_SERVICE_URL}/identities/fnrs`
  axios.defaults.headers.common.Authorization = token
  logger('info', ['lib', 'get-identities-for-students', 'userId', options.userId, 'students', options.students.length, 'start'])
  if (options.students.length > 0) {
    const fnrs = options.students.map(student => student.personalIdNumber)
    const payload = {
      fnrs: fnrs
    }
    try {
      const { data } = await axios.post(url, payload)
      logger('info', ['lib', 'get-identities-for-students', 'userId', options.userId, 'success', 'identities', data.length])
      return data
    } catch (error) {
      logger('error', ['lib', 'get-identities-for-students', 'userId', options.userId, error])
      throw error
    }
  } else {
    logger('info', ['lib', 'get-identities-for-students', 'userId', options.userId, 'no students - no lookup'])
    return []
  }
}
