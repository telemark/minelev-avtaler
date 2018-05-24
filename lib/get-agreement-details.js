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
    logger('info', ['get-agreement-details', 'userId', options.userId, 'agreementId', options.agreementId, 'start'])
    const payload = {
      agreementId: options.agreementId
    }
    try {
      const { data } = await axios.post(url, payload)
      logger('info', ['get-agreement-details', 'userId', options.userId, 'success', 'agreements', data.length])
      resolve(data)
    } catch (error) {
      logger('error', ['get-agreement-details', 'userId', options.userId, error])
      reject(error)
    }
  })
}
