const axios = require('axios')
const config = require('../config')
const generateSystemToken = require('./generate-system-token')
const logger = require('./logger')

function resolveStatus (agreement) {
  let status = 'unsigned'
  if (agreement.isSigned === true) {
    status = 'signed'
  } else if (agreement.status && agreement.status === 'cancelled') {
    status = 'cancelled'
  }
  return status
}

module.exports = async options => {
  const token = generateSystemToken({
    secret: config.AVTALE_SERVICE_SECRET,
    userId: options.userId
  })
  const url = `${config.AVTALE_SERVICE_URL}/agreements/search`
  axios.defaults.headers.common.Authorization = token
  logger('info', ['get-agreements-for-students', 'userId', options.userId, 'students', options.students.length, 'start'])
  if (options.students.length > 0) {
    const ids = options.students.map(student => student.personalIdNumber)
    const payload = {
      uids: ids,
      type: config.AVTALE_SERVICE_TYPE
    }
    try {
      const { data } = await axios.post(url, payload)
      logger('info', ['get-agreements-for-students', 'userId', options.userId, 'success', 'agreements', data.length])
      const result = data.reduce((acc, current) => {
        const agreement = {
          status: resolveStatus(current),
          agreementId: current.aid,
          agreementType: current.type,
          partUserId: current.uid,
          agreementUserId: current.uid
        }
        acc.push(agreement)
        if (current.parts.length > 0) {
          current.parts.map(part => {
            const agreement = {
              status: resolveStatus(part),
              agreementId: current.aid,
              agreementType: current.type,
              partUserId: part.uid,
              agreementUserId: current.uid
            }
            acc.push(agreement)
          })
        }
        return acc
      }, [])
      return result
    } catch (error) {
      logger('error', ['get-agreements-for-students', 'userId', options.userId, error])
      throw error
    }
  } else {
    logger('info', ['get-agreements-for-students', 'userId', options.userId, 'no students - no lookup'])
    return []
  }
}
