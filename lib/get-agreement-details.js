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
    const url = `${config.AVTALE_SERVICE_URL}/agreements/${options.agreementId}`
    axios.defaults.headers.common['Authorization'] = token
    logger('info', ['get-agreement-details', 'userId', options.userId, 'agreementId', options.agreementId, 'start'])
    try {
      const { data } = await axios.get(url)
      let results = [
        {
          status: data.isSigned ? 'signed' : 'unknown',
          agreementId: data.aid,
          name: data.name,
          partId: data.fid,
          agreementType: data.type,
          partUserId: data.uid,
          agreementUserId: data.uid
        }
      ]
      if (data.parts.length > 0) {
        data.parts.map(part => {
          const agreement = {
            status: part.isSigned ? 'signed' : 'unknown',
            agreementId: part.aid,
            name: part.name,
            agreementType: data.type,
            partId: part.fid,
            partUserId: part.uid,
            agreementUserId: data.uid
          }
          results.push(agreement)
        })
      }
      logger('info', ['get-agreement-details', 'userId', options.userId, 'success', 'agreements', results.length])
      resolve(results)
    } catch (error) {
      logger('error', ['get-agreement-details', 'userId', options.userId, error])
      reject(error)
    }
  })
}
