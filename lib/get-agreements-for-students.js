const axios = require('axios')
const config = require('../config')
const generateSystemToken = require('./generate-system-token')
const logger = require('./logger')

module.exports = options => {
  return new Promise(async (resolve, reject) => {
    const token = generateSystemToken({
      secret: config.AVTALE_SERVICE_SECRET,
      userId: options.userId
    })
    const url = `${config.AVTALE_SERVICE_URL}/agreements/search`
    axios.defaults.headers.common['Authorization'] = token
    logger('info', ['get-agreements-for-students', 'userId', options.userId, 'students', options.students.length, 'start'])
    const ids = options.students.map(student => student.personalIdNumber)
    const payload = {
      'agreementUserId': {
        '$in': ids
      }
    }
    try {
      const { data } = await axios.post(url, payload)
      logger('info', ['get-agreements-for-students', 'userId', options.userId, 'success', 'agreements', data.length])
      resolve(data)
    } catch (error) {
      logger('error', ['get-agreements-for-students', 'userId', options.userId, error])
      reject(error)
    }
  })
}
