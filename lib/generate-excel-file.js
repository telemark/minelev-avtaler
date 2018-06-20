const xlsx = require('tfk-json-to-xlsx')
const logger = require('./logger')

module.exports = options => {
  return new Promise((resolve, reject) => {
    xlsx.write(options.filename, options.data, error => {
      if (error) {
        logger('error', ['generate-excel-file', error])
        return reject(error)
      } else {
        logger('info', ['generate-exel-file', 'file generated'])
        return resolve(true)
      }
    })
  })
}
