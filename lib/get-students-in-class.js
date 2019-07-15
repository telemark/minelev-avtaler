const axios = require('axios')
const config = require('../config')
const generateSystemToken = require('./generate-system-token')
const logger = require('./logger')

module.exports = async options => {
  const token = generateSystemToken({
    secret: config.BUDDY_SERVICE_SECRET,
    userId: options.userId
  })
  const url = `${config.BUDDY_SERVICE_URL}/classes/${options.classId}/students`
  axios.defaults.headers.common['Authorization'] = token
  logger('info', ['get-students-in-class', 'userId', options.userId, 'classId', options.classId, 'start'])
  try {
    const { data } = await axios.get(url)
    logger('info', ['get-students-in-class', 'userId', options.userId, 'classId', options.classId, 'success', 'students', data.length])
    return data
  } catch (error) {
    logger('error', ['get-students-in-class', 'userId', options.userId, 'classId', options.classId, error])
    throw error
  }
}
